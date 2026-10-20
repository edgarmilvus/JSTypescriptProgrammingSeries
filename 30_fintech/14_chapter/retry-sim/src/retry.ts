export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Uniform random in [0, min(maxDelay, base * 2^(attempt-1))) */
export function fullJitter(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  const ceiling = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
  return Math.random() * ceiling;
}

/** Half deterministic, half random: guarantees a floor. */
export function equalJitter(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  const ceiling = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
  return ceiling / 2 + Math.random() * (ceiling / 2);
}

/** Next delay depends on the previous delay, not just the attempt count. */
export function decorrelatedJitter(
  baseDelayMs: number,
  previousDelayMs: number,
  maxDelayMs: number,
): number {
  return Math.min(maxDelayMs, baseDelayMs + Math.random() * (previousDelayMs * 3 - baseDelayMs));
}

export type RetryPolicy = {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  isRetryable?: (error: unknown) => boolean;
  onRetry?: (info: { attempt: number; delayMs: number; error: unknown }) => void;
};

export function isTransientError(error: unknown): boolean {
  const e = error as { status?: number; code?: string };
  if (typeof e.status === 'number') {
    return e.status === 408 || e.status === 429 || e.status >= 500;
  }
  return e.code === 'ECONNRESET' || e.code === 'ETIMEDOUT' || e.code === 'EAI_AGAIN';
}

export async function withRetry<T>(fn: () => Promise<T>, policy: RetryPolicy): Promise<T> {
  const isRetryable = policy.isRetryable ?? isTransientError;
  let lastError: unknown;

  for (let attempt = 1; attempt <= policy.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Never retry a 400. A declined card will be declined forever.
      if (attempt === policy.maxAttempts || !isRetryable(error)) throw error;

      const delayMs = fullJitter(attempt, policy.baseDelayMs, policy.maxDelayMs);
      policy.onRetry?.({ attempt, delayMs, error });
      await sleep(delayMs);
    }
  }

  throw lastError;
}
