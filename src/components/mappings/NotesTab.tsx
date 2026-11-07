import React from 'react';

import {
  NOTE_BUTTONS,
  type NoteButton,
  type NoteMode,
  type PitchClass,
  type PlayerId,
  type ScaleType,
} from '@/core/types';
import { useConfigStore } from '@/state/configStore';

void React;

interface NotesTabProps {
  player: PlayerId;
}

const PITCH_CLASSES: PitchClass[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];
const SCALE_TYPES: { label: string; value: ScaleType }[] = [
  { label: 'Chromatic', value: 'chromatic' },
  { label: 'Major', value: 'major' },
  { label: 'Minor', value: 'minor' },
  { label: 'Pentatonic Major', value: 'pentatonicMajor' },
  { label: 'Pentatonic Minor', value: 'pentatonicMinor' },
  { label: 'Dorian', value: 'dorian' },
  { label: 'Blues', value: 'blues' },
];

const BUTTON_LABELS: Record<NoteButton, string> = {
  l1: 'L1 Bumper',
  dpadUp: 'D-Pad Up',
  dpadLeft: 'D-Pad Left',
  dpadDown: 'D-Pad Down',
  dpadRight: 'D-Pad Right',
  r1: 'R1 Bumper',
  north: 'North (△ / Y)',
  west: 'West (□ / X)',
  east: 'East (○ / B)',
  south: 'South (✕ / A)',
};

export function NotesTab({ player }: NotesTabProps) {
  const playerConfig = useConfigStore((state) => state.players[player]);
  const setPlayer = useConfigStore((state) => state.setPlayer);

  const handleModeChange = (noteMode: NoteMode): void => {
    setPlayer(player, { noteMode });
  };

  const handleNoteMapChange = (btn: NoteButton, val: string): void => {
    setPlayer(player, (prev) => ({
      noteMap: {
        ...prev.noteMap,
        [btn]: val.toUpperCase(),
      },
    }));
  };

  return (
    <div className="flex flex-col gap-6" data-testid="notes-tab">
      {/* Note Mode Selector */}
      <div
        className="
          flex flex-col gap-2 rounded-panel border border-line/50 bg-panel/60
          p-4
        "
      >
        <label className="text-xs font-bold tracking-wider text-muted uppercase">
          Mapping Strategy
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleModeChange('absolute')}
            className={`
              flex-1 rounded-field border px-3 py-2 text-xs font-semibold
              transition-colors
              ${
                playerConfig.noteMode === 'absolute'
                  ? 'border-accent bg-accent text-[#1f1f1f]'
                  : `
                    border-line/40 bg-field text-text
                    hover:bg-field-hover
                  `
              }
            `}
          >
            Absolute (Individual Button Pitches)
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('scale')}
            className={`
              flex-1 rounded-field border px-3 py-2 text-xs font-semibold
              transition-colors
              ${
                playerConfig.noteMode === 'scale'
                  ? 'border-accent bg-accent text-[#1f1f1f]'
                  : `
                    border-line/40 bg-field text-text
                    hover:bg-field-hover
                  `
              }
            `}
          >
            Scale Quantized (Musical Scale & Key)
          </button>
        </div>
      </div>

      {/* Scale Controls (when scale mode selected) */}
      {playerConfig.noteMode === 'scale' && (
        <div
          className="
            grid grid-cols-1 gap-4 rounded-panel border border-line/50
            bg-panel/60 p-4
            md:grid-cols-3
          "
        >
          {/* Scale Root */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted">Root Pitch</label>
            <select
              value={playerConfig.scale.root}
              onChange={(e) =>
                setPlayer(player, (prev) => ({
                  scale: { ...prev.scale, root: e.target.value as PitchClass },
                }))
              }
              className="
                rounded-field border border-line/60 bg-field px-3 py-1.5
                font-mono text-xs text-text outline-none block-8
                focus:border-accent
              "
            >
              {PITCH_CLASSES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Scale Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted">Scale Type</label>
            <select
              value={playerConfig.scale.type}
              onChange={(e) =>
                setPlayer(player, (prev) => ({
                  scale: { ...prev.scale, type: e.target.value as ScaleType },
                }))
              }
              className="
                rounded-field border border-line/60 bg-field px-3 py-1.5 text-xs
                text-text outline-none block-8
                focus:border-accent
              "
            >
              {SCALE_TYPES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Base Octave */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted">Base Octave</label>
            <select
              value={playerConfig.scale.baseOctave}
              onChange={(e) =>
                setPlayer(player, (prev) => ({
                  scale: { ...prev.scale, baseOctave: Number(e.target.value) },
                }))
              }
              className="
                rounded-field border border-line/60 bg-field px-3 py-1.5
                font-mono text-xs text-text outline-none block-8
                focus:border-accent
              "
            >
              {[0, 1, 2, 3, 4, 5, 6].map((oct) => (
                <option key={oct} value={oct}>
                  Octave {oct}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Absolute Button Table */}
      {playerConfig.noteMode === 'absolute' && (
        <div
          className="
            flex flex-col gap-3 rounded-panel border border-line/50 bg-panel/60
            p-4
          "
        >
          <label className="text-xs font-bold tracking-wider text-muted uppercase">
            10-Button Note Map
          </label>
          <div
            className="
              grid grid-cols-1 gap-2
              sm:grid-cols-2
            "
          >
            {NOTE_BUTTONS.map((btn) => (
              <div
                key={btn}
                className="
                  flex items-center justify-between rounded-field border
                  border-line/40 bg-field px-3 py-1.5 block-9
                "
              >
                <span className="text-xs font-medium text-text">{BUTTON_LABELS[btn]}</span>
                <input
                  type="text"
                  value={playerConfig.noteMap[btn]}
                  onChange={(e) => handleNoteMapChange(btn, e.target.value)}
                  className="
                    rounded-[2px] border border-line/60 bg-bg px-2 py-0.5
                    text-center font-mono text-xs font-bold text-text
                    outline-none block-6 inline-16
                    focus:border-accent
                  "
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Modifiers: Octave Shift & Transpose */}
      <div
        className="
          grid grid-cols-1 gap-4 rounded-panel border border-line/50 bg-panel/60
          p-4
          md:grid-cols-2
        "
      >
        {/* Octave Shift */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted">Octave Shift</label>
            <span className="font-mono text-xs font-bold text-accent">
              {playerConfig.octaveShift > 0
                ? `+${playerConfig.octaveShift}`
                : playerConfig.octaveShift}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={playerConfig.octaveShift <= -3}
              onClick={() =>
                setPlayer(player, (p) => ({
                  octaveShift: Math.max(-3, p.octaveShift - 1),
                }))
              }
              className="
                flex-1 rounded-field border border-line/50 bg-field py-1 text-xs
                font-bold
                disabled:opacity-40
              "
            >
              −1 Oct
            </button>
            <button
              type="button"
              disabled={playerConfig.octaveShift >= 3}
              onClick={() =>
                setPlayer(player, (p) => ({
                  octaveShift: Math.min(3, p.octaveShift + 1),
                }))
              }
              className="
                flex-1 rounded-field border border-line/50 bg-field py-1 text-xs
                font-bold
                disabled:opacity-40
              "
            >
              +1 Oct
            </button>
          </div>
        </div>

        {/* Transpose */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted">Transpose Semitones</label>
            <span className="font-mono text-xs font-bold text-accent">
              {playerConfig.transposeSemitones > 0
                ? `+${playerConfig.transposeSemitones}`
                : playerConfig.transposeSemitones}
            </span>
          </div>
          <input
            type="range"
            min="-12"
            max="12"
            value={playerConfig.transposeSemitones}
            onChange={(e) => setPlayer(player, { transposeSemitones: Number(e.target.value) })}
            className="accent-accent"
          />
        </div>
      </div>
    </div>
  );
}
