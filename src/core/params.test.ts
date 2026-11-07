import { describe, expect, it } from 'vitest';

import { clampParamValue, getDefaultParamBagForKind, getParamDef } from '@/core/params';

describe('params', () => {
  it('finds param defs by id', () => {
    const cutoff = getParamDef('filter.cutoff');
    expect(cutoff).toBeDefined();
    expect(cutoff?.label).toBe('Cutoff');
    expect(cutoff?.min).toBe(20);
    expect(cutoff?.max).toBe(20000);
  });

  it('builds default param bags for every instrument kind', () => {
    const kinds = ['synth', 'fm', 'wavetable', 'granular', 'sampler', 'drums'] as const;
    for (const kind of kinds) {
      const bag = getDefaultParamBagForKind(kind);
      expect(Object.keys(bag).length).toBeGreaterThan(0);
    }
  });

  it('clamps param values according to their kind and boundaries', () => {
    const cutoff = getParamDef('filter.cutoff');
    if (!cutoff) throw new Error('Expected cutoff definition');

    expect(clampParamValue(cutoff, 10)).toBe(20);
    expect(clampParamValue(cutoff, 25000)).toBe(20000);
    expect(clampParamValue(cutoff, 1000)).toBe(1000);

    const boolDef = {
      id: 'testBool',
      label: 'Test',
      group: 'test',
      kind: 'bool' as const,
      min: 0,
      max: 1,
      step: 1,
      default: 0,
      applies: 'live' as const,
    };
    expect(clampParamValue(boolDef, 0.8)).toBe(1);
    expect(clampParamValue(boolDef, 0.2)).toBe(0);
  });
});
