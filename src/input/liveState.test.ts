import { beforeEach, describe, expect, it } from 'vitest';

import { liveState } from '@/input/liveState';
import { createEmptyPadState } from '@/input/normalize';

describe('liveState', () => {
  beforeEach(() => {
    liveState.resetAll();
  });

  it('provides zero-allocation state snapshots for all 4 players', () => {
    const p1 = liveState.getPlayerState(0);
    const p2 = liveState.getPlayerState(1);

    expect(p1.connected).toBe(false);
    expect(p2.connected).toBe(false);
    expect(p1.lx).toBe(0);
  });

  it('notifies subscribers on state update', () => {
    let callCount = 0;
    let lastLx = 0;

    const unsubscribe = liveState.subscribe(0, (state) => {
      callCount++;
      lastLx = state.lx;
    });

    // Initial subscription call
    expect(callCount).toBe(1);
    expect(lastLx).toBe(0);

    const nextState = createEmptyPadState();
    nextState.connected = true;
    nextState.lx = 0.75;
    liveState.updatePlayerState(0, nextState);

    expect(callCount).toBe(2);
    expect(lastLx).toBe(0.75);

    unsubscribe();
    liveState.updatePlayerState(0, nextState);
    expect(callCount).toBe(2);
  });
});
