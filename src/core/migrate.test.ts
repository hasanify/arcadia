import { describe, expect, it } from 'vitest';

import { DEFAULT_GLOBAL_SETTINGS, DEFAULT_PLAYER_CONFIGS } from '@/core/defaults';
import { migrateConfig } from '@/core/migrate';

describe('migrateConfig', () => {
  it('returns defaults for null, undefined, or primitive input', () => {
    expect(migrateConfig(null)).toEqual({
      version: 1,
      players: DEFAULT_PLAYER_CONFIGS,
      settings: DEFAULT_GLOBAL_SETTINGS,
    });
    expect(migrateConfig('bad string')).toEqual({
      version: 1,
      players: DEFAULT_PLAYER_CONFIGS,
      settings: DEFAULT_GLOBAL_SETTINGS,
    });
  });

  it('preserves valid settings and players', () => {
    const customConfig = {
      version: 1,
      players: DEFAULT_PLAYER_CONFIGS,
      settings: {
        ...DEFAULT_GLOBAL_SETTINGS,
        masterVolume: 0.5,
        metronome: {
          ...DEFAULT_GLOBAL_SETTINGS.metronome,
          bpm: 140,
        },
      },
    };

    const result = migrateConfig(customConfig);
    expect(result.settings.masterVolume).toBe(0.5);
    expect(result.settings.metronome.bpm).toBe(140);
  });

  it('falls back gracefully on partially corrupted player configs', () => {
    const corruptConfig = {
      version: 1,
      players: [{ id: 0, instrument: { kind: 'invalid-kind' } }],
      settings: { metronome: { bpm: 'not-a-number' } },
    };

    const result = migrateConfig(corruptConfig);
    expect(result.players[0]?.instrument.kind).toBe('synth');
    expect(result.settings.metronome.bpm).toBe(120);
  });
});
