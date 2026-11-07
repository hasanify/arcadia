import * as Tone from 'tone';

import type { InstrumentConfig, PlayerId } from '@/core/types';
import { masterBus } from '@/audio/masterBus';
import { FmVoice } from '@/audio/voices/fmVoice';
import { SynthVoice } from '@/audio/voices/synthVoice';

type Voice = SynthVoice | FmVoice;

export class PlayerChannel {
  public readonly playerId: PlayerId;
  public readonly channelGain: Tone.Gain;
  public readonly panner: Tone.Panner;
  public readonly reverbSend: Tone.Gain;
  public readonly delaySend: Tone.Gain;

  private voices: Voice[] = [];
  private currentKind: 'synth' | 'fm' = 'synth';
  private maxVoices = 12;

  constructor(playerId: PlayerId) {
    this.playerId = playerId;

    this.channelGain = new Tone.Gain(1);
    this.panner = new Tone.Panner(0);
    this.reverbSend = new Tone.Gain(0.2);
    this.delaySend = new Tone.Gain(0.15);

    // Channel Routing:
    // voiceOutput -> panner -> channelGain -> masterBus.masterGain
    //                      └──► reverbSend ─► masterBus.reverb
    //                      └──► delaySend  ─► masterBus.delay
    this.panner.connect(this.channelGain);
    this.channelGain.connect(masterBus.masterGain);

    this.panner.connect(this.reverbSend);
    this.reverbSend.connect(masterBus.reverb);

    this.panner.connect(this.delaySend);
    this.delaySend.connect(masterBus.delay);

    this.rebuildVoicePool('synth', this.maxVoices);
  }

  public rebuildVoicePool(kind: 'synth' | 'fm', count: number): void {
    this.releaseAll();
    for (const voice of this.voices) {
      voice.dispose();
    }
    this.voices = [];
    this.currentKind = kind;
    this.maxVoices = Math.max(4, Math.min(24, count));

    for (let i = 0; i < this.maxVoices; i++) {
      if (kind === 'fm') {
        this.voices.push(new FmVoice(this.panner));
      } else {
        this.voices.push(new SynthVoice(this.panner));
      }
    }
  }

  public configureInstrument(instrument: InstrumentConfig): void {
    const targetKind = instrument.kind === 'fm' ? 'fm' : 'synth';
    if (targetKind !== this.currentKind) {
      this.rebuildVoicePool(targetKind, this.maxVoices);
    }

    for (const voice of this.voices) {
      voice.applyParams(instrument.params);
    }
  }

  public noteOn(midiNote: number, velocity = 0.8): void {
    const now = Tone.now();

    // 1. Check if note is already sounding on an active voice; if so, retrigger it
    let targetVoice: Voice | undefined = this.voices.find((v) => v.activeNote === midiNote);

    // 2. Otherwise find an idle voice
    if (!targetVoice) {
      targetVoice = this.voices.find((v) => v.activeNote === null);
    }

    // 3. Otherwise steal the oldest used voice (LRU)
    if (!targetVoice) {
      targetVoice = this.voices.reduce((oldest, current) =>
        current.lastUsedTime < oldest.lastUsedTime ? current : oldest,
      );
    }

    targetVoice.triggerAttack(midiNote, velocity, now);
  }

  public noteOff(midiNote: number): void {
    const now = Tone.now();
    for (const voice of this.voices) {
      if (voice.activeNote === midiNote) {
        voice.triggerRelease(now);
      }
    }
  }

  public setFilterCutoff(freq: number): void {
    for (const voice of this.voices) {
      voice.filter.frequency.rampTo(freq, 0.02, Tone.now());
    }
  }

  public setPitchBend(semitones: number): void {
    for (const voice of this.voices) {
      voice.setPitchBend(semitones);
    }
  }

  public setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    this.channelGain.gain.rampTo(clamped, 0.02, Tone.now());
  }

  public setPan(pan: number): void {
    const clamped = Math.max(-1, Math.min(1, pan));
    this.panner.pan.rampTo(clamped, 0.02, Tone.now());
  }

  public setReverbSend(amount: number): void {
    const clamped = Math.max(0, Math.min(1, amount));
    this.reverbSend.gain.rampTo(clamped, 0.02, Tone.now());
  }

  public setDelaySend(amount: number): void {
    const clamped = Math.max(0, Math.min(1, amount));
    this.delaySend.gain.rampTo(clamped, 0.02, Tone.now());
  }

  public releaseAll(): void {
    const now = Tone.now();
    for (const voice of this.voices) {
      if (voice.activeNote !== null) {
        voice.triggerRelease(now);
      }
    }
  }
}
