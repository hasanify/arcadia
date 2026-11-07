import type { Brand, LogicalButton } from '@/core/types';

export interface ControllerProfile {
  id: string;
  name: string;
  brand: Brand;
  hasTouchpad: boolean;
  hasLightbar: boolean;
  hasHaptics: boolean;
  hasGyro: boolean;
  buttonMap: Record<number, LogicalButton>;
  axes: {
    leftX: number;
    leftY: number;
    rightX: number;
    rightY: number;
  };
  triggerAxes?: {
    l2?: number;
    r2?: number;
  };
}

export const STANDARD_BUTTON_MAP: Record<number, LogicalButton> = {
  0: 'south',
  1: 'east',
  2: 'west',
  3: 'north',
  4: 'l1',
  5: 'r1',
  6: 'l2',
  7: 'r2',
  8: 'select',
  9: 'start',
  10: 'l3',
  11: 'r3',
  12: 'dpadUp',
  13: 'dpadDown',
  14: 'dpadLeft',
  15: 'dpadRight',
  16: 'home',
  17: 'touchpad',
};

export const STANDARD_AXES = {
  leftX: 0,
  leftY: 1,
  rightX: 2,
  rightY: 3,
};

export const DUALSENSE_PROFILE: ControllerProfile = {
  id: 'dualsense',
  name: 'PlayStation DualSense Wireless Controller',
  brand: 'playstation',
  hasTouchpad: true,
  hasLightbar: true,
  hasHaptics: true,
  hasGyro: true,
  buttonMap: { ...STANDARD_BUTTON_MAP },
  axes: { ...STANDARD_AXES },
};

export const DUALSHOCK4_PROFILE: ControllerProfile = {
  id: 'dualshock4',
  name: 'PlayStation DualShock 4 Controller',
  brand: 'playstation',
  hasTouchpad: true,
  hasLightbar: true,
  hasHaptics: true,
  hasGyro: false,
  buttonMap: { ...STANDARD_BUTTON_MAP },
  axes: { ...STANDARD_AXES },
};

export const XBOX_PROFILE: ControllerProfile = {
  id: 'xbox',
  name: 'Xbox Wireless Controller',
  brand: 'xbox',
  hasTouchpad: false,
  hasLightbar: false,
  hasHaptics: true,
  hasGyro: false,
  buttonMap: { ...STANDARD_BUTTON_MAP },
  axes: { ...STANDARD_AXES },
};

export const SWITCH_PRO_PROFILE: ControllerProfile = {
  id: 'switch_pro',
  name: 'Nintendo Switch Pro Controller',
  brand: 'nintendo',
  hasTouchpad: false,
  hasLightbar: false,
  hasHaptics: true,
  hasGyro: false,
  buttonMap: { ...STANDARD_BUTTON_MAP },
  axes: { ...STANDARD_AXES },
};

export const GENERIC_STANDARD_PROFILE: ControllerProfile = {
  id: 'generic_standard',
  name: 'Standard Gamepad',
  brand: 'generic',
  hasTouchpad: false,
  hasLightbar: false,
  hasHaptics: false,
  hasGyro: false,
  buttonMap: { ...STANDARD_BUTTON_MAP },
  axes: { ...STANDARD_AXES },
};

const DUALSENSE_PATTERNS = [
  /dualsense/i,
  /054c.*0ce6/i,
  /054c.*0df2/i, // DualSense Edge
  /sony.*wireless controller/i,
  /^wireless controller \(054c/i,
];

const DUALSHOCK4_PATTERNS = [/dualshock/i, /054c.*05c4/i, /054c.*09cc/i, /sony.*controller/i];

const XBOX_PATTERNS = [/xbox/i, /x-box/i, /microsoft.*controller/i, /045e.*028e/i, /045e.*02d1/i];

const SWITCH_PATTERNS = [/switch.*pro/i, /pro.*controller/i, /057e.*2009/i];

export function identifyController(gamepadId: string): ControllerProfile {
  const normalized = gamepadId.toLowerCase();

  // Check Xbox first to avoid matching generic 'wireless controller'
  for (const pattern of XBOX_PATTERNS) {
    if (pattern.test(normalized)) {
      return XBOX_PROFILE;
    }
  }

  for (const pattern of DUALSENSE_PATTERNS) {
    if (pattern.test(normalized)) {
      return DUALSENSE_PROFILE;
    }
  }

  for (const pattern of DUALSHOCK4_PATTERNS) {
    if (pattern.test(normalized)) {
      return DUALSHOCK4_PROFILE;
    }
  }

  for (const pattern of SWITCH_PATTERNS) {
    if (pattern.test(normalized)) {
      return SWITCH_PRO_PROFILE;
    }
  }

  // Fallback for PlayStation DualSense standard naming on certain OSes
  if (normalized.includes('wireless controller')) {
    return DUALSENSE_PROFILE;
  }

  return GENERIC_STANDARD_PROFILE;
}
