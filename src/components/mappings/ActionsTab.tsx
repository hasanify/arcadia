import React from 'react';

import type { GlobalAction, LogicalButton, PlayerId } from '@/core/types';
import { useConfigStore } from '@/state/configStore';

void React;

interface ActionsTabProps {
  player: PlayerId;
}

const ACTION_BUTTONS: { id: LogicalButton; label: string }[] = [
  { id: 'start', label: 'Start / Options' },
  { id: 'select', label: 'Select / Share / Create' },
  { id: 'l3', label: 'Left Stick Click (L3)' },
  { id: 'r3', label: 'Right Stick Click (R3)' },
  { id: 'touchpad', label: 'Touchpad Click' },
  { id: 'home', label: 'Home / PS Button' },
];

const GLOBAL_ACTION_OPTIONS: { value: GlobalAction; label: string }[] = [
  { value: 'none', label: 'None (Disabled)' },
  { value: 'recordToggle', label: 'Toggle Recording (●)' },
  { value: 'replayToggle', label: 'Toggle Replay (▶)' },
  { value: 'octaveUp', label: 'Octave Up (+1)' },
  { value: 'octaveDown', label: 'Octave Down (−1)' },
  { value: 'presetNext', label: 'Next Sound Preset' },
  { value: 'presetPrev', label: 'Previous Sound Preset' },
  { value: 'panic', label: 'Panic (Silence All Voices)' },
  { value: 'metronomeToggle', label: 'Toggle Metronome' },
];

export function ActionsTab({ player }: ActionsTabProps) {
  const playerConfig = useConfigStore((state) => state.players[player]);
  const setPlayer = useConfigStore((state) => state.setPlayer);

  const handleActionChange = (btn: LogicalButton, action: GlobalAction): void => {
    setPlayer(player, (p) => ({
      actions: {
        ...p.actions,
        [btn]: action,
      },
    }));
  };

  return (
    <div className="flex flex-col gap-6" data-testid="actions-tab">
      <div
        className="
          flex flex-col gap-3 rounded-panel border border-line/50 bg-panel/60
          p-4
        "
      >
        <div>
          <h3 className="text-sm font-bold text-text">Auxiliary Hardware Action Buttons</h3>
          <p className="text-xs text-muted">
            Map controller system buttons to workstation transport and performance controls
          </p>
        </div>

        <div className="flex flex-col gap-2 pbs-2">
          {ACTION_BUTTONS.map((btn) => {
            const currentAction = playerConfig.actions[btn.id] ?? 'none';
            return (
              <div
                key={btn.id}
                className="
                  flex items-center justify-between rounded-field border
                  border-line/40 bg-field px-4 py-2 block-10
                "
              >
                <span className="text-xs font-semibold text-text">{btn.label}</span>
                <select
                  value={currentAction}
                  onChange={(e) => handleActionChange(btn.id, e.target.value as GlobalAction)}
                  className="
                    rounded-field border border-line/60 bg-bg px-3 py-1
                    font-mono text-xs text-text outline-none block-8 inline-64
                    focus:border-accent
                  "
                >
                  {GLOBAL_ACTION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
