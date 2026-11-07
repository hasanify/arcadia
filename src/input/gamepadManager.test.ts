import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GamepadManager } from '@/input/gamepadManager';
import { liveState } from '@/input/liveState';

describe('GamepadManager', () => {
  beforeEach(() => {
    liveState.resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('polls connected gamepads and emits button edges', () => {
    const downCalls: unknown[] = [];
    const manager = new GamepadManager({
      onButtonDown: (pId, btn, val) => downCalls.push({ pId, btn, val }),
    });

    const mockButtons = Array.from({ length: 18 }, () => ({
      pressed: false,
      value: 0,
      touched: false,
    }));
    // Press South (X / A)
    mockButtons[0] = { pressed: true, value: 1, touched: true };

    const mockPad = {
      id: 'Xbox Wireless Controller (STANDARD GAMEPAD)',
      index: 0,
      connected: true,
      timestamp: 12345,
      mapping: 'standard' as const,
      axes: [0, 0, 0, 0],
      buttons: mockButtons,
      hapticActuators: [],
      vibrationActuator: null as unknown as GamepadHapticActuator,
    } as Gamepad;

    vi.spyOn(manager, 'pollGamepads').mockReturnValue([mockPad, null, null, null]);

    manager.start();
    manager.tick();

    expect(downCalls).toHaveLength(1);
    expect(downCalls[0]).toEqual({
      pId: 0,
      btn: 'south',
      val: 1,
    });

    const p0State = liveState.getPlayerState(0);
    expect(p0State.connected).toBe(true);
    expect(p0State.buttons.south).toBe(true);

    manager.stop();
  });

  it('handles gamepad disconnection gracefully', () => {
    const manager = new GamepadManager();
    const mockPad = {
      id: 'Generic Gamepad',
      index: 0,
      connected: true,
      timestamp: 100,
      mapping: 'standard' as const,
      axes: [0, 0, 0, 0],
      buttons: Array.from({ length: 18 }, () => ({ pressed: false, value: 0, touched: false })),
      hapticActuators: [],
      vibrationActuator: null as unknown as GamepadHapticActuator,
    } as Gamepad;

    const pollSpy = vi.spyOn(manager, 'pollGamepads');
    pollSpy.mockReturnValue([mockPad, null, null, null]);

    manager.start();
    manager.tick();
    expect(liveState.getPlayerState(0).connected).toBe(true);

    // Disconnect
    pollSpy.mockReturnValue([null, null, null, null]);
    manager.tick();
    expect(liveState.getPlayerState(0).connected).toBe(false);

    manager.stop();
  });
});
