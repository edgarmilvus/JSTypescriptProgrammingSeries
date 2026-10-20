import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CircuitBreaker, CircuitOpenError } from './breaker.ts';
import { IdempotencyStore } from './idempotency.ts';
import { chargeCustomer, type Charge, type ChargeDeps } from './pipeline.ts';
import type { RetryPolicy } from './retry.ts';

const charge: Charge = { idempotencyKey: 'charge_123', amountCents: 4_999, currency: 'USD' };

const fastRetry: RetryPolicy = { maxAttempts: 3, baseDelayMs: 1, maxDelayMs: 5 };

class GatewayError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function makeDeps(gateway: ChargeDeps['gateway'], overrides: Partial<ChargeDeps> = {}): ChargeDeps {
  return {
    store: new IdempotencyStore(),
    breaker: new CircuitBreaker({
      windowSize: 4,
      failureRateThreshold: 0.5,
      openDurationMs: 10_000,
      probesToClose: 1,
    }),
    gateway,
    policy: fastRetry,
    ...overrides,
  };
}

test('a transient blip is absorbed and every attempt carries the same key', async () => {
  const keys: string[] = [];
  const d = makeDeps(async (c) => {
    keys.push(c.idempotencyKey);
    if (keys.length < 3) throw new GatewayError(504, 'Gateway Timeout');
    return { reference: 'gw_abc', amountCents: c.amountCents };
  });

  const result = await chargeCustomer(charge, d);

  assert.equal(result.reference, 'gw_abc');
  assert.equal(keys.length, 3, 'two retries');
  assert.deepEqual(new Set(keys).size, 1, 'the key must not change between attempts');
});

test('a repeated request is replayed, not charged twice', async () => {
  let calls = 0;
  const d = makeDeps(async () => {
    calls++;
    return { reference: `gw_${calls}`, amountCents: charge.amountCents };
  });

  const first = await chargeCustomer(charge, d);
  const second = await chargeCustomer(charge, d);

  assert.equal(calls, 1);
  assert.deepEqual(second, first);
});

test('an unresolved timeout blocks a second attempt with the same key', async () => {
  let calls = 0;
  const d = makeDeps(async () => {
    calls++;
    throw new GatewayError(504, 'Gateway Timeout');
  });

  await assert.rejects(chargeCustomer(charge, d), /Gateway Timeout/);
  const afterFirst = calls;

  await assert.rejects(chargeCustomer(charge, d), /unknown — reconcile/);
  assert.equal(calls, afterFirst, 'no network call while the outcome is unknown');
});

test('the breaker stops new keys once the gateway is known-dead', async () => {
  let calls = 0;
  const d = makeDeps(
    async () => {
      calls++;
      throw new GatewayError(503, 'Service Unavailable');
    },
    { policy: { maxAttempts: 1, baseDelayMs: 1, maxDelayMs: 5 } },
  );

  for (let i = 0; i < 4; i++) {
    await assert.rejects(chargeCustomer({ ...charge, idempotencyKey: `charge_${i}` }, d));
  }
  const callsBeforeOpen = calls;

  await assert.rejects(
    chargeCustomer({ ...charge, idempotencyKey: 'charge_999' }, d),
    CircuitOpenError,
  );
  assert.equal(calls, callsBeforeOpen, 'zero network calls while the circuit is open');
});
