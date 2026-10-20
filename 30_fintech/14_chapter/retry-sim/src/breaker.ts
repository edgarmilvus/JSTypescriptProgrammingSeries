export class CircuitOpenError extends Error {
  constructor(message = 'Circuit is open: downstream is failing fast') {
    super(message);
    this.name = 'CircuitOpenError';
  }
}

export type BreakerState = 'closed' | 'open' | 'half-open';

export type BreakerOptions = {
  windowSize: number;
  failureRateThreshold: number;
  openDurationMs: number;
  probesToClose: number;
};

export class CircuitBreaker {
  private state: BreakerState = 'closed';
  private window: boolean[] = []; // true = success
  private openedAt = 0;
  private probeSuccesses = 0;
  private readonly opts: BreakerOptions;

  constructor(opts: BreakerOptions) {
    this.opts = opts;
  }

  get currentState(): BreakerState {
    if (this.state === 'open' && Date.now() - this.openedAt >= this.opts.openDurationMs) {
      this.state = 'half-open';
      this.probeSuccesses = 0;
    }
    return this.state;
  }

  async execute<T>(fn: () => Promise<T>, fallback?: () => Promise<T>): Promise<T> {
    if (this.currentState === 'open') {
      if (fallback) return fallback();
      throw new CircuitOpenError();
    }

    try {
      const result = await fn();
      this.record(true);
      return result;
    } catch (error) {
      this.record(false);
      throw error;
    }
  }

  private record(success: boolean): void {
    if (this.state === 'half-open') {
      if (!success) return this.trip();
      if (++this.probeSuccesses >= this.opts.probesToClose) this.reset();
      return;
    }

    this.window.push(success);
    if (this.window.length > this.opts.windowSize) this.window.shift();

    // Only judge once the window is full, otherwise the first error trips it.
    if (this.window.length === this.opts.windowSize) {
      const failureRate = this.window.filter((ok) => !ok).length / this.window.length;
      if (failureRate >= this.opts.failureRateThreshold) this.trip();
    }
  }

  private trip(): void {
    this.state = 'open';
    this.openedAt = Date.now();
    this.window = [];
    this.probeSuccesses = 0;
  }

  private reset(): void {
    this.state = 'closed';
    this.window = [];
    this.probeSuccesses = 0;
  }
}
