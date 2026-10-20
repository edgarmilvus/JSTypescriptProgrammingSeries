import { decorrelatedJitter, equalJitter, fullJitter } from './retry.ts';

const CLIENTS = 10_000;
const BASE_MS = 1_000;
const MAX_MS = 30_000;

type Row = { at: number; count: number };

function histogram(delays: number[], bucketMs = 100): Row[] {
  const buckets = new Map<number, number>();
  for (const d of delays) {
    const b = Math.floor(d / bucketMs) * bucketMs;
    buckets.set(b, (buckets.get(b) ?? 0) + 1);
  }
  return [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([at, count]) => ({ at, count }));
}

/** Renders rows on a scale shared by every caller, so blocks are comparable. */
function render(rows: Row[], scaleMax: number, width = 50): string {
  return rows
    .map(({ at, count }) => {
      const bar = '█'.repeat(Math.max(1, Math.round((count / scaleMax) * width)));
      return `  ${String(at).padStart(6)}ms ${String(count).padStart(7)}  ${bar}`;
    })
    .join('\n');
}

const pad = (s: string, n: number) => s.padEnd(n);

const fixedDelays = Array.from({ length: CLIENTS }, () => BASE_MS);
const jitterDelays = Array.from({ length: CLIENTS }, () => fullJitter(1, BASE_MS, MAX_MS));

const fixedRows = histogram(fixedDelays);
const jitterRows = histogram(jitterDelays);

const fixedPeak = Math.max(...fixedRows.map((r) => r.count));
const jitterPeak = Math.max(...jitterRows.map((r) => r.count));
const scaleMax = Math.max(fixedPeak, jitterPeak);

console.log(
  `\n${CLIENTS.toLocaleString('en-US')} clients fail in the same 400ms window. Retry #1: base ${BASE_MS}ms, cap ${MAX_MS}ms.`,
);
console.log(`Retries landing per 100ms bucket (shared scale, max = ${scaleMax}):\n`);

console.log('  naive — fixed 1000ms delay');
console.log(`  ${pad('when', 8)}${pad('clients', 10)}`);
console.log(render(fixedRows, scaleMax));

console.log('\n  full jitter — random in [0, 1000ms)');
console.log(`  ${pad('when', 8)}${pad('clients', 10)}`);
console.log(render(jitterRows, scaleMax));

console.log('\n  summary');
console.log(`  ${pad('strategy', 16)}${pad('peak/100ms', 12)}retries`);
console.log(`  ${pad('fixed 1000ms', 16)}${pad(String(fixedPeak), 12)}${CLIENTS}`);
console.log(`  ${pad('full jitter', 16)}${pad(String(jitterPeak), 12)}${CLIENTS}`);
console.log(
  `  ${pad('', 16)}${(fixedPeak / jitterPeak).toFixed(1)}x lower peak, same number of retries`,
);

console.log('\n  jitter variants at attempt 4 (base 1000ms, cap 30000ms)');
const variants: Array<[string, () => number]> = [
  ['full', () => fullJitter(4, BASE_MS, MAX_MS)],
  ['equal', () => equalJitter(4, BASE_MS, MAX_MS)],
  ['decorrelated', () => decorrelatedJitter(BASE_MS, 8_000, MAX_MS)],
];
const N = 20_000;
console.log(`  ${pad('variant', 15)}${pad('min', 9)}${pad('median', 10)}max`);
for (const [name, gen] of variants) {
  const samples = Array.from({ length: N }, gen).sort((a, b) => a - b);
  console.log(
    `  ${pad(name, 15)}${pad(`${samples[0]!.toFixed(0)}ms`, 9)}${pad(
      `${samples[Math.floor(N / 2)]!.toFixed(0)}ms`,
      10,
    )}${samples[N - 1]!.toFixed(0)}ms`,
  );
}
console.log();
