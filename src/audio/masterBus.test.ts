import { describe, expect, it } from 'vitest';

import { masterBus } from '@/audio/masterBus';

describe('MasterBus', () => {
  it('initializes with default volume and limiter settings', () => {
    expect(masterBus.masterGain.gain.value).toBe(0.8);
    expect(masterBus.limiter).toBeDefined();
    expect(masterBus.reverb).toBeDefined();
    expect(masterBus.delay).toBeDefined();
  });

  it('adjusts volume within 0..1 boundaries', () => {
    masterBus.setVolume(0.5);
    expect(masterBus.masterGain.gain.value).toBeCloseTo(0.5, 1);

    masterBus.setVolume(1.5);
    expect(masterBus.masterGain.gain.value).toBeCloseTo(1, 1);
  });

  it('returns valid decibel levels from meter', () => {
    const levels = masterBus.getLevels();
    expect(levels).toHaveLength(2);
    expect(levels[0]).toBeLessThanOrEqual(0);
    expect(levels[1]).toBeLessThanOrEqual(0);
  });
});
