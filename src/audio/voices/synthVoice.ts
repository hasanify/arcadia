import * as Tone from 'tone';

import { midiToFreq } from '@/core/notes';
import type { ParamBag } from '@/core/types';

export class SynthVoice {
  public activeNote: number | null = null;
  public lastUsedTime = 0;

  private readonly osc1: Tone.Oscillator;
  private readonly osc2: Tone.Oscillator;
  private readonly subOsc: Tone.Oscillator;
  private readonly noise: Tone.Noise;
  private readonly noiseGain: Tone.Gain;
  private readonly osc1Gain: Tone.Gain;
  private readonly osc2Gain: Tone.Gain;
  private readonly subGain: Tone.Gain;

  public readonly filter: Tone.Filter;
  public readonly ampEnv: Tone.AmplitudeEnvelope;
  private readonly voiceGain: Tone.Gain;

  private baseFreq = 440;
  private pitchBendSemitones = 0;
  private osc2DetuneCents = 0;
  private osc2Octave = 0;
  private subOctave = -1;

  constructor(output: Tone.InputNode) {
    this.osc1 = new Tone.Oscillator(440, 'sawtooth');
    this.osc2 = new Tone.Oscillator(440, 'square');
    this.subOsc = new Tone.Oscillator(220, 'sine');
    this.noise = new Tone.Noise('white');

    this.osc1Gain = new Tone.Gain(0.8);
    this.osc2Gain = new Tone.Gain(0.6);
    this.subGain = new Tone.Gain(0.4);
    this.noiseGain = new Tone.Gain(0);

    this.filter = new Tone.Filter({
      frequency: 2500,
      type: 'lowpass',
      rolloff: -24,
      Q: 1,
    });

    this.ampEnv = new Tone.AmplitudeEnvelope({
      attack: 0.01,
      decay: 0.2,
      sustain: 0.7,
      release: 0.3,
    });

    this.voiceGain = new Tone.Gain(1);

    // Routing:
    // osc1 -> osc1Gain ──┐
    // osc2 -> osc2Gain ──┼─► filter ─► ampEnv ─► voiceGain ─► output
    // sub  -> subGain  ──┤
    // noise-> noiseGain ─┘
    this.osc1.connect(this.osc1Gain);
    this.osc2.connect(this.osc2Gain);
    this.subOsc.connect(this.subGain);
    this.noise.connect(this.noiseGain);

    this.osc1Gain.connect(this.filter);
    this.osc2Gain.connect(this.filter);
    this.subGain.connect(this.filter);
    this.noiseGain.connect(this.filter);

    this.filter.connect(this.ampEnv);
    this.ampEnv.connect(this.voiceGain);
    this.voiceGain.connect(output);

    this.osc1.start();
    this.osc2.start();
    this.subOsc.start();
    this.noise.start();
  }

  public triggerAttack(midiNote: number, velocity = 0.8, time = Tone.now()): void {
    this.activeNote = midiNote;
    this.lastUsedTime = time;
    this.baseFreq = midiToFreq(midiNote);

    this.updateFrequencies();
    this.ampEnv.triggerAttack(time, velocity);
  }

  public triggerRelease(time = Tone.now()): void {
    this.activeNote = null;
    this.ampEnv.triggerRelease(time);
  }

  public setPitchBend(semitones: number): void {
    this.pitchBendSemitones = semitones;
    this.updateFrequencies();
  }

  private updateFrequencies(): void {
    const bendMultiplier = Math.pow(2, this.pitchBendSemitones / 12);
    const mainFreq = this.baseFreq * bendMultiplier;

    this.osc1.frequency.setValueAtTime(mainFreq, Tone.now());

    const osc2Multiplier = Math.pow(2, this.osc2Octave + this.osc2DetuneCents / 1200);
    this.osc2.frequency.setValueAtTime(mainFreq * osc2Multiplier, Tone.now());

    const subMultiplier = Math.pow(2, this.subOctave);
    this.subOsc.frequency.setValueAtTime(mainFreq * subMultiplier, Tone.now());
  }

  public applyParams(params: ParamBag): void {
    const now = Tone.now();

    if (params['filter.cutoff'] !== undefined) {
      this.filter.frequency.rampTo(params['filter.cutoff'], 0.02, now);
    }
    if (params['filter.resonance'] !== undefined) {
      this.filter.Q.rampTo(params['filter.resonance'], 0.02, now);
    }

    if (params['amp.attack'] !== undefined) this.ampEnv.attack = params['amp.attack'];
    if (params['amp.decay'] !== undefined) this.ampEnv.decay = params['amp.decay'];
    if (params['amp.sustain'] !== undefined) this.ampEnv.sustain = params['amp.sustain'];
    if (params['amp.release'] !== undefined) this.ampEnv.release = params['amp.release'];

    if (params['osc1.level'] !== undefined)
      this.osc1Gain.gain.setValueAtTime(params['osc1.level'], now);
    if (params['osc2.level'] !== undefined)
      this.osc2Gain.gain.setValueAtTime(params['osc2.level'], now);
    if (params['sub.level'] !== undefined)
      this.subGain.gain.setValueAtTime(params['sub.level'], now);
    if (params['noise.level'] !== undefined)
      this.noiseGain.gain.setValueAtTime(params['noise.level'], now);

    if (params['osc2.octave'] !== undefined) this.osc2Octave = params['osc2.octave'];
    if (params['osc2.detune'] !== undefined) this.osc2DetuneCents = params['osc2.detune'];
    if (params['sub.octave'] !== undefined) this.subOctave = params['sub.octave'];

    this.updateFrequencies();
  }

  public dispose(): void {
    this.osc1.dispose();
    this.osc2.dispose();
    this.subOsc.dispose();
    this.noise.dispose();
    this.osc1Gain.dispose();
    this.osc2Gain.dispose();
    this.subGain.dispose();
    this.noiseGain.dispose();
    this.filter.dispose();
    this.ampEnv.dispose();
    this.voiceGain.dispose();
  }
}
