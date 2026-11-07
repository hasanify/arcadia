import { beforeEach, describe, expect, it } from 'vitest';

import { useConfigStore } from '@/state/configStore';

describe('useConfigStore', () => {
  beforeEach(() => {
    useConfigStore.getState().resetAll();
  });

  it('initializes with default players and settings', () => {
    const state = useConfigStore.getState();
    expect(state.players).toHaveLength(4);
    expect(state.settings.metronome.bpm).toBe(120);
    expect(state.settings.activePlayer).toBe(0);
  });

  it('updates an individual player config', () => {
    useConfigStore.getState().setPlayer(0, {
      octaveShift: 2,
    });

    expect(useConfigStore.getState().players[0]?.octaveShift).toBe(2);
    expect(useConfigStore.getState().players[1]?.octaveShift).toBe(0);
  });

  it('updates global settings', () => {
    useConfigStore.getState().setSettings({
      masterVolume: 0.5,
    });

    const settings = useConfigStore.getState().settings;
    expect(settings.masterVolume).toBe(0.5);
  });

  it('switches active player', () => {
    useConfigStore.getState().setActivePlayer(2);
    expect(useConfigStore.getState().settings.activePlayer).toBe(2);
  });

  it('resets a specific player to default', () => {
    useConfigStore.getState().setPlayer(0, { octaveShift: 3 });
    useConfigStore.getState().resetPlayer(0);
    expect(useConfigStore.getState().players[0]?.octaveShift).toBe(0);
  });
});
