import { beforeEach, describe, expect, it } from 'vitest';

import { heldState } from '@/input/heldState';

describe('heldState', () => {
  beforeEach(() => {
    heldState.clearAll();
  });

  it('tracks held notes per player', () => {
    heldState.setHeldNote(0, 'dpadUp', 60);
    heldState.setHeldNote(0, 'dpadDown', 62);
    heldState.setHeldNote(1, 'dpadUp', 48);

    expect(heldState.getHeldNotes(0).size).toBe(2);
    expect(heldState.getHeldNotes(1).size).toBe(1);

    const cleared = heldState.clearHeldNote(0, 'dpadUp');
    expect(cleared).toBe(60);
    expect(heldState.getHeldNotes(0).size).toBe(1);
  });

  it('clears notes for a single player or all players', () => {
    heldState.setHeldNote(0, 'dpadUp', 60);
    heldState.setHeldNote(1, 'dpadUp', 72);

    heldState.clearAll(0);
    expect(heldState.getHeldNotes(0).size).toBe(0);
    expect(heldState.getHeldNotes(1).size).toBe(1);

    heldState.clearAll();
    expect(heldState.getHeldNotes(1).size).toBe(0);
  });
});
