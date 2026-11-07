import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_NAME: z.string().default('Arcadia'),
  VITE_DEFAULT_LATENCY_HINT: z.enum(['interactive', 'balanced', 'playback']).default('interactive'),
  VITE_MAX_VOICES_PER_PLAYER: z.coerce.number().int().min(1).max(32).default(12),
  VITE_ENABLE_HID: z
    .union([z.boolean(), z.string()])
    .transform((val) => val === true || val === 'true')
    .default(true),
  VITE_ENABLE_MIDI_OUT: z
    .union([z.boolean(), z.string()])
    .transform((val) => val === true || val === 'true')
    .default(true),
  VITE_E2E: z
    .union([z.boolean(), z.string()])
    .transform((val) => val === true || val === 'true')
    .default(false),
  BASE_PATH: z.string().default('/'),
  MODE: z.string().default('development'),
  DEV: z.boolean().default(true),
  PROD: z.boolean().default(false),
});

export type Env = z.infer<typeof envSchema>;

const getRawEnv = (): Record<string, unknown> => {
  const metaEnv = typeof import.meta !== 'undefined' ? import.meta.env : undefined;
  const procEnv = typeof process !== 'undefined' ? process.env : undefined;

  return {
    ...procEnv,
    ...metaEnv,
  };
};

export const env: Env = Object.freeze(envSchema.parse(getRawEnv()));
