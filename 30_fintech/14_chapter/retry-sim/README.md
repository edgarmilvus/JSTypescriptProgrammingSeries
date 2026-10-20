# retry-sim

Companion code for the article [The retry loop that takes down your payment gateway](dev.to/programmingcentral/bulletproof-fintech-mastering-circuit-breakers-exponential-backoff-and-idempotency-in-typescript-57n2)

Zero dependencies, zero build step. Node 24+ strips the TypeScript types natively,
so there is nothing to install.

## Get it

This folder is part of the [JSTypescriptProgrammingSeries](https://github.com/edgarmilvus/JSTypescriptProgrammingSeries)
repository, under `30_fintech/14_chapter/retry-sim`.

```bash
git clone https://github.com/edgarmilvus/JSTypescriptProgrammingSeries
cd JSTypescriptProgrammingSeries/30_fintech/14_chapter/retry-sim
```

## Run it

```bash
node src/sim.ts                  # the 10,000-client simulation
node --test "src/*.test.ts"      # 14 tests
```

## What's here

| File | What it does |
|---|---|
| `src/retry.ts` | `fullJitter`, `equalJitter`, `decorrelatedJitter`, `withRetry`, transient-error classifier |
| `src/breaker.ts` | `CircuitBreaker` with a rolling failure-rate window, open/half-open/closed states, fallback |
| `src/idempotency.ts` | `IdempotencyStore` that separates a *definitive rejection* from an *unknown outcome* |
| `src/pipeline.ts` | `chargeCustomer` — the three layers composed in the right order |
| `src/sim.ts` | the simulation that produces the chart in the article |
| `sim-output.txt` | captured stdout of one run; the numbers in the article come from this file |

## Output

```
10,000 clients fail in the same 400ms window. Retry #1: base 1000ms, cap 30000ms.
Retries landing per 100ms bucket (shared scale, max = 10000):

  naive — fixed 1000ms delay
    1000ms   10000  ██████████████████████████████████████████████████

  full jitter — random in [0, 1000ms)
       0ms    1003  █████
     100ms     970  █████
     ...
     900ms    1026  █████

  summary
  fixed 1000ms    10000       10000
  full jitter     1048        10000
                  9.5x lower peak, same number of retries
```

## Tests

14 tests with `node:test`, no network and no flaky timers. They cover the breaker
state machine, the idempotency classification, and the composed pipeline — including
"the idempotency key never changes between retry attempts".

## Caveats

- The breaker keeps state in process memory. Across replicas you need a shared store
  (Redis) or a service mesh, otherwise each pod learns about the outage on its own.
- `IdempotencyStore` is an in-memory map for clarity. In production it is a unique
  index in Postgres (`INSERT ... ON CONFLICT DO NOTHING`), so two pods cannot both
  claim the same key.
