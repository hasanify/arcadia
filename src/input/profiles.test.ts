import { describe, expect, it } from 'vitest';

import {
  DUALSENSE_PROFILE,
  DUALSHOCK4_PROFILE,
  GENERIC_STANDARD_PROFILE,
  identifyController,
  SWITCH_PRO_PROFILE,
  XBOX_PROFILE,
} from '@/input/profiles';

describe('profiles', () => {
  it('identifies Sony DualSense controllers', () => {
    expect(identifyController('DualSense Wireless Controller (STANDARD GAMEPAD)')).toBe(
      DUALSENSE_PROFILE,
    );
    expect(
      identifyController('Sony Interactive Entertainment Wireless Controller (054c:0ce6)'),
    ).toBe(DUALSENSE_PROFILE);
  });

  it('identifies Sony DualShock 4 controllers', () => {
    expect(identifyController('Sony DualShock 4 (Vendor: 054c Product: 05c4)')).toBe(
      DUALSHOCK4_PROFILE,
    );
  });

  it('identifies Xbox Wireless controllers', () => {
    expect(identifyController('Xbox Wireless Controller (STANDARD GAMEPAD)')).toBe(XBOX_PROFILE);
    expect(identifyController('Xbox 360 Controller (XInput STANDARD GAMEPAD)')).toBe(XBOX_PROFILE);
  });

  it('identifies Nintendo Switch Pro controllers', () => {
    expect(identifyController('Nintendo Switch Pro Controller (Vendor: 057e Product: 2009)')).toBe(
      SWITCH_PRO_PROFILE,
    );
  });

  it('falls back to generic standard gamepad profile', () => {
    expect(identifyController('Unknown Gamepad Model 9000')).toBe(GENERIC_STANDARD_PROFILE);
  });
});
