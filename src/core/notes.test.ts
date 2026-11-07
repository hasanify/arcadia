import { describe, expect, it } from 'vitest';

import { midiToFreq, midiToNoteName, noteNameToMidi } from '@/core/notes';

describe('notes', () => {
  it('parses basic notes with middleCOctave = 3 (Ableton convention)', () => {
    expect(noteNameToMidi('C3', 3)).toBe(60);
    expect(noteNameToMidi('C1', 3)).toBe(36);
    expect(noteNameToMidi('A1', 3)).toBe(45);
    expect(noteNameToMidi('G#1', 3)).toBe(44);
    expect(noteNameToMidi('Bb1', 3)).toBe(46);
    expect(noteNameToMidi('Bb2', 3)).toBe(58);
  });

  it('parses basic notes with middleCOctave = 4', () => {
    expect(noteNameToMidi('C4', 4)).toBe(60);
    expect(noteNameToMidi('C1', 4)).toBe(24);
  });

  it('handles flats and sharps identically for enharmonics', () => {
    expect(noteNameToMidi('C#1', 3)).toBe(noteNameToMidi('Db1', 3));
    expect(noteNameToMidi('D#2', 3)).toBe(noteNameToMidi('Eb2', 3));
    expect(noteNameToMidi('F#1', 3)).toBe(noteNameToMidi('Gb1', 3));
  });

  it('rejects invalid note names', () => {
    expect(noteNameToMidi('H1')).toBeNull();
    expect(noteNameToMidi('C')).toBeNull();
    expect(noteNameToMidi('C##1')).toBeNull();
    expect(noteNameToMidi('')).toBeNull();
    expect(noteNameToMidi('XYZ')).toBeNull();
  });

  it('round-trips all valid MIDI notes from 0 to 127', () => {
    for (let midi = 0; midi <= 127; midi++) {
      const name = midiToNoteName(midi, 3);
      const parsed = noteNameToMidi(name, 3);
      expect(parsed).toBe(midi);
    }
  });

  it('calculates frequencies correctly', () => {
    expect(midiToFreq(69)).toBe(440);
    // A5 = 81 = 880 Hz
    expect(Math.round(midiToFreq(81))).toBe(880);
    // A3 = 57 = 220 Hz
    expect(Math.round(midiToFreq(57))).toBe(220);
  });
});
