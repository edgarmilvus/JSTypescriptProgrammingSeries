import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CircuitBreaker, CircuitOpenError } from './breaker.ts';

const opts = {
  windowSize: 4,
  failureRateThreshold: 0.5,
  openDurationMs: 50,
  probesToClose: 1,
};

const boom = () => Promise.reject(new Error('504 Gateway Timeout'));
const ok = () => Promise.resolve('charged');

test('stays closed while the failure rate is below threshold', async () => {
  const breaker = new CircuitBreaker(opts);

  await breaker.execute(ok);
  await breaker.execute(ok);
  await breaker.execute(ok);
  await assert.rejects(breaker.execute(boom));

  // 1 failure in 4 = 0.25 < 0.5
  assert.equal(breaker.currentState, 'closed');
});

test('trips open when the rate crosses the threshold', async () => {
  const breaker = new CircuitBreaker(opts);

  await assert.rejects(breaker.execute(boom));
  await assert.rejects(breaker.execute(boom));
  assert.equal(breaker.currentState, 'closed', 'window not full yet: no verdict');

  await assert.rejects(breaker.execute(boom));
  await assert.rejects(breaker.execute(boom));

  assert.equal(breaker.currentState, 'open');
});

test('open circuit fails fast without touching the network', async () => {
  const breaker = new CircuitBreaker({ ...opts, openDurationMs: 10_000 });
  for (let i = 0; i < 4; i++) await assert.rejects(breaker.execute(boom));

  let calls = 0;
  const spy = () => {
    calls++;
    return ok();
  };

  await assert.rejects(breaker.execute(spy), CircuitOpenError);
  assert.equal(calls, 0, 'downstream must not be called while open');
});

test('half-open probe success closes the circuit', async () => {
  const breaker = new CircuitBreaker(opts);
  for (let i = 0; i < 4; i++) await assert.rejects(breaker.execute(boom));
  assert.equal(breaker.currentState, 'open');

  await new Promise((r) => setTimeout(r, 60));
  assert.equal(breaker.currentState, 'half-open');

  await breaker.execute(ok);
  assert.equal(breaker.currentState, 'closed');
});

test('failed probe re-opens immediately', async () => {
  const breaker = new CircuitBreaker(opts);
  for (let i = 0; i < 4; i++) await assert.rejects(breaker.execute(boom));

  await new Promise((r) => setTimeout(r, 60));
  assert.equal(breaker.currentState, 'half-open');

  await assert.rejects(breaker.execute(boom));
  assert.equal(breaker.currentState, 'open');
});

test('fallback is used instead of throwing', async () => {
  const breaker = new CircuitBreaker({ ...opts, openDurationMs: 10_000 });
  for (let i = 0; i < 4; i++) await assert.rejects(breaker.execute(boom));

  const result = await breaker.execute(ok, () => Promise.resolve('failover-acquirer'));
  assert.equal(result, 'failover-acquirer');
});
