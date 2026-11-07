import type { LogicalButton, PlayerConfig } from '@/core/types';
import type { ControllerProfile } from '@/input/profiles';
import { shapeStick, shapeTrigger } from '@/input/shaping';

export interface NormalizedPadState {
  connected: boolean;
  buttons: Record<LogicalButton, boolean>;
  buttonValues: Record<LogicalButton, number>;
  lx: number;
  ly: number;
  rx: number;
  ry: number;
  l2: number;
  r2: number;
  timestamp: number;
}

const ALL_LOGICAL_BUTTONS: readonly LogicalButton[] = [
  'south',
  'east',
  'west',
  'north',
  'l1',
  'r1',
  'l2',
  'r2',
  'select',
  'start',
  'l3',
  'r3',
  'dpadUp',
  'dpadDown',
  'dpadLeft',
  'dpadRight',
  'home',
  'touchpad',
] as const;

export function createEmptyPadState(): NormalizedPadState {
  const buttons = {} as Record<LogicalButton, boolean>;
  const buttonValues = {} as Record<LogicalButton, number>;

  for (const btn of ALL_LOGICAL_BUTTONS) {
    buttons[btn] = false;
    buttonValues[btn] = 0;
  }

  return {
    connected: false,
    buttons,
    buttonValues,
    lx: 0,
    ly: 0,
    rx: 0,
    ry: 0,
    l2: 0,
    r2: 0,
    timestamp: 0,
  };
}

export function normalizeGamepad(
  gamepad: Gamepad,
  profile: ControllerProfile,
  controllerSettings: PlayerConfig['controller'],
  target: NormalizedPadState,
): NormalizedPadState {
  target.connected = gamepad.connected;
  target.timestamp = gamepad.timestamp;

  // Reset all button states
  for (const btn of ALL_LOGICAL_BUTTONS) {
    target.buttons[btn] = false;
    target.buttonValues[btn] = 0;
  }

  // Map physical buttons to logical buttons
  const len = gamepad.buttons.length;
  for (let i = 0; i < len; i++) {
    const btnObj = gamepad.buttons[i];
    if (!btnObj) continue;

    const logical = profile.buttonMap[i];
    if (logical) {
      target.buttons[logical] = btnObj.pressed;
      target.buttonValues[logical] = btnObj.value;
    }
  }

  // Left stick
  const rawLx = gamepad.axes[profile.axes.leftX] ?? 0;
  const rawLy = gamepad.axes[profile.axes.leftY] ?? 0;
  const shapedLeft = shapeStick(rawLx, rawLy, {
    deadzone: controllerSettings.stickDeadzone,
    curve: controllerSettings.curve,
    curveAmount: controllerSettings.curveAmount,
    invertY: controllerSettings.invertY,
  });
  target.lx = shapedLeft.x;
  target.ly = shapedLeft.y;

  // Right stick
  const rawRx = gamepad.axes[profile.axes.rightX] ?? 0;
  const rawRy = gamepad.axes[profile.axes.rightY] ?? 0;
  const shapedRight = shapeStick(rawRx, rawRy, {
    deadzone: controllerSettings.stickDeadzone,
    curve: controllerSettings.curve,
    curveAmount: controllerSettings.curveAmount,
    invertY: controllerSettings.invertY,
  });
  target.rx = shapedRight.x;
  target.ry = shapedRight.y;

  // Triggers (read from analog button value or axes fallback)
  const l2Raw = target.buttonValues.l2;
  const r2Raw = target.buttonValues.r2;

  target.l2 = shapeTrigger(l2Raw, controllerSettings.triggerDeadzone);
  target.r2 = shapeTrigger(r2Raw, controllerSettings.triggerDeadzone);

  return target;
}
