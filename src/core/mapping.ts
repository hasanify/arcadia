import { noteNameToMidi } from '@/core/notes';
import { getScaleDegreeOffset } from '@/core/scales';
import type { NoteButton, PlayerConfig } from '@/core/types';
import { PITCH_ORDER } from '@/core/types';

export function resolveNote(
  button: NoteButton,
  config: Pick<
    PlayerConfig,
    'noteMode' | 'noteMap' | 'scale' | 'octaveShift' | 'transposeSemitones'
  >,
  middleCOctave: 3 | 4 = 3,
): number | null {
  const shift = config.octaveShift * 12 + config.transposeSemitones;

  if (config.noteMode === 'absolute') {
    const noteName = config.noteMap[button];
    if (!noteName) return null;
    const baseMidi = noteNameToMidi(noteName, middleCOctave);
    if (baseMidi === null) return null;

    const midi = baseMidi + shift;
    if (midi < 0 || midi > 127) return null;
    return midi;
  }

  // Scale mode
  const index = PITCH_ORDER.indexOf(button);
  if (index === -1) return null;

  const rootName = `${config.scale.root}${config.scale.baseOctave}`;
  const rootMidi = noteNameToMidi(rootName, middleCOctave);
  if (rootMidi === null) return null;

  const degreeSemitone = getScaleDegreeOffset(config.scale.type, index);
  const midi = rootMidi + degreeSemitone + shift;

  if (midi < 0 || midi > 127) return null;
  return midi;
}
