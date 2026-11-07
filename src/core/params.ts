import type { InstrumentKind, ParamBag, ParamDef } from '@/core/types';

export const PARAM_DEFS: readonly ParamDef[] = [
  // Subtractive Synth
  {
    id: 'osc1.wave',
    label: 'Waveform',
    group: 'Osc 1',
    kind: 'enum',
    min: 0,
    max: 3,
    step: 1,
    default: 2, // saw
    options: ['sine', 'triangle', 'sawtooth', 'square'],
    applies: 'nextNote',
  },
  {
    id: 'osc1.detune',
    label: 'Detune',
    group: 'Osc 1',
    kind: 'float',
    min: -50,
    max: 50,
    step: 1,
    default: 0,
    unit: 'cents',
    curve: 'linear',
    applies: 'live',
  },
  {
    id: 'osc1.level',
    label: 'Level',
    group: 'Osc 1',
    kind: 'float',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.8,
    unit: '%',
    curve: 'linear',
    applies: 'live',
  },
  {
    id: 'osc2.wave',
    label: 'Waveform',
    group: 'Osc 2',
    kind: 'enum',
    min: 0,
    max: 3,
    step: 1,
    default: 3, // square
    options: ['sine', 'triangle', 'sawtooth', 'square'],
    applies: 'nextNote',
  },
  {
    id: 'osc2.octave',
    label: 'Octave',
    group: 'Osc 2',
    kind: 'int',
    min: -2,
    max: 2,
    step: 1,
    default: 0,
    unit: 'oct',
    curve: 'linear',
    applies: 'nextNote',
  },
  {
    id: 'osc2.semi',
    label: 'Semitone',
    group: 'Osc 2',
    kind: 'int',
    min: -12,
    max: 12,
    step: 1,
    default: 0,
    unit: 'st',
    curve: 'linear',
    applies: 'nextNote',
  },
  {
    id: 'osc2.detune',
    label: 'Detune',
    group: 'Osc 2',
    kind: 'float',
    min: -50,
    max: 50,
    step: 1,
    default: 7,
    unit: 'cents',
    curve: 'linear',
    applies: 'live',
  },
  {
    id: 'osc2.level',
    label: 'Level',
    group: 'Osc 2',
    kind: 'float',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.6,
    unit: '%',
    curve: 'linear',
    applies: 'live',
  },
  {
    id: 'sub.wave',
    label: 'Sub Wave',
    group: 'Sub',
    kind: 'enum',
    min: 0,
    max: 1,
    step: 1,
    default: 0, // sine
    options: ['sine', 'square'],
    applies: 'nextNote',
  },
  {
    id: 'sub.octave',
    label: 'Sub Octave',
    group: 'Sub',
    kind: 'int',
    min: -2,
    max: -1,
    step: 1,
    default: -1,
    unit: 'oct',
    curve: 'linear',
    applies: 'nextNote',
  },
  {
    id: 'sub.level',
    label: 'Sub Level',
    group: 'Sub',
    kind: 'float',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.4,
    unit: '%',
    curve: 'linear',
    applies: 'live',
  },
  {
    id: 'noise.type',
    label: 'Noise Type',
    group: 'Noise',
    kind: 'enum',
    min: 0,
    max: 1,
    step: 1,
    default: 0, // white
    options: ['white', 'pink'],
    applies: 'nextNote',
  },
  {
    id: 'noise.level',
    label: 'Noise Level',
    group: 'Noise',
    kind: 'float',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    unit: '%',
    curve: 'linear',
    applies: 'live',
  },
  {
    id: 'filter.type',
    label: 'Filter Mode',
    group: 'Filter',
    kind: 'enum',
    min: 0,
    max: 3,
    step: 1,
    default: 0, // LP
    options: ['lowpass', 'highpass', 'bandpass', 'notch'],
    applies: 'live',
  },
  {
    id: 'filter.cutoff',
    label: 'Cutoff',
    group: 'Filter',
    kind: 'float',
    min: 20,
    max: 20000,
    step: 1,
    default: 2500,
    unit: 'Hz',
    curve: 'log',
    applies: 'live',
  },
  {
    id: 'filter.resonance',
    label: 'Resonance',
    group: 'Filter',
    kind: 'float',
    min: 0.1,
    max: 20,
    step: 0.1,
    default: 1.5,
    curve: 'exp',
    applies: 'live',
  },
  {
    id: 'filter.drive',
    label: 'Overdrive',
    group: 'Filter',
    kind: 'float',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    unit: '%',
    curve: 'linear',
    applies: 'live',
  },
  {
    id: 'filter.envAmount',
    label: 'Env Amount',
    group: 'Filter Env',
    kind: 'float',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0.5,
    curve: 'linear',
    applies: 'live',
  },
  {
    id: 'filter.env.a',
    label: 'Attack',
    group: 'Filter Env',
    kind: 'float',
    min: 0.001,
    max: 5,
    step: 0.001,
    default: 0.01,
    unit: 's',
    curve: 'exp',
    applies: 'nextNote',
  },
  {
    id: 'filter.env.d',
    label: 'Decay',
    group: 'Filter Env',
    kind: 'float',
    min: 0.01,
    max: 10,
    step: 0.01,
    default: 0.3,
    unit: 's',
    curve: 'exp',
    applies: 'nextNote',
  },
  {
    id: 'filter.env.s',
    label: 'Sustain',
    group: 'Filter Env',
    kind: 'float',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.4,
    unit: '%',
    curve: 'linear',
    applies: 'nextNote',
  },
  {
    id: 'filter.env.r',
    label: 'Release',
    group: 'Filter Env',
    kind: 'float',
    min: 0.01,
    max: 10,
    step: 0.01,
    default: 0.5,
    unit: 's',
    curve: 'exp',
    applies: 'nextNote',
  },
  {
    id: 'amp.a',
    label: 'Attack',
    group: 'Amp Env',
    kind: 'float',
    min: 0.001,
    max: 5,
    step: 0.001,
    default: 0.005,
    unit: 's',
    curve: 'exp',
    applies: 'nextNote',
  },
  {
    id: 'amp.d',
    label: 'Decay',
    group: 'Amp Env',
    kind: 'float',
    min: 0.01,
    max: 10,
    step: 0.01,
    default: 0.2,
    unit: 's',
    curve: 'exp',
    applies: 'nextNote',
  },
  {
    id: 'amp.s',
    label: 'Sustain',
    group: 'Amp Env',
    kind: 'float',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.8,
    unit: '%',
    curve: 'linear',
    applies: 'nextNote',
  },
  {
    id: 'amp.r',
    label: 'Release',
    group: 'Amp Env',
    kind: 'float',
    min: 0.01,
    max: 10,
    step: 0.01,
    default: 0.3,
    unit: 's',
    curve: 'exp',
    applies: 'nextNote',
  },
  {
    id: 'voice.glide',
    label: 'Glide',
    group: 'Voice',
    kind: 'float',
    min: 0,
    max: 1,
    step: 0.005,
    default: 0,
    unit: 's',
    curve: 'exp',
    applies: 'live',
  },

  // FM Synth
  {
    id: 'fm.harmonicity',
    label: 'Harmonicity',
    group: 'FM',
    kind: 'float',
    min: 0.1,
    max: 20,
    step: 0.1,
    default: 1.0,
    unit: 'x',
    curve: 'linear',
    applies: 'live',
  },
  {
    id: 'fm.modIndex',
    label: 'Mod Index',
    group: 'FM',
    kind: 'float',
    min: 0,
    max: 50,
    step: 0.1,
    default: 5.0,
    curve: 'exp',
    applies: 'live',
  },
  {
    id: 'fm.modEnvAmount',
    label: 'Mod Env',
    group: 'FM Env',
    kind: 'float',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.7,
    unit: '%',
    curve: 'linear',
    applies: 'live',
  },
  {
    id: 'fm.feedback',
    label: 'Feedback',
    group: 'FM',
    kind: 'float',
    min: 0,
    max: 10,
    step: 0.1,
    default: 0,
    curve: 'linear',
    applies: 'live',
  },

  // Chiptune / Retro
  {
    id: 'chip.chipMode',
    label: 'Chip Architecture',
    group: 'Retro',
    kind: 'enum',
    min: 0,
    max: 2,
    step: 1,
    default: 0, // NES
    options: ['NES', 'GameBoy', 'SID'],
    applies: 'rebuild',
  },
  {
    id: 'chip.pulseWidth',
    label: 'Pulse Width',
    group: 'Retro',
    kind: 'enum',
    min: 0,
    max: 3,
    step: 1,
    default: 1, // 25%
    options: ['12.5%', '25%', '50%', '75%'],
    applies: 'live',
  },
  {
    id: 'chip.crushBits',
    label: 'Bit Depth',
    group: 'Retro',
    kind: 'int',
    min: 4,
    max: 16,
    step: 1,
    default: 16,
    curve: 'linear',
    applies: 'live',
  },
  {
    id: 'chip.arpRate',
    label: 'Arp Rate',
    group: 'Retro',
    kind: 'enum',
    min: 0,
    max: 4,
    step: 1,
    default: 2, // 1/16
    options: ['off', '1/8', '1/16', '1/32', 'fast'],
    applies: 'live',
  },

  // Granular
  {
    id: 'grain.size',
    label: 'Grain Size',
    group: 'Granular',
    kind: 'float',
    min: 0.01,
    max: 0.3,
    step: 0.005,
    default: 0.05,
    unit: 's',
    curve: 'exp',
    applies: 'live',
  },
  {
    id: 'grain.spray',
    label: 'Grain Spray',
    group: 'Granular',
    kind: 'float',
    min: 0,
    max: 0.2,
    step: 0.005,
    default: 0.02,
    unit: 's',
    curve: 'exp',
    applies: 'live',
  },
  {
    id: 'grain.density',
    label: 'Density',
    group: 'Granular',
    kind: 'float',
    min: 2,
    max: 60,
    step: 1,
    default: 20,
    unit: 'Hz',
    curve: 'linear',
    applies: 'live',
  },
  {
    id: 'grain.position',
    label: 'Scrub Position',
    group: 'Granular',
    kind: 'float',
    min: 0,
    max: 1,
    step: 0.001,
    default: 0,
    unit: '%',
    curve: 'linear',
    applies: 'live',
  },

  // Sampler
  {
    id: 'smp.mode',
    label: 'Sampler Mode',
    group: 'Sampler',
    kind: 'enum',
    min: 0,
    max: 1,
    step: 1,
    default: 0, // pitched
    options: ['pitched', 'slice'],
    applies: 'rebuild',
  },

  // Pad
  {
    id: 'pad.pitchSemi',
    label: 'Pitch Shift',
    group: 'Pad Tuning',
    kind: 'int',
    min: -24,
    max: 24,
    step: 1,
    default: 0,
    unit: 'st',
    curve: 'linear',
    applies: 'live',
  },
  {
    id: 'pad.fineCents',
    label: 'Fine Detune',
    group: 'Pad Tuning',
    kind: 'float',
    min: -50,
    max: 50,
    step: 1,
    default: 0,
    unit: 'cents',
    curve: 'linear',
    applies: 'live',
  },
  {
    id: 'pad.gainDb',
    label: 'Pad Volume',
    group: 'Pad Output',
    kind: 'float',
    min: -36,
    max: 12,
    step: 0.5,
    default: 0,
    unit: 'dB',
    curve: 'linear',
    applies: 'live',
  },
  {
    id: 'pad.pan',
    label: 'Pad Pan',
    group: 'Pad Output',
    kind: 'float',
    min: -1,
    max: 1,
    step: 0.02,
    default: 0,
    curve: 'linear',
    applies: 'live',
  },
];

const PARAMS_BY_ID = new Map<string, ParamDef>(PARAM_DEFS.map((p) => [p.id, p]));

export function getParamDef(id: string): ParamDef | undefined {
  return PARAMS_BY_ID.get(id);
}

export function getDefaultParamBagForKind(kind: InstrumentKind): ParamBag {
  const bag: ParamBag = {};
  for (const def of PARAM_DEFS) {
    if (
      kind === 'synth' &&
      (def.id.startsWith('osc') ||
        def.id.startsWith('sub') ||
        def.id.startsWith('filter') ||
        def.id.startsWith('amp') ||
        def.id.startsWith('noise') ||
        def.id.startsWith('voice'))
    ) {
      bag[def.id] = def.default;
    } else if (
      kind === 'fm' &&
      (def.id.startsWith('fm') ||
        def.id.startsWith('filter') ||
        def.id.startsWith('amp') ||
        def.id.startsWith('voice'))
    ) {
      bag[def.id] = def.default;
    } else if (
      kind === 'wavetable' &&
      (def.id.startsWith('chip') ||
        def.id.startsWith('filter') ||
        def.id.startsWith('amp') ||
        def.id.startsWith('voice'))
    ) {
      bag[def.id] = def.default;
    } else if (
      kind === 'granular' &&
      (def.id.startsWith('grain') ||
        def.id.startsWith('filter') ||
        def.id.startsWith('amp') ||
        def.id.startsWith('voice'))
    ) {
      bag[def.id] = def.default;
    } else if (
      kind === 'sampler' &&
      (def.id.startsWith('smp') ||
        def.id.startsWith('filter') ||
        def.id.startsWith('amp') ||
        def.id.startsWith('voice'))
    ) {
      bag[def.id] = def.default;
    } else if (kind === 'drums' && def.id.startsWith('pad')) {
      bag[def.id] = def.default;
    }
  }
  return bag;
}

export function clampParamValue(def: ParamDef, raw: number): number {
  if (def.kind === 'bool') return raw > 0.5 ? 1 : 0;
  if (def.kind === 'int' || def.kind === 'enum') {
    const val = Math.round(raw);
    return Math.max(def.min, Math.min(def.max, val));
  }
  const clamped = Math.max(def.min, Math.min(def.max, raw));
  if (def.step > 0) {
    const steps = Math.round((clamped - def.min) / def.step);
    return def.min + steps * def.step;
  }
  return clamped;
}
