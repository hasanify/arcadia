import {
  DEFAULT_BEND_RANGE,
  DEFAULT_FIXED_VELOCITY,
  DEFAULT_KEY_MAP,
  DEFAULT_MAX_VOICES,
  DEFAULT_NOTE_MAP,
} from '@/core/constants';
import { getDefaultParamBagForKind } from '@/core/params';
import type {
  DrumsInstrument,
  ExprBinding,
  ExprSource,
  FmInstrument,
  GlobalSettings,
  InstrumentConfig,
  LfoConfig,
  MacroConfig,
  NoteButton,
  PlayerConfig,
  PlayerId,
  SynthInstrument,
  WavetableInstrument,
} from '@/core/types';
import { NOTE_BUTTONS } from '@/core/types';

export const DEFAULT_LFOS: [LfoConfig, LfoConfig] = [
  {
    shape: 'sine',
    rateHz: 5,
    sync: false,
    depth: 0,
    target: 'none',
    exprControlled: true,
  },
  {
    shape: 'triangle',
    rateHz: 1,
    sync: false,
    depth: 0,
    target: 'none',
    exprControlled: false,
  },
];

export const DEFAULT_MACROS: [MacroConfig, MacroConfig, MacroConfig, MacroConfig] = [
  { name: 'Macro 1', value: 0, assignments: [] },
  { name: 'Macro 2', value: 0, assignments: [] },
  { name: 'Macro 3', value: 0, assignments: [] },
  { name: 'Macro 4', value: 0, assignments: [] },
];

export const DEFAULT_SYNTH_INSTRUMENT: SynthInstrument = {
  kind: 'synth',
  name: 'Analog Sub Bass',
  presetId: 'builtin:synth:sub-bass',
  params: getDefaultParamBagForKind('synth'),
  lfos: DEFAULT_LFOS,
  macros: DEFAULT_MACROS,
  fx: [],
};

export const DEFAULT_LEAD_INSTRUMENT: SynthInstrument = {
  kind: 'synth',
  name: 'Poly Lead',
  presetId: 'builtin:synth:poly-lead',
  params: {
    ...getDefaultParamBagForKind('synth'),
    'filter.cutoff': 4500,
    'osc1.level': 0.7,
    'osc2.level': 0.7,
    'osc2.detune': 12,
  },
  lfos: DEFAULT_LFOS,
  macros: DEFAULT_MACROS,
  fx: [],
};

export const DEFAULT_FM_INSTRUMENT: FmInstrument = {
  kind: 'fm',
  name: 'Digital FM Keys',
  presetId: 'builtin:fm:keys',
  params: getDefaultParamBagForKind('fm'),
  lfos: DEFAULT_LFOS,
  macros: DEFAULT_MACROS,
  fx: [],
};

export const DEFAULT_CHIPTUNE_INSTRUMENT: WavetableInstrument = {
  kind: 'wavetable',
  name: '8-Bit Hero',
  presetId: 'builtin:wavetable:8bit',
  params: getDefaultParamBagForKind('wavetable'),
  lfos: DEFAULT_LFOS,
  macros: DEFAULT_MACROS,
  fx: [],
};

export function createDefaultDrumsInstrument(): DrumsInstrument {
  const padLabels: Record<NoteButton, string> = {
    l1: 'Clap',
    dpadUp: 'Kick',
    dpadDown: 'Snare',
    dpadLeft: 'Closed Hat',
    dpadRight: 'Open Hat',
    r1: 'Rim',
    north: 'Tom High',
    west: 'Tom Mid',
    south: '808 Sub',
    east: 'Crash',
  };

  const pads = {} as DrumsInstrument['pads'];
  for (const btn of NOTE_BUTTONS) {
    pads[btn] = {
      label: padLabels[btn] ?? 'Pad',
      source: { type: 'synth', voice: 'kick' },
      params: getDefaultParamBagForKind('drums'),
      chokeGroup: btn === 'dpadRight' ? 1 : btn === 'dpadLeft' ? 1 : 0,
      playMode: 'oneShot',
      retrigger: 'restart',
      gmNote: 36,
      pitchSemitones: 0,
      fineTuneCents: 0,
      gainDb: 0,
      filterType: 'none',
      filterCutoffHz: 20000,
    };
  }

  return {
    kind: 'drums',
    name: '808 Classic Kit',
    presetId: 'builtin:drums:808',
    params: {},
    lfos: DEFAULT_LFOS,
    macros: DEFAULT_MACROS,
    fx: [],
    pads,
  };
}

export const DEFAULT_EXPRESSION_BINDINGS: Record<ExprSource, ExprBinding> = {
  l2: { target: 'vibratoDepth', amount: 1, invert: false },
  r2: { target: 'filterCutoff', amount: 1, invert: true },
  leftX: { target: 'none', amount: 1, invert: false },
  leftY: { target: 'none', amount: 1, invert: false },
  rightX: { target: 'pitchBend', amount: 1, invert: false },
  rightY: { target: 'none', amount: 1, invert: false },
  tiltX: { target: 'none', amount: 1, invert: false },
  tiltY: { target: 'none', amount: 1, invert: false },
};

export function createDefaultPlayerConfig(
  id: PlayerId,
  instrument?: InstrumentConfig,
): PlayerConfig {
  const instruments: Record<PlayerId, InstrumentConfig> = {
    0: DEFAULT_SYNTH_INSTRUMENT,
    1: DEFAULT_LEAD_INSTRUMENT,
    2: DEFAULT_CHIPTUNE_INSTRUMENT,
    3: createDefaultDrumsInstrument(),
  };

  return {
    id,
    name: `P${id + 1}`,
    enabled: id === 0,
    pad: { mode: 'auto', padKey: null },
    noteMode: 'absolute',
    noteMap: { ...DEFAULT_NOTE_MAP },
    scale: { root: 'C', type: 'chromatic', baseOctave: 1 },
    octaveShift: 0,
    transposeSemitones: 0,
    velocity: { mode: 'fixed', fixed: DEFAULT_FIXED_VELOCITY },
    expression: { ...DEFAULT_EXPRESSION_BINDINGS },
    bendRangeSemitones: DEFAULT_BEND_RANGE,
    instrument: instrument ?? instruments[id] ?? DEFAULT_SYNTH_INSTRUMENT,
    maxVoices: DEFAULT_MAX_VOICES,
    volume: 0.8,
    muted: false,
    solo: false,
    fx: { reverbSend: 0, delaySend: 0 },
    controller: {
      stickDeadzone: 0.12,
      triggerDeadzone: 0.03,
      curve: 'expo',
      curveAmount: 0.35,
      invertY: true,
      debounceMs: 0,
    },
    actions: {
      start: 'recordToggle',
      select: 'panic',
    },
    rumble: { enabled: true, intensity: 0.25 },
    hid: { motionEnabled: false, lightbarEnabled: false },
  };
}

export const DEFAULT_PLAYER_CONFIGS: [PlayerConfig, PlayerConfig, PlayerConfig, PlayerConfig] = [
  createDefaultPlayerConfig(0),
  createDefaultPlayerConfig(1),
  createDefaultPlayerConfig(2),
  createDefaultPlayerConfig(3),
];

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  masterVolume: 0.8,
  latencyHint: 'interactive',
  middleCOctave: 3,
  reverb: { decaySec: 2.5, wet: 0.2 },
  delay: { timeSec: 0.35, feedback: 0.3, wet: 0.15 },
  metronome: {
    enabled: false,
    bpm: 120,
    volume: 0.7,
    countInBars: 1,
    recordClick: false,
  },
  midiOut: { enabled: false, deviceId: null },
  keyboard: {
    enabled: true,
    target: 'active',
    showHints: true,
    keyMap: { ...DEFAULT_KEY_MAP },
  },
  activePlayer: 0,
  activePresetId: null,
};
