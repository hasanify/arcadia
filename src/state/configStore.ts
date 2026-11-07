import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  createDefaultPlayerConfig,
  DEFAULT_GLOBAL_SETTINGS,
  DEFAULT_PLAYER_CONFIGS,
} from '@/core/defaults';
import { migrateConfig } from '@/core/migrate';
import type { GlobalSettings, InstrumentConfig, PlayerConfig, PlayerId } from '@/core/types';

export interface ConfigStoreState {
  players: [PlayerConfig, PlayerConfig, PlayerConfig, PlayerConfig];
  settings: GlobalSettings;
  setPlayer: (
    id: PlayerId,
    update: Partial<PlayerConfig> | ((prev: PlayerConfig) => Partial<PlayerConfig>),
  ) => void;
  setSettings: (
    update: Partial<GlobalSettings> | ((prev: GlobalSettings) => Partial<GlobalSettings>),
  ) => void;
  setActivePlayer: (id: PlayerId) => void;
  setInstrument: (id: PlayerId, instrument: InstrumentConfig) => void;
  resetPlayer: (id: PlayerId) => void;
  resetAll: () => void;
}

export const useConfigStore = create<ConfigStoreState>()(
  persist(
    (set) => ({
      players: DEFAULT_PLAYER_CONFIGS,
      settings: DEFAULT_GLOBAL_SETTINGS,

      setPlayer: (id, update) =>
        set((state) => {
          const current = state.players[id];
          const patch = typeof update === 'function' ? update(current) : update;
          const updated = { ...current, ...patch } as PlayerConfig;
          const nextPlayers = [...state.players] as [
            PlayerConfig,
            PlayerConfig,
            PlayerConfig,
            PlayerConfig,
          ];
          nextPlayers[id] = updated;
          return { players: nextPlayers };
        }),

      setSettings: (update) =>
        set((state) => {
          const patch = typeof update === 'function' ? update(state.settings) : update;
          return { settings: { ...state.settings, ...patch } };
        }),

      setActivePlayer: (id) =>
        set((state) => ({
          settings: { ...state.settings, activePlayer: id },
        })),

      setInstrument: (id, instrument) =>
        set((state) => {
          const current = state.players[id];
          const updated = { ...current, instrument };
          const nextPlayers = [...state.players] as [
            PlayerConfig,
            PlayerConfig,
            PlayerConfig,
            PlayerConfig,
          ];
          nextPlayers[id] = updated;
          return { players: nextPlayers };
        }),

      resetPlayer: (id) =>
        set((state) => {
          const nextPlayers = [...state.players] as [
            PlayerConfig,
            PlayerConfig,
            PlayerConfig,
            PlayerConfig,
          ];
          nextPlayers[id] = createDefaultPlayerConfig(id);
          return { players: nextPlayers };
        }),

      resetAll: () =>
        set({
          players: DEFAULT_PLAYER_CONFIGS,
          settings: DEFAULT_GLOBAL_SETTINGS,
        }),
    }),
    {
      name: 'arcadia.config.v1',
      version: 1,
      migrate: (persistedState) => migrateConfig(persistedState),
    },
  ),
);
