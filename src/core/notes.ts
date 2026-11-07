import type { PitchClass } from '@/core/types';

const PITCH_INDEX: Record<string, number> = {
  C: 0,
  'B#': 0,
  'C#': 1,
  DB: 1,
  D: 2,
  'D#': 3,
  EB: 3,
  E: 4,
  'E#': 5,
  FB: 4,
  F: 5,
  'F#': 6,
  GB: 6,
  G: 7,
  'G#': 8,
  AB: 8,
  A: 9,
  'A#': 10,
  BB: 10,
  B: 11,
  CB: 11,
};

const MIDI_PITCH_NAMES: PitchClass[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

const NOTE_REGEX = /^([A-Ga-g])([#bB]?)(-?\d+)$/;

/**
 * Parses note name (e.g. 'C1', 'G#1', 'Bb2') to MIDI note number (0..127).
 * By default (middleCOctave = 3), C3 is MIDI 60 (Ableton convention), so C1 is 36.
 * When middleCOctave = 4, C4 is MIDI 60, so C1 is 24.
 */
export function noteNameToMidi(noteName: string, middleCOctave: 3 | 4 = 3): number | null {
  if (!noteName || typeof noteName !== 'string') return null;

  const match = NOTE_REGEX.exec(noteName.trim());
  if (!match) return null;

  const letter = match[1]?.toUpperCase() ?? '';
  const accidentalRaw = match[2] ?? '';
  const accidental = accidentalRaw === 'b' ? 'B' : accidentalRaw;
  const octave = parseInt(match[3] ?? '', 10);

  if (Number.isNaN(octave)) return null;

  const key = `${letter}${accidental}`;
  const semitone = PITCH_INDEX[key];
  if (semitone === undefined) return null;

  // With middleCOctave = 3: C3 = 60 -> midi = (octave + 2) * 12 + semitone
  // With middleCOctave = 4: C4 = 60 -> midi = (octave + 1) * 12 + semitone
  const octaveOffset = middleCOctave === 3 ? 2 : 1;
  const midi = (octave + octaveOffset) * 12 + semitone;

  if (midi < 0 || midi > 127) return null;
  return midi;
}

/**
 * Converts a MIDI note number (0..127) to note name with octave (e.g. 36 -> 'C1').
 */
export function midiToNoteName(midi: number, middleCOctave: 3 | 4 = 3): string {
  const clamped = Math.max(0, Math.min(127, Math.round(midi)));
  const semitone = clamped % 12;
  const pitch = MIDI_PITCH_NAMES[semitone] ?? 'C';
  const octaveOffset = middleCOctave === 3 ? 2 : 1;
  const octave = Math.floor(clamped / 12) - octaveOffset;
  return `${pitch}${octave}`;
}

/**
 * Converts MIDI note number to frequency in Hertz (A4 = 69 = 440 Hz).
 */
export function midiToFreq(midi: number, a4Freq = 440): number {
  return a4Freq * Math.pow(2, (midi - 69) / 12);
}
