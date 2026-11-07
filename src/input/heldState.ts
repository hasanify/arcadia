import type { NoteButton, PlayerId } from '@/core/types';

export class HeldStateManager {
  private heldNotesByPlayer: [
    Map<NoteButton, number>,
    Map<NoteButton, number>,
    Map<NoteButton, number>,
    Map<NoteButton, number>,
  ] = [new Map(), new Map(), new Map(), new Map()];

  public setHeldNote(playerId: PlayerId, button: NoteButton, midiNote: number): void {
    this.heldNotesByPlayer[playerId].set(button, midiNote);
  }

  public clearHeldNote(playerId: PlayerId, button: NoteButton): number | null {
    const map = this.heldNotesByPlayer[playerId];
    const existing = map.get(button) ?? null;
    map.delete(button);
    return existing;
  }

  public getHeldNotes(playerId: PlayerId): ReadonlyMap<NoteButton, number> {
    return this.heldNotesByPlayer[playerId];
  }

  public clearAll(playerId?: PlayerId): void {
    if (playerId !== undefined) {
      this.heldNotesByPlayer[playerId].clear();
    } else {
      for (const map of this.heldNotesByPlayer) {
        map.clear();
      }
    }
  }
}

export const heldState = new HeldStateManager();
