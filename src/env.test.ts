import { describe, expect, it } from 'vitest';
import { env } from '@/env';

describe('env configuration', () => {
  it('exposes default application settings', () => {
    expect(env.VITE_APP_NAME).toBe('Arcadia');
    expect(env.VITE_DEFAULT_LATENCY_HINT).toBe('interactive');
    expect(env.VITE_MAX_VOICES_PER_PLAYER).toBe(12);
    expect(typeof env.VITE_ENABLE_HID).toBe('boolean');
    expect(typeof env.VITE_ENABLE_MIDI_OUT).toBe('boolean');
    expect(typeof env.VITE_E2E).toBe('boolean');
    expect(env.BASE_PATH).toBe('/');
  });

  it('is frozen to prevent runtime mutation', () => {
    expect(Object.isFrozen(env)).toBe(true);
  });
});
