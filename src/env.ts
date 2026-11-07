import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_NAME: z.string().default('Arcadia'),
  VITE_DEFAULT_LATENCY_HINT: z.enum(['interactive', 'balanced', 'playback']).default('interactive'),
  VITE_MAX_VOICES_PER_PLAYER: z.coerce.number().min(4).max(24).default(12),
  VITE_ENABLE_HID: z
    .string()
    .optional()
    .transform((v) => v === undefined || v === 'true'),
  VITE_ENABLE_MIDI_OUT: z
    .string()
    .optional()
    .transform((v) => v === undefined || v === 'true'),
  VITE_E2E: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  BASE_PATH: z.string().default('/'),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const raw = {
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_DEFAULT_LATENCY_HINT: import.meta.env.VITE_DEFAULT_LATENCY_HINT,
    VITE_MAX_VOICES_PER_PLAYER: import.meta.env.VITE_MAX_VOICES_PER_PLAYER,
    VITE_ENABLE_HID: import.meta.env.VITE_ENABLE_HID,
    VITE_ENABLE_MIDI_OUT: import.meta.env.VITE_ENABLE_MIDI_OUT,
    VITE_E2E: import.meta.env.VITE_E2E,
    BASE_PATH: import.meta.env.BASE_PATH,
  };

  const result = envSchema.safeParse(raw);
  if (!result.success) {
    if (import.meta.env.DEV) {
      console.error('Invalid environment variables:', result.error.format());
    }
    return envSchema.parse({});
  }
  return result.data;
}

export const env = parseEnv();
