export type PlayerId = 0 | 1 | 2 | 3;

// Positional logical buttons (physical position)
export type LogicalButton =
  | 'south'
  | 'east'
  | 'west'
  | 'north'
  | 'l1'
  | 'r1'
  | 'l2'
  | 'r2'
  | 'l3'
  | 'r3'
  | 'dpadUp'
  | 'dpadDown'
  | 'dpadLeft'
  | 'dpadRight'
  | 'select'
  | 'start'
  | 'home'
  | 'touchpad';

// 10 buttons that play notes in UI column order (Left column: L1, Up, Down, Left, Right; Right column: R1, North, West, East, South)
export const NOTE_BUTTONS = [
  'l1',
  'dpadUp',
  'dpadDown',
  'dpadLeft',
  'dpadRight',
  'r1',
  'north',
  'west',
  'east',
  'south',
] as const;
export type NoteButton = (typeof NOTE_BUTTONS)[number];

// Scale pitch order (ascending chromatic order C1 -> A1)
export const PITCH_ORDER: readonly NoteButton[] = [
  'dpadUp',
  'dpadLeft',
  'dpadDown',
  'dpadRight',
  'north',
  'west',
  'south',
  'east',
  'l1',
  'r1',
] as const;

export type Brand = 'playstation' | 'xbox' | 'nintendo' | 'generic';

export interface PadState {
  connected: boolean;
  buttons: Record<LogicalButton, boolean>;
  l2: number; // 0..1
  r2: number; // 0..1
  lx: number; // -1..1
  ly: number; // -1..1
  rx: number; // -1..1
  ry: number; // -1..1
  tiltX: number; // -1..1
  tiltY: number; // -1..1
  timestamp: number;
}

export type PitchClass = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type ScaleType =
  'chromatic' | 'major' | 'minor' | 'pentatonicMajor' | 'pentatonicMinor' | 'dorian' | 'blues';

export type NoteMode = 'absolute' | 'scale';

export type ExprSource = 'l2' | 'r2' | 'leftX' | 'leftY' | 'rightX' | 'rightY' | 'tiltX' | 'tiltY';

export type ExprTarget =
  | 'none'
  | 'pitchBend'
  | 'vibratoDepth'
  | 'filterCutoff'
  | 'volume'
  | 'pan'
  | 'reverbSend'
  | 'delaySend'
  | 'macro1'
  | 'macro2'
  | 'macro3'
  | 'macro4';

export interface ExprBinding {
  target: ExprTarget;
  amount: number; // 0..1
  invert: boolean;
}

export type GlobalAction =
  | 'none'
  | 'recordToggle'
  | 'replayToggle'
  | 'octaveUp'
  | 'octaveDown'
  | 'presetNext'
  | 'presetPrev'
  | 'panic'
  | 'metronomeToggle';

export type KeyAction =
  | NoteButton
  | 'octaveDown'
  | 'octaveUp'
  | 'bendUp'
  | 'bendDown'
  | 'vibrato'
  | 'filterClose'
  | 'recordToggle'
  | 'replayToggle'
  | 'panic'
  | 'toggleHints';

export type OscType = 'sine' | 'triangle' | 'sawtooth' | 'square';

// ---- Parameter Registry (src/core/params.ts) ----
export interface ParamDef {
  id: string;
  label: string;
  group: string;
  kind: 'float' | 'int' | 'enum' | 'bool';
  min: number;
  max: number;
  step: number;
  default: number;
  unit?: 'Hz' | 'ms' | 's' | 'dB' | 'st' | 'cents' | '%' | 'x' | 'oct';
  curve?: 'linear' | 'log' | 'exp';
  options?: string[];
  applies: 'live' | 'nextNote' | 'rebuild';
}
export type ParamBag = Record<string, number>;

// ---- Modulation & Macros ----
export interface LfoConfig {
  shape: 'sine' | 'triangle' | 'square' | 'sawtooth' | 'sampleAndHold';
  rateHz: number;
  sync: boolean;
  syncSubdivision?: string;
  depth: number;
  target: 'none' | 'pitch' | 'filterCutoff' | 'amp' | 'pan' | 'morph';
  exprControlled: boolean;
}

export interface MacroAssignment {
  path: string;
  min: number;
  max: number;
  curve: 'linear' | 'exp';
}

export interface MacroConfig {
  name: string;
  value: number; // 0..1
  assignments: MacroAssignment[]; // max 4
}

// ---- Effects (14 beat-maker insert slots) ----
export type FxType =
  | 'eq3'
  | 'compressor'
  | 'sidechainComp'
  | 'distortion'
  | 'tapeSaturator'
  | 'bitcrusher'
  | 'chorus'
  | 'phaser'
  | 'tremolo'
  | 'autoFilter'
  | 'ladderFilter'
  | 'delay'
  | 'reverb'
  | 'beatStutter';

export interface FxSlot {
  id: string;
  type: FxType;
  enabled: boolean;
  mix: number; // 0..1
  params: ParamBag;
}

// ---- Samples & Waveform ----
export interface SampleRef {
  id: string;
  hash: string;
  name: string;
}

export interface SampleRegion {
  startSec: number;
  endSec: number;
  loopStartSec: number;
  loopEndSec: number;
  fadeInSec: number;
  fadeOutSec: number;
  reverse: boolean;
}

export interface SampleAsset {
  id: string;
  name: string;
  hash: string;
  mime: string;
  sizeBytes: number;
  durationSec: number;
  sampleRate: number;
  channels: 1 | 2;
  peak: number;
  peaks: ArrayBuffer;
  createdAt: number;
  source: 'import' | 'take';
  tags: string[];
  blob: Blob;
  detectedBpm?: number;
  transients?: number[];
}

export interface LooperConfig {
  enabled: boolean;
  bars: 1 | 2 | 4 | 8;
  quantize: 'off' | '1/16' | '1/8' | '1/4';
  swing: number; // 50..75%
  rollRate: '1/8' | '1/16' | '1/32' | '1/8t' | '1/16t';
}

// ---- Instruments ----
export type InstrumentKind = 'synth' | 'fm' | 'wavetable' | 'granular' | 'sampler' | 'drums';

export type InstrumentCategory =
  | 'bass'
  | 'lead'
  | 'pad'
  | 'keys'
  | 'pluck'
  | 'bell'
  | 'chiptune'
  | 'texture'
  | 'fx'
  | 'drums'
  | 'sampler'
  | 'user';

interface InstrumentCommon {
  name: string;
  presetId: string | null;
  params: ParamBag;
  lfos: [LfoConfig, LfoConfig];
  macros: [MacroConfig, MacroConfig, MacroConfig, MacroConfig];
  fx: FxSlot[];
  looper?: LooperConfig;
}

export interface SynthInstrument extends InstrumentCommon {
  kind: 'synth';
}

export interface FmInstrument extends InstrumentCommon {
  kind: 'fm';
}

export interface WavetableInstrument extends InstrumentCommon {
  kind: 'wavetable';
}

export interface GranularInstrument extends InstrumentCommon {
  kind: 'granular';
  sample: SampleRef | null;
  region: SampleRegion;
}

export interface SamplerInstrument extends InstrumentCommon {
  kind: 'sampler';
  sample: SampleRef | null;
  region: SampleRegion;
  slices: number[]; // seconds, ascending, <= 10
}

export type DrumVoiceType =
  | 'kick'
  | 'snare'
  | 'clap'
  | 'hatClosed'
  | 'hatOpen'
  | 'tomLow'
  | 'tomMid'
  | 'tomHigh'
  | 'rim'
  | 'crash'
  | 'ride'
  | 'cowbell'
  | 'shaker'
  | 'perc'
  | 'sub808'
  | 'glitch'
  | 'vocalChop';

export interface DrumPad {
  label: string;
  source:
    | { type: 'synth'; voice: DrumVoiceType }
    | { type: 'sample'; sample: SampleRef | null; region: SampleRegion };
  params: ParamBag;
  chokeGroup: number; // 0 = none, 1..16
  playMode: 'oneShot' | 'gate' | 'loop';
  retrigger: 'restart' | 'layer' | 'ignore';
  gmNote: number; // 0..127
  pitchSemitones: number; // -24..+24
  fineTuneCents: number; // -50..+50
  gainDb: number; // -36..+12
  filterType: 'none' | 'lowpass' | 'highpass' | 'bandpass';
  filterCutoffHz: number; // 20..20000
}

export interface DrumsInstrument extends InstrumentCommon {
  kind: 'drums';
  pads: Record<NoteButton, DrumPad>;
}

export type InstrumentConfig =
  | SynthInstrument
  | FmInstrument
  | WavetableInstrument
  | GranularInstrument
  | SamplerInstrument
  | DrumsInstrument;

export interface InstrumentPreset {
  id: string;
  name: string;
  category: InstrumentCategory;
  kind: InstrumentKind;
  builtin: boolean;
  createdAt: number;
  updatedAt: number;
  instrument: InstrumentConfig;
}

// ---- Player & Global Configuration ----
export interface PlayerConfig {
  id: PlayerId;
  name: string;
  enabled: boolean;
  pad: { mode: 'auto' | 'manual'; padKey: string | null };
  noteMode: NoteMode;
  noteMap: Record<NoteButton, string>;
  scale: { root: PitchClass; type: ScaleType; baseOctave: number };
  octaveShift: number; // -3..+3
  transposeSemitones: number; // -12..+12
  velocity: { mode: 'fixed' | 'r2'; fixed: number };
  expression: Record<ExprSource, ExprBinding>;
  bendRangeSemitones: number; // 1..12
  instrument: InstrumentConfig;
  maxVoices: number; // 4..24
  volume: number; // 0..1
  muted: boolean;
  solo: boolean;
  fx: { reverbSend: number; delaySend: number };
  controller: {
    stickDeadzone: number; // 0..0.4
    triggerDeadzone: number; // 0..0.2
    curve: 'linear' | 'expo' | 'log';
    curveAmount: number; // 0..1
    invertY: boolean;
    debounceMs: number; // 0..30
  };
  actions: Partial<Record<LogicalButton, GlobalAction>>;
  rumble: { enabled: boolean; intensity: number };
  hid: { motionEnabled: boolean; lightbarEnabled: boolean };
}

export interface GlobalSettings {
  masterVolume: number; // 0..1
  latencyHint: 'interactive' | 'balanced' | 'playback';
  middleCOctave: 3 | 4;
  reverb: { decaySec: number; wet: number };
  delay: { timeSec: number; feedback: number; wet: number };
  metronome: {
    enabled: boolean;
    bpm: number;
    volume: number;
    countInBars: 0 | 1 | 2;
    recordClick: boolean;
  };
  midiOut: { enabled: boolean; deviceId: string | null };
  keyboard: {
    enabled: boolean;
    target: 'active' | PlayerId;
    showHints: boolean;
    keyMap: Record<KeyAction, string>;
  };
  activePlayer: PlayerId;
  activePresetId: string | null;
}
