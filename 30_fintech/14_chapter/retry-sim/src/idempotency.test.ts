import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IdempotencyStore } from './idempotency.ts';

const transient = () => Promise.reject({ status: 504, message: 'Gateway Timeout' });
const declined = () => Promise.reject({ status: 402, message: 'card_declined' });

test('same key executes the charge once and replays the result', async () => {
  const store = new IdempotencyStore<{ reference: string }>();
  let calls = 0;
  const gateway = async () => {
    calls++;
    return { reference: `gw_${calls}` };
  };

  const first = await store.run('charge_123', gateway);
  const second = await store.run('charge_123', gateway);

  assert.equal(calls, 1, 'gateway must be called exactly once');
  assert.deepEqual(second, first);
});

test('a concurrent duplicate is rejected, not replayed', async () => {
  const store = new IdempotencyStore<{ reference: string }>();
  let release: () => void = () => {};
  const slowGateway = () =>
    new Promise<{ reference: string }>((resolve) => {
      release = () => resolve({ reference: 'gw_1' });
    });

  const inFlight = store.run('charge_123', slowGateway);
  await assert.rejects(store.run('charge_123', slowGateway), /already in flight/);

  release();
  await inFlight;
});

test('a timeout leaves the key in unknown, blocking blind retries', async () => {
  const store = new IdempotencyStore<{ reference: string }>();
  let calls = 0;
  const gateway = () => {
    calls++;
    return transient();
  };

  await assert.rejects(store.run('charge_123', gateway));
  assert.equal(store.peek('charge_123')?.status, 'unknown');

  await assert.rejects(store.run('charge_123', gateway), /unknown — reconcile/);
  assert.equal(calls, 1, 'the money may have moved: do not charge again');
});

test('a definitive rejection frees the key for a legitimate retry', async () => {
  const store = new IdempotencyStore<{ reference: string }>();
  let calls = 0;
  const gateway = () => {
    calls++;
    return declined();
  };

  await assert.rejects(store.run('charge_123', gateway));
  assert.equal(store.peek('charge_123'), undefined);

  await assert.rejects(store.run('charge_123', gateway));
  assert.equal(calls, 2, 'a declined card never moved money, so retrying is safe');
});
