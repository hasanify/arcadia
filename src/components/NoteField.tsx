import React, { useEffect, useRef, useState } from 'react';

import { resolveNote } from '@/core/mapping';
import { midiToNoteName, noteNameToMidi } from '@/core/notes';
import type { NoteButton, PlayerId } from '@/core/types';
import { liveState } from '@/input/liveState';
import { useConfigStore } from '@/state/configStore';
import { KeyBadge } from '@/components/KeyBadge';

void React;

interface NoteFieldProps {
  player: PlayerId;
  button: NoteButton;
  side: 'left' | 'right';
}

const BUTTON_GLYPHS: Record<NoteButton, string> = {
  l1: 'L1',
  dpadUp: '↑',
  dpadLeft: '←',
  dpadDown: '↓',
  dpadRight: '→',
  r1: 'R1',
  north: '△',
  west: '□',
  east: '○',
  south: '✕',
};

export function NoteField({ player, button, side }: NoteFieldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const playerConfig = useConfigStore((state) => state.players[player]);
  const setPlayer = useConfigStore((state) => state.setPlayer);

  const resolvedMidi = resolveNote(button, playerConfig);
  const currentNoteName = resolvedMidi !== null ? midiToNoteName(resolvedMidi) : 'C1';

  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    // 60Hz Direct DOM feedback on button press
    const unsubscribe = liveState.subscribe(player, (p) => {
      const el = containerRef.current;
      if (!el) return;

      const isPressed = Boolean(p.buttons[button]);
      const wasActive = el.getAttribute('data-active') === 'true';

      if (isPressed !== wasActive) {
        el.setAttribute('data-active', isPressed ? 'true' : 'false');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [player, button]);

  const handleCommitEdit = (): void => {
    const trimmed = editValue.trim().toUpperCase();
    const midi = noteNameToMidi(trimmed);
    if (midi !== null) {
      setPlayer(player, (prev) => ({
        noteMap: {
          ...prev.noteMap,
          [button]: trimmed,
        },
      }));
    }
    setIsEditing(false);
  };

  const glyph = BUTTON_GLYPHS[button];

  return (
    <div
      ref={containerRef}
      data-active="false"
      className="
        group relative flex items-center justify-between rounded-field border
        border-line/70 bg-field px-3 py-2 transition-colors duration-75 block-10
        inline-full
        hover:border-line hover:bg-field-hover
        data-[active=true]:border-accent data-[active=true]:bg-accent
        data-[active=true]:text-[#1f1f1f]
      "
    >
      {/* Left side items */}
      <div className="flex items-center gap-2">
        <span
          className="
            font-mono text-xs font-bold text-muted transition-colors
            group-data-[active=true]:text-[#1f1f1f]
          "
        >
          {glyph}
        </span>
        {side === 'left' && <KeyBadge action={button} />}
      </div>

      {/* Note Name / Editing field */}
      <div className="flex items-center gap-2">
        {side === 'right' && <KeyBadge action={button} />}
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            autoFocus
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleCommitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCommitEdit();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            className="
              rounded-[2px] border border-accent bg-bg px-1.5 py-0.5 text-center
              font-mono text-xs font-bold text-text outline-none block-6
              inline-14
            "
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditValue(currentNoteName);
              setIsEditing(true);
            }}
            title="Click to edit pitch"
            className="
              font-mono text-xs font-semibold tracking-wide text-text
              transition-colors
              group-data-[active=true]:text-[#1f1f1f]
              hover:text-accent
            "
          >
            {currentNoteName}
          </button>
        )}
      </div>
    </div>
  );
}
