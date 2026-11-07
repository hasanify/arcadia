import { describe, expect, it } from 'vitest';

import { resolveExpressionValue } from '@/core/expression';

describe('expression conversion', () => {
  it('converts trigger to unipolar target', () => {
    // Normal: t=0 -> 0, t=1 -> 1
    expect(
      resolveExpressionValue(0, 'trigger', { target: 'vibratoDepth', amount: 1, invert: false }),
    ).toBe(0);
    expect(
      resolveExpressionValue(1, 'trigger', { target: 'vibratoDepth', amount: 1, invert: false }),
    ).toBe(1);

    // Invert: t=0 -> 1, t=1 -> 0
    expect(
      resolveExpressionValue(0, 'trigger', { target: 'filterCutoff', amount: 1, invert: true }),
    ).toBe(1);
    expect(
      resolveExpressionValue(1, 'trigger', { target: 'filterCutoff', amount: 1, invert: true }),
    ).toBe(0);
  });

  it('converts trigger to bipolar target', () => {
    // Normal: t=0.5 -> 0.5
    expect(
      resolveExpressionValue(0.5, 'trigger', { target: 'pitchBend', amount: 1, invert: false }),
    ).toBe(0.5);

    // Invert: t=0.5 -> -0.5
    expect(
      resolveExpressionValue(0.5, 'trigger', { target: 'pitchBend', amount: 1, invert: true }),
    ).toBe(-0.5);
  });

  it('converts stick to unipolar target', () => {
    // Normal: a=-1 -> 0, a=0 -> 0.5, a=1 -> 1
    expect(
      resolveExpressionValue(-1, 'stick', { target: 'volume', amount: 1, invert: false }),
    ).toBe(0);
    expect(resolveExpressionValue(0, 'stick', { target: 'volume', amount: 1, invert: false })).toBe(
      0.5,
    );
    expect(resolveExpressionValue(1, 'stick', { target: 'volume', amount: 1, invert: false })).toBe(
      1,
    );

    // Invert: a=-1 -> 1, a=0 -> 0.5, a=1 -> 0
    expect(resolveExpressionValue(1, 'stick', { target: 'volume', amount: 1, invert: true })).toBe(
      0,
    );
    expect(resolveExpressionValue(-1, 'stick', { target: 'volume', amount: 1, invert: true })).toBe(
      1,
    );
  });

  it('converts stick to bipolar target', () => {
    // Normal: a=-1 -> -1, a=0 -> 0, a=1 -> 1
    expect(resolveExpressionValue(-1, 'stick', { target: 'pan', amount: 1, invert: false })).toBe(
      -1,
    );
    expect(resolveExpressionValue(0, 'stick', { target: 'pan', amount: 1, invert: false })).toBe(0);
    expect(resolveExpressionValue(1, 'stick', { target: 'pan', amount: 1, invert: false })).toBe(1);

    // Invert: a=1 -> -1
    expect(resolveExpressionValue(1, 'stick', { target: 'pan', amount: 1, invert: true })).toBe(-1);
  });

  it('blends correctly when amount < 1', () => {
    // amount=0.5: v=1, neutral=0 -> 0.5
    expect(
      resolveExpressionValue(
        1,
        'trigger',
        { target: 'vibratoDepth', amount: 0.5, invert: false },
        0,
      ),
    ).toBe(0.5);
  });
});
