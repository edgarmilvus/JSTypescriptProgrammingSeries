import type { CircuitBreaker } from './breaker.ts';
import type { IdempotencyStore } from './idempotency.ts';
import { withRetry, type RetryPolicy } from './retry.ts';

export type Charge = {
  idempotencyKey: string;
  amountCents: number;
  currency: string;
};

export type ChargeResult = {
  reference: string;
  amountCents: number;
};

export type ChargeDeps = {
  store: IdempotencyStore<ChargeResult>;
  breaker: CircuitBreaker;
  gateway: (charge: Charge) => Promise<ChargeResult>;
  policy: RetryPolicy;
};

export async function chargeCustomer(charge: Charge, deps: ChargeDeps): Promise<ChargeResult> {
  return deps.store.run(charge.idempotencyKey, () =>
    deps.breaker.execute(() => withRetry(() => deps.gateway(charge), deps.policy)),
  );
}
