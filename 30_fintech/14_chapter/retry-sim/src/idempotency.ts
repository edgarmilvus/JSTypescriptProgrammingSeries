import { isTransientError } from './retry.ts';

export type IdempotencyRecord<T> =
  | { status: 'in-flight'; startedAt: number }
  | { status: 'done'; result: T }
  | { status: 'unknown'; error: string; startedAt: number };

export class IdempotencyStore<T> {
  private readonly records = new Map<string, IdempotencyRecord<T>>();

  async run(key: string, fn: () => Promise<T>): Promise<T> {
    const existing = this.records.get(key);

    if (existing?.status === 'done') return existing.result;
    if (existing?.status === 'in-flight') {
      throw new Error(`Duplicate request for ${key} is already in flight`);
    }
    if (existing?.status === 'unknown') {
      throw new Error(`Outcome for ${key} is unknown — reconcile before retrying`);
    }

    this.records.set(key, { status: 'in-flight', startedAt: Date.now() });

    try {
      const result = await fn();
      this.records.set(key, { status: 'done', result });
      return result;
    } catch (error) {
      // The important distinction, and the one most implementations miss:
      if (isTransientError(error)) {
        // We do NOT know whether the money moved. Keep the key, block blind retries.
        this.records.set(key, {
          status: 'unknown',
          error: String(error),
          startedAt: Date.now(),
        });
      } else {
        // Definitive rejection (400, declined). The charge never happened.
        this.records.delete(key);
      }
      throw error;
    }
  }

  peek(key: string): IdempotencyRecord<T> | undefined {
    return this.records.get(key);
  }
}
