import type {
  ExprSource,
  ExprTarget,
  GlobalAction,
  KeyAction,
  LogicalButton,
  NoteButton,
  PitchClass,
  ScaleType,
} from '@/core/types';
import { NOTE_BUTTONS, PITCH_ORDER } from '@/core/types';

export { NOTE_BUTTONS, PITCH_ORDER };

export const ALL_LOGICAL_BUTTONS: readonly LogicalButton[] = [
  'south',
  'east',
  'west',
  'north',
  'l1',
  'r1',
  'l2',
  'r2',
  'l3',
  'r3',
  'dpadUp',
  'dpadDown',
  'dpadLeft',
  'dpadRight',
  'select',
  'start',
  'home',
  'touchpad',
] as const;

export const PITCH_CLASSES: readonly PitchClass[] = [
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
] as const;

export const SCALE_TYPES: readonly ScaleType[] = [
  'chromatic',
  'major',
  'minor',
  'pentatonicMajor',
  'pentatonicMinor',
  'dorian',
  'blues',
] as const;

export const EXPR_SOURCES: readonly ExprSource[] = [
  'l2',
  'r2',
  'leftX',
  'leftY',
  'rightX',
  'rightY',
  'tiltX',
  'tiltY',
] as const;

export const EXPR_TARGETS: readonly ExprTarget[] = [
  'none',
  'pitchBend',
  'vibratoDepth',
  'filterCutoff',
  'volume',
  'pan',
  'reverbSend',
  'delaySend',
  'macro1',
  'macro2',
  'macro3',
  'macro4',
] as const;

export const GLOBAL_ACTIONS: readonly GlobalAction[] = [
  'none',
  'recordToggle',
  'replayToggle',
  'octaveUp',
  'octaveDown',
  'presetNext',
  'presetPrev',
  'panic',
  'metronomeToggle',
] as const;

// Default absolute note map (matches the physical hardware reference)
export const DEFAULT_NOTE_MAP: Record<NoteButton, string> = {
  l1: 'G#1',
  dpadUp: 'C1',
  dpadDown: 'D1',
  dpadLeft: 'C#1',
  dpadRight: 'D#1',
  r1: 'A1',
  north: 'E1',
  west: 'F1',
  south: 'F#1',
  east: 'G1',
};

// Default key map per Section 9.11
export const DEFAULT_KEY_MAP: Record<KeyAction, string> = {
  dpadUp: 'KeyA', // C1
  dpadLeft: 'KeyS', // C#1
  dpadDown: 'KeyD', // D1
  dpadRight: 'KeyF', // D#1
  north: 'KeyG', // E1
  west: 'KeyH', // F1
  south: 'KeyJ', // F#1
  east: 'KeyK', // G1
  l1: 'KeyL', // G#1
  r1: 'Semicolon', // A1
  octaveDown: 'KeyZ',
  octaveUp: 'KeyX',
  bendDown: 'ArrowDown',
  bendUp: 'ArrowUp',
  vibrato: 'KeyV',
  filterClose: 'KeyC',
  recordToggle: 'KeyR',
  replayToggle: 'KeyP',
  panic: 'Backquote',
  toggleHints: 'Slash',
};

export const MAX_PLAYERS = 4;
export const DEFAULT_MAX_VOICES = 12;
export const MIN_VOICES = 4;
export const MAX_VOICES = 24;
export const DEFAULT_BEND_RANGE = 2; // semitones
export const DEFAULT_FIXED_VELOCITY = 0.8;
