import { describe, expect, it } from 'vitest';

import { audioEngine } from '@/audio/audioEngine';
import { PlayerChannel } from '@/audio/playerChannel';

describe('PlayerChannel', () => {
  it('allocates voices and triggers noteOn and noteOff', () => {
    const channel = new PlayerChannel(0);

    channel.noteOn(60, 0.8);
    const active = channel.getActiveVoiceNotes();
    expect(active).toContain(60);

    channel.noteOff(60);
    expect(channel.getActiveVoiceNotes()).not.toContain(60);
  });

  it('handles voice stealing when exceeding max voice count', () => {
    const channel = new PlayerChannel(1);

    // Trigger 15 notes (maxVoices is 12)
    for (let i = 40; i < 55; i++) {
      channel.noteOn(i, 0.7);
    }

    const activeNotes = channel.getActiveVoiceNotes();
    expect(activeNotes.length).toBeLessThanOrEqual(12);
    channel.releaseAll();
    expect(channel.getActiveVoiceNotes()).toHaveLength(0);
  });

  it('updates volume, pan, and effects sends', () => {
    const channel = new PlayerChannel(2);

    channel.setVolume(0.5);
    expect(channel.channelGain.gain.value).toBe(0.5);

    channel.setPan(-0.5);
    expect(channel.panner.pan.value).toBe(-0.5);

    channel.setReverbSend(0.4);
    expect(channel.reverbSend.gain.value).toBe(0.4);

    channel.setDelaySend(0.3);
    expect(channel.delaySend.gain.value).toBe(0.3);
  });
});

describe('AudioEngine', () => {
  it('initializes 4 player channels', () => {
    expect(audioEngine.players).toHaveLength(4);
  });

  it('routes noteOn and noteOff to respective player channel', () => {
    audioEngine.noteOn(0, 64, 0.85);
    expect(audioEngine.players[0].getActiveVoiceNotes()).toContain(64);

    audioEngine.noteOff(0, 64);
    expect(audioEngine.players[0].getActiveVoiceNotes()).not.toContain(64);
  });

  it('updates parameters and panic stops all players', () => {
    audioEngine.noteOn(0, 50, 0.8);
    audioEngine.noteOn(1, 55, 0.8);

    audioEngine.setFilterCutoff(0, 1500);
    audioEngine.setPitchBend(0, 2);
    audioEngine.setVolume(0, 0.9);
    audioEngine.setPan(0, 0.2);
    audioEngine.setReverbSend(0, 0.1);
    audioEngine.setDelaySend(0, 0.2);

    audioEngine.panic();
    expect(audioEngine.players[0].getActiveVoiceNotes()).toHaveLength(0);
    expect(audioEngine.players[1].getActiveVoiceNotes()).toHaveLength(0);
  });
});
