import type { Correction } from "./types";
export interface CorrectionRange {
  start: number;
  end: number;
  index: number;
  replacement: string;
}
export function correctionRanges(
  text: string,
  corrections: Correction[],
): CorrectionRange[] {
  const ranges: CorrectionRange[] = [];
  corrections.forEach((correction, index) => {
    const word = correction.fragmentoOriginal;
    if (!word) return;
    let start = text.indexOf(word);
    while (start >= 0) {
      const end = start + word.length;
      const before = text.slice(0, start).slice(-1),
        after = text.slice(end, end + 1);
      const initial =
        correction.categoria === "MAYUSCULAS" &&
        word.length === 1 &&
        start === 0;
      const boundary =
        initial ||
        (!/[\p{L}\p{N}_]/u.test(before) && !/[\p{L}\p{N}_]/u.test(after));
      if (
        boundary &&
        !ranges.some((range) => start < range.end && end > range.start)
      ) {
        ranges.push({
          start,
          end,
          index,
          replacement: correction.fragmentoCorregido,
        });
        break;
      }
      start = text.indexOf(word, start + word.length);
    }
  });
  return ranges.sort((a, b) => a.start - b.start);
}
