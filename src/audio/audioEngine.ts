import type { InstrumentConfig, PlayerId } from '@/core/types';
import { masterBus } from '@/audio/masterBus';
import { PlayerChannel } from '@/audio/playerChannel';

export class AudioEngine {
  public readonly players: [PlayerChannel, PlayerChannel, PlayerChannel, PlayerChannel];

  constructor() {
    this.players = [
      new PlayerChannel(0),
      new PlayerChannel(1),
      new PlayerChannel(2),
      new PlayerChannel(3),
    ];
  }

  public noteOn(playerId: PlayerId, midiNote: number, velocity = 0.8): void {
    const channel = this.players[playerId];
    channel.noteOn(midiNote, velocity);
  }

  public noteOff(playerId: PlayerId, midiNote: number): void {
    const channel = this.players[playerId];
    channel.noteOff(midiNote);
  }

  public setInstrument(playerId: PlayerId, instrument: InstrumentConfig): void {
    this.players[playerId].configureInstrument(instrument);
  }

  public setFilterCutoff(playerId: PlayerId, freq: number): void {
    this.players[playerId].setFilterCutoff(freq);
  }

  public setPitchBend(playerId: PlayerId, semitones: number): void {
    this.players[playerId].setPitchBend(semitones);
  }

  public setVolume(playerId: PlayerId, volume: number): void {
    this.players[playerId].setVolume(volume);
  }

  public setPan(playerId: PlayerId, pan: number): void {
    this.players[playerId].setPan(pan);
  }

  public setReverbSend(playerId: PlayerId, amount: number): void {
    this.players[playerId].setReverbSend(amount);
  }

  public setDelaySend(playerId: PlayerId, amount: number): void {
    this.players[playerId].setDelaySend(amount);
  }

  public panic(): void {
    for (const channel of this.players) {
      channel.releaseAll();
    }
    masterBus.panic();
  }
}

export const audioEngine = new AudioEngine();
