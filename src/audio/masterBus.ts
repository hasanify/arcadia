import * as Tone from 'tone';

export class MasterBus {
  public readonly masterGain: Tone.Gain;
  public readonly limiter: Tone.Limiter;
  public readonly meter: Tone.Meter;
  public readonly reverb: Tone.Reverb;
  public readonly delay: Tone.FeedbackDelay;
  public readonly reverbGain: Tone.Gain;
  public readonly delayGain: Tone.Gain;

  constructor() {
    this.masterGain = new Tone.Gain(0.8);
    this.limiter = new Tone.Limiter(-0.5);
    this.meter = new Tone.Meter({ smoothing: 0.8 });

    // Send FX
    this.reverb = new Tone.Reverb({
      decay: 2.5,
      preDelay: 0.01,
      wet: 1,
    });
    this.delay = new Tone.FeedbackDelay({
      delayTime: 0.35,
      feedback: 0.3,
      wet: 1,
    });

    this.reverbGain = new Tone.Gain(0.2);
    this.delayGain = new Tone.Gain(0.15);

    // Wire send effects
    this.reverb.connect(this.reverbGain);
    this.reverbGain.connect(this.masterGain);

    this.delay.connect(this.delayGain);
    this.delayGain.connect(this.masterGain);

    // Master chain: masterGain -> limiter -> meter -> destination
    this.masterGain.connect(this.limiter);
    this.limiter.connect(this.meter);
    this.meter.connect(Tone.getDestination());
  }

  public setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    this.masterGain.gain.rampTo(clamped, 0.05);
  }

  public getLevels(): [number, number] {
    const val = this.meter.getValue();
    if (Array.isArray(val)) {
      return [Math.max(-60, Math.min(0, val[0] ?? -60)), Math.max(-60, Math.min(0, val[1] ?? -60))];
    }
    const single = Math.max(-60, Math.min(0, typeof val === 'number' ? val : -60));
    return [single, single];
  }

  public panic(): void {
    // Ramp volume to 0 briefly then restore to silence all hanging nodes
    const currentVol = this.masterGain.gain.value;
    this.masterGain.gain.cancelScheduledValues(Tone.now());
    this.masterGain.gain.setValueAtTime(0, Tone.now());
    this.masterGain.gain.setValueAtTime(currentVol, Tone.now() + 0.05);
  }
}

export const masterBus = new MasterBus();
