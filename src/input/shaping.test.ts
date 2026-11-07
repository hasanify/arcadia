import { describe, expect, it } from 'vitest';

import { shapeStick, shapeTrigger } from '@/input/shaping';

describe('shaping', () => {
  it('suppresses stick movement within radial deadzone', () => {
    const shaped = shapeStick(0.05, 0.05, {
      deadzone: 0.12,
      curve: 'linear',
      curveAmount: 0,
      invertY: false,
    });

    expect(shaped.x).toBe(0);
    expect(shaped.y).toBe(0);
    expect(shaped.magnitude).toBe(0);
  });

  it('preserves direction while smoothly scaling above deadzone', () => {
    const shaped = shapeStick(1, 0, {
      deadzone: 0.1,
      curve: 'linear',
      curveAmount: 0,
      invertY: false,
    });

    expect(shaped.x).toBe(1);
    expect(shaped.y).toBe(0);
    expect(shaped.magnitude).toBe(1);
  });

  it('inverts Y axis when invertY is enabled', () => {
    const shaped = shapeStick(0, 0.8, {
      deadzone: 0.1,
      curve: 'linear',
      curveAmount: 0,
      invertY: true,
    });

    expect(shaped.y).toBeLessThan(0);
  });

  it('applies exponential response curve', () => {
    const linear = shapeStick(0.5, 0, {
      deadzone: 0,
      curve: 'linear',
      curveAmount: 0,
      invertY: false,
    });

    const expo = shapeStick(0.5, 0, {
      deadzone: 0,
      curve: 'expo',
      curveAmount: 0.5,
      invertY: false,
    });

    expect(expo.magnitude).toBeLessThan(linear.magnitude);
  });

  it('shapes triggers with deadzone clamping', () => {
    expect(shapeTrigger(0.02, 0.05)).toBe(0);
    expect(shapeTrigger(1, 0.05)).toBe(1);
    expect(shapeTrigger(0.525, 0.05)).toBeCloseTo(0.5, 2);
  });
});
