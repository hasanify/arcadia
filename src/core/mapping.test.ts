import { describe, expect, it } from 'vitest';

import { DEFAULT_NOTE_MAP } from '@/core/constants';
import { resolveNote } from '@/core/mapping';
import { noteNameToMidi } from '@/core/notes';
import type { PlayerConfig } from '@/core/types';
import { NOTE_BUTTONS } from '@/core/types';

describe('mapping', () => {
  const baseConfig: Pick<
    PlayerConfig,
    'noteMode' | 'noteMap' | 'scale' | 'octaveShift' | 'transposeSemitones'
  > = {
    noteMode: 'absolute',
    noteMap: { ...DEFAULT_NOTE_MAP },
    scale: { root: 'C', type: 'chromatic', baseOctave: 1 },
    octaveShift: 0,
    transposeSemitones: 0,
  };

  it('resolves absolute note mappings correctly', () => {
    expect(resolveNote('dpadUp', baseConfig)).toBe(36); // C1
    expect(resolveNote('dpadLeft', baseConfig)).toBe(37); // C#1
    expect(resolveNote('dpadDown', baseConfig)).toBe(38); // D1
    expect(resolveNote('dpadRight', baseConfig)).toBe(39); // D#1
    expect(resolveNote('north', baseConfig)).toBe(40); // E1
    expect(resolveNote('west', baseConfig)).toBe(41); // F1
    expect(resolveNote('south', baseConfig)).toBe(42); // F#1
    expect(resolveNote('east', baseConfig)).toBe(43); // G1
    expect(resolveNote('l1', baseConfig)).toBe(44); // G#1
    expect(resolveNote('r1', baseConfig)).toBe(45); // A1
  });

  it('reproduces absolute map exactly in scale mode with root C, octave 1, chromatic', () => {
    const scaleConfig = {
      ...baseConfig,
      noteMode: 'scale' as const,
    };

    for (const btn of NOTE_BUTTONS) {
      const absMidi = resolveNote(btn, baseConfig);
      const scaleMidi = resolveNote(btn, scaleConfig);
      expect(scaleMidi).toBe(absMidi);
      expect(scaleMidi).toBe(noteNameToMidi(DEFAULT_NOTE_MAP[btn]));
    }
  });

  it('applies octave shift and transpose semitones', () => {
    const shiftedConfig = {
      ...baseConfig,
      octaveShift: 1, // +12
      transposeSemitones: 2, // +2
    };

    // C1 (36) -> +14 -> 50 (D2)
    expect(resolveNote('dpadUp', shiftedConfig)).toBe(50);
  });

  it('clamps and rejects out-of-range notes', () => {
    const extremeConfig = {
      ...baseConfig,
      octaveShift: 10, // beyond MIDI 127
    };
    expect(resolveNote('dpadUp', extremeConfig)).toBeNull();

    const lowConfig = {
      ...baseConfig,
      octaveShift: -5, // below 0
    };
    expect(resolveNote('dpadUp', lowConfig)).toBeNull();
  });
});
