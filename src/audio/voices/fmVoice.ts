import * as Tone from 'tone';

import { midiToFreq } from '@/core/notes';
import type { ParamBag } from '@/core/types';

export class FmVoice {
  public activeNote: number | null = null;
  public lastUsedTime = 0;

  private readonly fmSynth: Tone.FMSynth;
  public readonly filter: Tone.Filter;
  private readonly voiceGain: Tone.Gain;

  private baseFreq = 440;
  private pitchBendSemitones = 0;

  constructor(output: Tone.InputNode) {
    this.fmSynth = new Tone.FMSynth({
      harmonicity: 2,
      modulationIndex: 10,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.5,
        release: 0.4,
      },
      modulation: { type: 'sine' },
      modulationEnvelope: {
        attack: 0.02,
        decay: 0.3,
        sustain: 0.2,
        release: 0.4,
      },
    });

    this.filter = new Tone.Filter({
      frequency: 4000,
      type: 'lowpass',
      rolloff: -12,
      Q: 1,
    });

    this.voiceGain = new Tone.Gain(1);

    this.fmSynth.connect(this.filter);
    this.filter.connect(this.voiceGain);
    this.voiceGain.connect(output);
  }

  public triggerAttack(midiNote: number, velocity = 0.8, time = Tone.now()): void {
    this.activeNote = midiNote;
    this.lastUsedTime = time;
    this.baseFreq = midiToFreq(midiNote);

    this.updateFrequency();
    this.fmSynth.triggerAttack(this.baseFreq, time, velocity);
  }

  public triggerRelease(time = Tone.now()): void {
    this.activeNote = null;
    this.fmSynth.triggerRelease(time);
  }

  public setPitchBend(semitones: number): void {
    this.pitchBendSemitones = semitones;
    this.updateFrequency();
  }

  private updateFrequency(): void {
    const multiplier = Math.pow(2, this.pitchBendSemitones / 12);
    this.fmSynth.frequency.setValueAtTime(this.baseFreq * multiplier, Tone.now());
  }

  public applyParams(params: ParamBag): void {
    const now = Tone.now();

    if (params['fm.harmonicity'] !== undefined) {
      this.fmSynth.harmonicity.rampTo(params['fm.harmonicity'], 0.02, now);
    }
    if (params['fm.modIndex'] !== undefined) {
      this.fmSynth.modulationIndex.rampTo(params['fm.modIndex'], 0.02, now);
    }
    if (params['filter.cutoff'] !== undefined) {
      this.filter.frequency.rampTo(params['filter.cutoff'], 0.02, now);
    }
    if (params['filter.resonance'] !== undefined) {
      this.filter.Q.rampTo(params['filter.resonance'], 0.02, now);
    }
  }

  public dispose(): void {
    this.fmSynth.dispose();
    this.filter.dispose();
    this.voiceGain.dispose();
  }
}
