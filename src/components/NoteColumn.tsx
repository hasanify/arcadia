import React from 'react';

import type { NoteButton, PlayerId } from '@/core/types';
import { NoteField } from '@/components/NoteField';

void React;

interface NoteColumnProps {
  player: PlayerId;
  side: 'left' | 'right';
}

const LEFT_BUTTONS: NoteButton[] = ['l1', 'dpadUp', 'dpadDown', 'dpadLeft', 'dpadRight'];
const RIGHT_BUTTONS: NoteButton[] = ['r1', 'north', 'west', 'east', 'south'];

export function NoteColumn({ player, side }: NoteColumnProps) {
  const buttons = side === 'left' ? LEFT_BUTTONS : RIGHT_BUTTONS;

  return (
    <div
      className="
        flex flex-col gap-2 rounded-panel border border-line/60 bg-panel/60 p-3
        inline-56
      "
    >
      <div
        className="
          flex items-center justify-between border-be border-line/40 pbe-1.5
          font-mono text-[11px] font-semibold tracking-wider text-muted
          uppercase
        "
      >
        <span>{side === 'left' ? 'Left Pad' : 'Right Pad'}</span>
        <span>Pitch</span>
      </div>
      <div className="flex flex-col gap-2">
        {buttons.map((button) => (
          <NoteField key={button} player={player} button={button} side={side} />
        ))}
      </div>
    </div>
  );
}
