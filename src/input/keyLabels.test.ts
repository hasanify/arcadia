import { describe, expect, it } from 'vitest';

import { getFriendlyKeyLabel } from '@/input/keyLabels';

describe('keyLabels', () => {
  it('converts common key codes to clean UI badge labels', () => {
    expect(getFriendlyKeyLabel('KeyA')).toBe('A');
    expect(getFriendlyKeyLabel('Semicolon')).toBe(';');
    expect(getFriendlyKeyLabel('BracketLeft')).toBe('[');
    expect(getFriendlyKeyLabel('ArrowUp')).toBe('↑');
    expect(getFriendlyKeyLabel('Space')).toBe('SPC');
  });

  it('strips Key and Digit prefixes for fallback codes', () => {
    expect(getFriendlyKeyLabel('Digit7')).toBe('7');
    expect(getFriendlyKeyLabel('CustomKey')).toBe('CustomKey');
  });
});
