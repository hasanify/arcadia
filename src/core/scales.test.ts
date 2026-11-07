import { describe, expect, it } from 'vitest';

import { getScaleDegreeOffset, SCALE_INTERVALS } from '@/core/scales';

describe('scales', () => {
  it('defines correct intervals for major and minor scales', () => {
    expect(SCALE_INTERVALS.major).toEqual([0, 2, 4, 5, 7, 9, 11]);
    expect(SCALE_INTERVALS.minor).toEqual([0, 2, 3, 5, 7, 8, 10]);
    expect(SCALE_INTERVALS.pentatonicMinor).toEqual([0, 3, 5, 7, 10]);
  });

  it('calculates scale degree offsets with octave wrapping', () => {
    // In major scale: index 0 is root (0), index 6 is leading tone (11), index 7 is octave root (12)
    expect(getScaleDegreeOffset('major', 0)).toBe(0);
    expect(getScaleDegreeOffset('major', 6)).toBe(11);
    expect(getScaleDegreeOffset('major', 7)).toBe(12);
    expect(getScaleDegreeOffset('major', 8)).toBe(14);
    expect(getScaleDegreeOffset('major', 14)).toBe(24);
  });

  it('calculates pentatonic scale degree offsets', () => {
    // 5-note scale: index 5 wraps to next octave
    expect(getScaleDegreeOffset('pentatonicMinor', 0)).toBe(0);
    expect(getScaleDegreeOffset('pentatonicMinor', 4)).toBe(10);
    expect(getScaleDegreeOffset('pentatonicMinor', 5)).toBe(12);
  });
});
