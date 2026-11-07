import type { ScaleType } from '@/core/types';

/**
 * Semitone offsets from the scale root.
 */
export const SCALE_INTERVALS: Record<ScaleType, readonly number[]> = {
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonicMajor: [0, 2, 4, 7, 9],
  pentatonicMinor: [0, 3, 5, 7, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  blues: [0, 3, 5, 6, 7, 10],
};

/**
 * Resolves the semitone offset for a given scale degree index.
 * Handles wrap-around across octaves (e.g. index 7 in a 7-note scale is octave +1, semitone 0).
 */
export function getScaleDegreeOffset(type: ScaleType, degreeIndex: number): number {
  const table = SCALE_INTERVALS[type] ?? SCALE_INTERVALS.chromatic;
  const len = table.length;
  const octave = Math.floor(degreeIndex / len);
  const indexInOctave = ((degreeIndex % len) + len) % len;
  const semitone = table[indexInOctave] ?? 0;
  return octave * 12 + semitone;
}
