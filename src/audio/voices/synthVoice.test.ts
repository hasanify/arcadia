import * as Tone from 'tone';
import { describe, expect, it } from 'vitest';

import { FmVoice } from '@/audio/voices/fmVoice';
import { SynthVoice } from '@/audio/voices/synthVoice';

describe('SynthVoice', () => {
  it('triggers attack and updates active note', () => {
    const dummyOutput = new Tone.Gain();
    const voice = new SynthVoice(dummyOutput);

    expect(voice.activeNote).toBeNull();
    voice.triggerAttack(60, 0.8);
    expect(voice.activeNote).toBe(60);

    voice.triggerRelease();
    expect(voice.activeNote).toBeNull();
    voice.dispose();
  });

  it('updates parameters and pitch bend smoothly', () => {
    const dummyOutput = new Tone.Gain();
    const voice = new SynthVoice(dummyOutput);

    voice.triggerAttack(69, 0.9); // A4 = 440Hz
    voice.setPitchBend(2); // 2 semitones up

    voice.applyParams({
      'filter.cutoff': 1200,
      'filter.resonance': 2.5,
      'amp.attack': 0.05,
      'amp.decay': 0.3,
      'amp.sustain': 0.8,
      'amp.release': 0.6,
      'osc1.level': 0.7,
      'osc2.level': 0.5,
      'sub.level': 0.3,
      'noise.level': 0.1,
      'osc2.octave': 1,
      'osc2.detune': 15,
      'sub.octave': -2,
    });

    expect(voice.ampEnv.attack).toBe(0.05);
    expect(voice.ampEnv.decay).toBe(0.3);
    voice.dispose();
  });
});

describe('FmVoice', () => {
  it('triggers attack and release correctly', () => {
    const dummyOutput = new Tone.Gain();
    const fmVoice = new FmVoice(dummyOutput);

    expect(fmVoice.activeNote).toBeNull();
    fmVoice.triggerAttack(48, 0.75);
    expect(fmVoice.activeNote).toBe(48);

    fmVoice.setPitchBend(-1);
    fmVoice.applyParams({
      'fm.harmonicity': 3,
      'fm.modulationIndex': 15,
      'filter.cutoff': 3000,
      'filter.resonance': 1.5,
    });

    fmVoice.triggerRelease();
    expect(fmVoice.activeNote).toBeNull();
    fmVoice.dispose();
  });
});
