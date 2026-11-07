import type { PlayerId } from '@/core/types';
import { createEmptyPadState, type NormalizedPadState } from '@/input/normalize';

export type LiveStateListener = (state: Readonly<NormalizedPadState>) => void;

class LiveStateManager {
  private states: [NormalizedPadState, NormalizedPadState, NormalizedPadState, NormalizedPadState] =
    [createEmptyPadState(), createEmptyPadState(), createEmptyPadState(), createEmptyPadState()];

  private listeners: Map<PlayerId, Set<LiveStateListener>> = new Map([
    [0, new Set()],
    [1, new Set()],
    [2, new Set()],
    [3, new Set()],
  ]);

  public getPlayerState(id: PlayerId): Readonly<NormalizedPadState> {
    return this.states[id];
  }

  public updatePlayerState(id: PlayerId, source: NormalizedPadState): void {
    const target = this.states[id];
    target.connected = source.connected;
    target.lx = source.lx;
    target.ly = source.ly;
    target.rx = source.rx;
    target.ry = source.ry;
    target.l2 = source.l2;
    target.r2 = source.r2;
    target.timestamp = source.timestamp;

    for (const [btn, val] of Object.entries(source.buttons)) {
      target.buttons[btn as keyof typeof target.buttons] = val;
    }
    for (const [btn, val] of Object.entries(source.buttonValues)) {
      target.buttonValues[btn as keyof typeof target.buttonValues] = val;
    }

    const playerListeners = this.listeners.get(id);
    if (playerListeners && playerListeners.size > 0) {
      for (const listener of playerListeners) {
        listener(target);
      }
    }
  }

  public subscribe(id: PlayerId, listener: LiveStateListener): () => void {
    const set = this.listeners.get(id);
    set?.add(listener);
    // Call immediately with current state
    listener(this.states[id]);

    return () => {
      set?.delete(listener);
    };
  }

  public resetAll(): void {
    for (let i = 0; i < 4; i++) {
      const empty = createEmptyPadState();
      this.updatePlayerState(i as PlayerId, empty);
    }
  }
}

export const liveState = new LiveStateManager();
