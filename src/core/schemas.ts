import { z } from 'zod';

import {
  ALL_LOGICAL_BUTTONS,
  EXPR_SOURCES,
  EXPR_TARGETS,
  GLOBAL_ACTIONS,
  NOTE_BUTTONS,
  PITCH_CLASSES,
  SCALE_TYPES,
} from '@/core/constants';

export const logicalButtonSchema = z.enum(ALL_LOGICAL_BUTTONS as unknown as [string, ...string[]]);
export const noteButtonSchema = z.enum(NOTE_BUTTONS as unknown as [string, ...string[]]);
export const pitchClassSchema = z.enum(PITCH_CLASSES as unknown as [string, ...string[]]);
export const scaleTypeSchema = z.enum(SCALE_TYPES as unknown as [string, ...string[]]);
export const noteModeSchema = z.enum(['absolute', 'scale']);

export const exprSourceSchema = z.enum(EXPR_SOURCES as unknown as [string, ...string[]]);
export const exprTargetSchema = z.enum(EXPR_TARGETS as unknown as [string, ...string[]]);

export const exprBindingSchema = z.object({
  target: exprTargetSchema,
  amount: z.number().min(0).max(1),
  invert: z.boolean(),
});

export const globalActionSchema = z.enum(GLOBAL_ACTIONS as unknown as [string, ...string[]]);

export const keyActionSchema = z.union([
  noteButtonSchema,
  z.enum([
    'octaveDown',
    'octaveUp',
    'bendUp',
    'bendDown',
    'vibrato',
    'filterClose',
    'recordToggle',
    'replayToggle',
    'panic',
    'toggleHints',
  ]),
]);

export const paramBagSchema = z.record(z.string(), z.number());

export const lfoConfigSchema = z.object({
  shape: z.enum(['sine', 'triangle', 'square', 'sawtooth', 'sampleAndHold']),
  rateHz: z.number().min(0.01).max(50),
  sync: z.boolean(),
  syncSubdivision: z.string().optional(),
  depth: z.number().min(0).max(1),
  target: z.enum(['none', 'pitch', 'filterCutoff', 'amp', 'pan', 'morph']),
  exprControlled: z.boolean(),
});

export const macroAssignmentSchema = z.object({
  path: z.string(),
  min: z.number(),
  max: z.number(),
  curve: z.enum(['linear', 'exp']),
});

export const macroConfigSchema = z.object({
  name: z.string(),
  value: z.number().min(0).max(1),
  assignments: z.array(macroAssignmentSchema).max(4),
});

export const fxTypeSchema = z.enum([
  'eq3',
  'compressor',
  'sidechainComp',
  'distortion',
  'tapeSaturator',
  'bitcrusher',
  'chorus',
  'phaser',
  'tremolo',
  'autoFilter',
  'ladderFilter',
  'delay',
  'reverb',
  'beatStutter',
]);

export const fxSlotSchema = z.object({
  id: z.string(),
  type: fxTypeSchema,
  enabled: z.boolean(),
  mix: z.number().min(0).max(1),
  params: paramBagSchema,
});

export const sampleRefSchema = z.object({
  id: z.string(),
  hash: z.string(),
  name: z.string(),
});

export const sampleRegionSchema = z.object({
  startSec: z.number().min(0),
  endSec: z.number().min(0),
  loopStartSec: z.number().min(0),
  loopEndSec: z.number().min(0),
  fadeInSec: z.number().min(0),
  fadeOutSec: z.number().min(0),
  reverse: z.boolean(),
});

export const looperConfigSchema = z.object({
  enabled: z.boolean(),
  bars: z.union([z.literal(1), z.literal(2), z.literal(4), z.literal(8)]),
  quantize: z.enum(['off', '1/16', '1/8', '1/4']),
  swing: z.number().min(50).max(75),
  rollRate: z.enum(['1/8', '1/16', '1/32', '1/8t', '1/16t']),
});

const instrumentCommonSchema = z.object({
  name: z.string(),
  presetId: z.string().nullable(),
  params: paramBagSchema,
  lfos: z.tuple([lfoConfigSchema, lfoConfigSchema]),
  macros: z.tuple([macroConfigSchema, macroConfigSchema, macroConfigSchema, macroConfigSchema]),
  fx: z.array(fxSlotSchema).max(14),
  looper: looperConfigSchema.optional(),
});

export const synthInstrumentSchema = instrumentCommonSchema.extend({
  kind: z.literal('synth'),
});

export const fmInstrumentSchema = instrumentCommonSchema.extend({
  kind: z.literal('fm'),
});

export const wavetableInstrumentSchema = instrumentCommonSchema.extend({
  kind: z.literal('wavetable'),
});

export const granularInstrumentSchema = instrumentCommonSchema.extend({
  kind: z.literal('granular'),
  sample: sampleRefSchema.nullable(),
  region: sampleRegionSchema,
});

export const samplerInstrumentSchema = instrumentCommonSchema.extend({
  kind: z.literal('sampler'),
  sample: sampleRefSchema.nullable(),
  region: sampleRegionSchema,
  slices: z.array(z.number()).max(10),
});

export const drumVoiceTypeSchema = z.enum([
  'kick',
  'snare',
  'clap',
  'hatClosed',
  'hatOpen',
  'tomLow',
  'tomMid',
  'tomHigh',
  'rim',
  'crash',
  'ride',
  'cowbell',
  'shaker',
  'perc',
  'sub808',
  'glitch',
  'vocalChop',
]);

export const drumPadSchema = z.object({
  label: z.string(),
  source: z.discriminatedUnion('type', [
    z.object({ type: z.literal('synth'), voice: drumVoiceTypeSchema }),
    z.object({
      type: z.literal('sample'),
      sample: sampleRefSchema.nullable(),
      region: sampleRegionSchema,
    }),
  ]),
  params: paramBagSchema,
  chokeGroup: z.number().min(0).max(16),
  playMode: z.enum(['oneShot', 'gate', 'loop']),
  retrigger: z.enum(['restart', 'layer', 'ignore']),
  gmNote: z.number().min(0).max(127),
  pitchSemitones: z.number().min(-24).max(24),
  fineTuneCents: z.number().min(-50).max(50),
  gainDb: z.number().min(-36).max(12),
  filterType: z.enum(['none', 'lowpass', 'highpass', 'bandpass']),
  filterCutoffHz: z.number().min(20).max(20000),
});

export const drumsInstrumentSchema = instrumentCommonSchema.extend({
  kind: z.literal('drums'),
  pads: z.record(noteButtonSchema, drumPadSchema) as unknown as z.ZodType<
    Record<string, z.infer<typeof drumPadSchema>>
  >,
});

export const instrumentConfigSchema = z.discriminatedUnion('kind', [
  synthInstrumentSchema,
  fmInstrumentSchema,
  wavetableInstrumentSchema,
  granularInstrumentSchema,
  samplerInstrumentSchema,
  drumsInstrumentSchema,
]);

export const instrumentCategorySchema = z.enum([
  'bass',
  'lead',
  'pad',
  'keys',
  'pluck',
  'bell',
  'chiptune',
  'texture',
  'fx',
  'drums',
  'sampler',
  'user',
]);

export const instrumentPresetSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: instrumentCategorySchema,
  kind: z.enum(['synth', 'fm', 'wavetable', 'granular', 'sampler', 'drums']),
  builtin: z.boolean(),
  createdAt: z.number(),
  updatedAt: z.number(),
  instrument: instrumentConfigSchema,
});

export const playerConfigSchema = z.object({
  id: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  name: z.string(),
  enabled: z.boolean(),
  pad: z.object({
    mode: z.enum(['auto', 'manual']),
    padKey: z.string().nullable(),
  }),
  noteMode: noteModeSchema,
  noteMap: z.record(noteButtonSchema, z.string()) as unknown as z.ZodType<Record<string, string>>,
  scale: z.object({
    root: pitchClassSchema,
    type: scaleTypeSchema,
    baseOctave: z.number().int().min(0).max(8),
  }),
  octaveShift: z.number().int().min(-3).max(3),
  transposeSemitones: z.number().int().min(-12).max(12),
  velocity: z.object({
    mode: z.enum(['fixed', 'r2']),
    fixed: z.number().min(0).max(1),
  }),
  expression: z.record(exprSourceSchema, exprBindingSchema) as unknown as z.ZodType<
    Record<string, z.infer<typeof exprBindingSchema>>
  >,
  bendRangeSemitones: z.number().int().min(1).max(12),
  instrument: instrumentConfigSchema,
  maxVoices: z.number().int().min(4).max(24),
  volume: z.number().min(0).max(1),
  muted: z.boolean(),
  solo: z.boolean(),
  fx: z.object({
    reverbSend: z.number().min(0).max(1),
    delaySend: z.number().min(0).max(1),
  }),
  controller: z.object({
    stickDeadzone: z.number().min(0).max(0.4),
    triggerDeadzone: z.number().min(0).max(0.2),
    curve: z.enum(['linear', 'expo', 'log']),
    curveAmount: z.number().min(0).max(1),
    invertY: z.boolean(),
    debounceMs: z.number().min(0).max(30),
  }),
  actions: z.record(logicalButtonSchema, globalActionSchema),
  rumble: z.object({
    enabled: z.boolean(),
    intensity: z.number().min(0).max(1),
  }),
  hid: z.object({
    motionEnabled: z.boolean(),
    lightbarEnabled: z.boolean(),
  }),
});

export const globalSettingsSchema = z.object({
  masterVolume: z.number().min(0).max(1),
  latencyHint: z.enum(['interactive', 'balanced', 'playback']),
  middleCOctave: z.union([z.literal(3), z.literal(4)]),
  reverb: z.object({
    decaySec: z.number().min(0.1).max(20),
    wet: z.number().min(0).max(1),
  }),
  delay: z.object({
    timeSec: z.number().min(0.01).max(5),
    feedback: z.number().min(0).max(0.95),
    wet: z.number().min(0).max(1),
  }),
  metronome: z.object({
    enabled: z.boolean(),
    bpm: z.number().min(20).max(300),
    volume: z.number().min(0).max(1),
    countInBars: z.union([z.literal(0), z.literal(1), z.literal(2)]),
    recordClick: z.boolean(),
  }),
  midiOut: z.object({
    enabled: z.boolean(),
    deviceId: z.string().nullable(),
  }),
  keyboard: z.object({
    enabled: z.boolean(),
    target: z.union([z.literal('active'), z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
    showHints: z.boolean(),
    keyMap: z.record(z.string(), z.string()),
  }),
  activePlayer: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  activePresetId: z.string().nullable(),
});
