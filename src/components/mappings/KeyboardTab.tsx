import React, { useEffect, useState } from 'react';
import { Keyboard, RotateCcw } from 'lucide-react';

import { DEFAULT_KEY_MAP } from '@/core/constants';
import type { KeyAction } from '@/core/types';
import { getFriendlyKeyLabel } from '@/input/keyLabels';
import { useConfigStore } from '@/state/configStore';

void React;

const KEY_ACTION_LABELS: { action: KeyAction; label: string; group: string }[] = [
  { action: 'dpadUp', label: 'Pad 1 (D-Pad Up)', group: 'Pads' },
  { action: 'dpadLeft', label: 'Pad 2 (D-Pad Left)', group: 'Pads' },
  { action: 'dpadDown', label: 'Pad 3 (D-Pad Down)', group: 'Pads' },
  { action: 'dpadRight', label: 'Pad 4 (D-Pad Right)', group: 'Pads' },
  { action: 'north', label: 'Pad 5 (North / △)', group: 'Pads' },
  { action: 'west', label: 'Pad 6 (West / □)', group: 'Pads' },
  { action: 'south', label: 'Pad 7 (South / ✕)', group: 'Pads' },
  { action: 'east', label: 'Pad 8 (East / ○)', group: 'Pads' },
  { action: 'l1', label: 'Pad 9 (L1 Bumper)', group: 'Pads' },
  { action: 'r1', label: 'Pad 10 (R1 Bumper)', group: 'Pads' },
  { action: 'octaveDown', label: 'Octave Down (−1)', group: 'Controls' },
  { action: 'octaveUp', label: 'Octave Up (+1)', group: 'Controls' },
  { action: 'bendDown', label: 'Pitch Bend Down', group: 'Controls' },
  { action: 'bendUp', label: 'Pitch Bend Up', group: 'Controls' },
  { action: 'vibrato', label: 'Hold: Vibrato Depth', group: 'Controls' },
  { action: 'filterClose', label: 'Hold: Filter Sweep', group: 'Controls' },
  { action: 'recordToggle', label: 'Toggle Recording', group: 'Transport' },
  { action: 'replayToggle', label: 'Toggle Replay', group: 'Transport' },
  { action: 'panic', label: 'Panic (Silence)', group: 'Global' },
  { action: 'toggleHints', label: 'Toggle Key Hints', group: 'Global' },
];

export function KeyboardTab() {
  const keyboard = useConfigStore((state) => state.settings.keyboard);
  const setSettings = useConfigStore((state) => state.setSettings);

  const [rebindingAction, setRebindingAction] = useState<KeyAction | null>(null);

  useEffect(() => {
    if (!rebindingAction) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      e.preventDefault();
      if (e.key === 'Escape') {
        setRebindingAction(null);
        return;
      }

      setSettings((prev) => ({
        keyboard: {
          ...prev.keyboard,
          keyMap: {
            ...prev.keyboard.keyMap,
            [rebindingAction]: e.code,
          },
        },
      }));
      setRebindingAction(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [rebindingAction, setSettings]);

  const handleResetDefaults = (): void => {
    setSettings((prev) => ({
      keyboard: {
        ...prev.keyboard,
        keyMap: { ...DEFAULT_KEY_MAP },
      },
    }));
  };

  return (
    <div className="flex flex-col gap-6" data-testid="keyboard-tab">
      {/* Global Configuration */}
      <div
        className="
        flex flex-col gap-4 rounded-panel border border-line/50 bg-panel/60 p-4
      "
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="text-accent block-5 inline-5" />
            <div>
              <h3 className="text-sm font-bold text-text">Computer Keyboard Input</h3>
              <p className="text-xs text-muted">
                Play notes and trigger actions from your physical keyboard
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="
              flex items-center gap-1.5 rounded-field border border-line
              bg-field px-3 py-1.5 text-xs font-semibold text-text
              transition-colors
              hover:bg-field-hover
            "
          >
            <RotateCcw className="block-3.5 inline-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div
          className="
          grid grid-cols-1 gap-4 pbs-2
          md:grid-cols-3
        "
        >
          {/* Enable Toggle */}
          <div
            className="
            flex items-center justify-between rounded-field border
            border-line/40 bg-field p-3
          "
          >
            <div>
              <label className="text-xs font-semibold text-text">Keyboard Mode</label>
              <p className="text-[11px] text-muted">Accept typing triggers</p>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings((p) => ({
                  keyboard: { ...p.keyboard, enabled: !p.keyboard.enabled },
                }))
              }
              className={`
                rounded-field border px-3 py-1 text-xs font-semibold
                transition-colors
                ${
                  keyboard.enabled
                    ? 'border-accent bg-accent/20 text-accent'
                    : 'border-line/40 bg-bg text-muted'
                }
              `}
            >
              {keyboard.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Target Player */}
          <div
            className="
            flex flex-col gap-1.5 rounded-field border border-line/40 bg-field
            p-3
          "
          >
            <label className="text-xs font-semibold text-text">Target Player</label>
            <select
              value={keyboard.target}
              onChange={(e) => {
                const targetVal =
                  e.target.value === 'active'
                    ? 'active'
                    : (Number(e.target.value) as 0 | 1 | 2 | 3);
                setSettings((p) => ({
                  keyboard: {
                    ...p.keyboard,
                    target: targetVal,
                  },
                }));
              }}
              className="
                rounded-field border border-line/60 bg-bg px-2.5 py-1 text-xs
                text-text outline-none block-8
                focus:border-accent
              "
            >
              <option value="active">Active Selected Tab</option>
              <option value="0">Lock to Player 1</option>
              <option value="1">Lock to Player 2</option>
              <option value="2">Lock to Player 3</option>
              <option value="3">Lock to Player 4</option>
            </select>
          </div>

          {/* Show Hints Switch */}
          <div
            className="
            flex items-center justify-between rounded-field border
            border-line/40 bg-field p-3
          "
          >
            <div>
              <label className="text-xs font-semibold text-text">On-Screen Keycaps</label>
              <p className="text-[11px] text-muted">Show key hints strip</p>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings((p) => ({
                  keyboard: { ...p.keyboard, showHints: !p.keyboard.showHints },
                }))
              }
              className={`
                rounded-field border px-3 py-1 text-xs font-semibold
                transition-colors
                ${
                  keyboard.showHints
                    ? 'border-accent bg-accent/20 text-accent'
                    : 'border-line/40 bg-bg text-muted'
                }
              `}
            >
              {keyboard.showHints ? 'Visible' : 'Hidden'}
            </button>
          </div>
        </div>
      </div>

      {/* Rebind Key Matrix Table */}
      <div
        className="
        flex flex-col gap-3 rounded-panel border border-line/50 bg-panel/60 p-4
      "
      >
        <label className="text-xs font-bold tracking-wider text-muted uppercase">
          Keybindings Configuration
        </label>
        <div
          className="
          grid grid-cols-1 gap-2
          sm:grid-cols-2
        "
        >
          {KEY_ACTION_LABELS.map((item) => {
            const boundCode = keyboard.keyMap[item.action];
            const isRebinding = rebindingAction === item.action;
            const label = boundCode ? getFriendlyKeyLabel(boundCode) : 'None';

            return (
              <div
                key={item.action}
                className="
                  flex items-center justify-between rounded-field border
                  border-line/40 bg-field px-3 py-2 block-10
                "
              >
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-text">{item.label}</span>
                  <span className="font-mono text-[10px] text-muted">{item.group}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRebindingAction(item.action)}
                  className={`
                    rounded-field border px-2.5 py-1 font-mono text-xs font-bold
                    transition-all min-inline-18
                    ${
                      isRebinding
                        ? 'animate-pulse border-accent bg-accent text-[#1f1f1f]'
                        : `
                          border-line/60 bg-bg text-text
                          hover:border-line hover:bg-field-hover
                        `
                    }
                  `}
                >
                  {isRebinding ? 'Press Key...' : label}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
