import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearPadCalibration,
  getPadCalibration,
  savePadCalibration,
  type PadCalibration,
} from '@/input/calibration';

describe('calibration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when no calibration exists', () => {
    expect(getPadCalibration('unknown-pad')).toBeNull();
  });

  it('saves and retrieves calibration data', () => {
    const cal: PadCalibration = {
      padId: 'pad-123',
      leftStickCenter: [0.02, -0.01],
      rightStickCenter: [0, 0.03],
      leftTriggerMin: 0.01,
      rightTriggerMin: 0.02,
      updatedAt: Date.now(),
    };

    savePadCalibration(cal);
    const retrieved = getPadCalibration('pad-123');

    expect(retrieved).not.toBeNull();
    expect(retrieved?.leftStickCenter).toEqual([0.02, -0.01]);
  });

  it('clears saved calibration', () => {
    const cal: PadCalibration = {
      padId: 'pad-to-clear',
      leftStickCenter: [0, 0],
      rightStickCenter: [0, 0],
      leftTriggerMin: 0,
      rightTriggerMin: 0,
      updatedAt: Date.now(),
    };

    savePadCalibration(cal);
    expect(getPadCalibration('pad-to-clear')).not.toBeNull();

    clearPadCalibration('pad-to-clear');
    expect(getPadCalibration('pad-to-clear')).toBeNull();
  });
});
