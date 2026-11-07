import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { KeyboardInputManager } from '@/input/keyboardInput';
import { liveState } from '@/input/liveState';
import { useConfigStore } from '@/state/configStore';

describe('KeyboardInputManager', () => {
  let manager: KeyboardInputManager;

  beforeEach(() => {
    useConfigStore.getState().resetAll();
    liveState.resetAll();
    manager = new KeyboardInputManager();
    manager.start();
  });

  afterEach(() => {
    manager.stop();
  });

  it('triggers onButtonDown and onButtonUp for mapped physical keys', () => {
    const downCalls: unknown[] = [];
    const upCalls: unknown[] = [];

    manager.setHandlers({
      onButtonDown: (pId, btn) => downCalls.push({ pId, btn }),
      onButtonUp: (pId, btn) => upCalls.push({ pId, btn }),
    });

    // Press 'KeyA' (default mapped to 'dpadUp')
    window.dispatchEvent(
      new KeyboardEvent('keydown', { code: 'KeyA', bubbles: true, cancelable: true }),
    );

    expect(downCalls).toHaveLength(1);
    expect(downCalls[0]).toEqual({ pId: 0, btn: 'dpadUp' });
    expect(liveState.getPlayerState(0).buttons.dpadUp).toBe(true);

    // Release 'KeyA'
    window.dispatchEvent(
      new KeyboardEvent('keyup', { code: 'KeyA', bubbles: true, cancelable: true }),
    );

    expect(upCalls).toHaveLength(1);
    expect(upCalls[0]).toEqual({ pId: 0, btn: 'dpadUp' });
    expect(liveState.getPlayerState(0).buttons.dpadUp).toBe(false);
  });

  it('ignores keyboard input when user is typing in a form input', () => {
    const downCalls: unknown[] = [];
    manager.setHandlers({
      onButtonDown: (pId, btn) => downCalls.push({ pId, btn }),
    });

    const input = document.createElement('input');
    document.body.appendChild(input);

    const event = new KeyboardEvent('keydown', {
      code: 'KeyA',
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(event);

    expect(downCalls).toHaveLength(0);
    document.body.removeChild(input);
  });

  it('triggers onAction for non-note mapped keys', () => {
    const actions: string[] = [];
    manager.setHandlers({
      onAction: (act) => actions.push(act),
    });

    // Press 'KeyZ' (default mapped to 'octaveDown')
    window.dispatchEvent(
      new KeyboardEvent('keydown', { code: 'KeyZ', bubbles: true, cancelable: true }),
    );

    expect(actions).toEqual(['octaveDown']);
  });
});
