import { DEFAULT_GLOBAL_SETTINGS, DEFAULT_PLAYER_CONFIGS } from '@/core/defaults';
import { globalSettingsSchema, playerConfigSchema } from '@/core/schemas';
import type { GlobalSettings, PlayerConfig } from '@/core/types';

export interface PersistedConfigState {
  version: 1;
  players: [PlayerConfig, PlayerConfig, PlayerConfig, PlayerConfig];
  settings: GlobalSettings;
}

export function migrateConfig(raw: unknown): PersistedConfigState {
  if (!raw || typeof raw !== 'object') {
    return {
      version: 1,
      players: DEFAULT_PLAYER_CONFIGS,
      settings: DEFAULT_GLOBAL_SETTINGS,
    };
  }

  try {
    const candidate = raw as Partial<PersistedConfigState>;

    let parsedSettings = DEFAULT_GLOBAL_SETTINGS;
    if (candidate.settings) {
      const result = globalSettingsSchema.safeParse(candidate.settings);
      if (result.success) {
        parsedSettings = result.data as GlobalSettings;
      }
    }

    const defaultPlayers = DEFAULT_PLAYER_CONFIGS;
    const parsedPlayers = defaultPlayers.map((def, idx) => {
      const candidatePlayer = candidate.players?.[idx];
      if (!candidatePlayer) return def;
      const result = playerConfigSchema.safeParse(candidatePlayer);
      return result.success ? (result.data as PlayerConfig) : def;
    }) as [PlayerConfig, PlayerConfig, PlayerConfig, PlayerConfig];

    return {
      version: 1,
      players: parsedPlayers,
      settings: parsedSettings,
    };
  } catch {
    return {
      version: 1,
      players: DEFAULT_PLAYER_CONFIGS,
      settings: DEFAULT_GLOBAL_SETTINGS,
    };
  }
}
