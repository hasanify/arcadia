import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

class MockAudioParam {
  public value: number;
  constructor(initial = 0) {
    this.value = initial;
  }
  public rampTo = vi.fn((val: number) => {
    this.value = val;
  });
  public setValueAtTime = vi.fn((val: number) => {
    this.value = val;
  });
  public cancelScheduledValues = vi.fn();
}

class MockGain {
  public gain: MockAudioParam;
  constructor(val = 1) {
    this.gain = new MockAudioParam(val);
  }
  public connect = vi.fn();
  public disconnect = vi.fn();
  public dispose = vi.fn();
}

class MockFilter {
  public frequency = new MockAudioParam(2500);
  public Q = new MockAudioParam(1);
  public type = 'lowpass';
  public rolloff = -24;
  public connect = vi.fn();
  public disconnect = vi.fn();
  public dispose = vi.fn();
}

class MockOscillator {
  public frequency: MockAudioParam;
  public type: string;
  constructor(freq = 440, type = 'sawtooth') {
    this.frequency = new MockAudioParam(freq);
    this.type = type;
  }
  public start = vi.fn();
  public stop = vi.fn();
  public connect = vi.fn();
  public disconnect = vi.fn();
  public dispose = vi.fn();
}

class MockNoise {
  public type: string;
  constructor(type = 'white') {
    this.type = type;
  }
  public start = vi.fn();
  public stop = vi.fn();
  public connect = vi.fn();
  public disconnect = vi.fn();
  public dispose = vi.fn();
}

class MockAmplitudeEnvelope {
  public attack = 0.01;
  public decay = 0.2;
  public sustain = 0.7;
  public release = 0.5;
  constructor(opts?: { attack?: number; decay?: number; sustain?: number; release?: number }) {
    if (opts?.attack !== undefined) this.attack = opts.attack;
    if (opts?.decay !== undefined) this.decay = opts.decay;
    if (opts?.sustain !== undefined) this.sustain = opts.sustain;
    if (opts?.release !== undefined) this.release = opts.release;
  }
  public triggerAttack = vi.fn();
  public triggerRelease = vi.fn();
  public connect = vi.fn();
  public disconnect = vi.fn();
  public dispose = vi.fn();
}

class MockFMSynth {
  public frequency = new MockAudioParam(440);
  public harmonicity = new MockAudioParam(2);
  public modulationIndex = new MockAudioParam(10);
  public triggerAttack = vi.fn();
  public triggerRelease = vi.fn();
  public setNote = vi.fn();
  public connect = vi.fn();
  public disconnect = vi.fn();
  public dispose = vi.fn();
}

class MockPanner {
  public pan: MockAudioParam;
  constructor(p = 0) {
    this.pan = new MockAudioParam(p);
  }
  public connect = vi.fn();
  public disconnect = vi.fn();
  public dispose = vi.fn();
}

class MockLimiter {
  public connect = vi.fn();
  public disconnect = vi.fn();
  public dispose = vi.fn();
}

class MockMeter {
  public getValue = vi.fn(() => [-12, -12]);
  public connect = vi.fn();
  public disconnect = vi.fn();
  public dispose = vi.fn();
}

class MockReverb {
  public connect = vi.fn();
  public disconnect = vi.fn();
  public dispose = vi.fn();
}

class MockFeedbackDelay {
  public connect = vi.fn();
  public disconnect = vi.fn();
  public dispose = vi.fn();
}

vi.mock('tone', () => {
  return {
    start: vi.fn().mockResolvedValue(undefined),
    getContext: vi.fn(() => ({ state: 'running' })),
    now: vi.fn(() => 0),
    getDestination: vi.fn(() => ({})),
    Gain: MockGain,
    Filter: MockFilter,
    Oscillator: MockOscillator,
    Noise: MockNoise,
    AmplitudeEnvelope: MockAmplitudeEnvelope,
    FMSynth: MockFMSynth,
    Panner: MockPanner,
    Limiter: MockLimiter,
    Meter: MockMeter,
    Reverb: MockReverb,
    FeedbackDelay: MockFeedbackDelay,
  };
});

afterEach(() => {
  cleanup();
});

// Global audio context mock for headless test runners
if (typeof window !== 'undefined') {
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        media: '',
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      };
    };
}
