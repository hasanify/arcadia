import React from 'react';
import { Gamepad, Wrench } from 'lucide-react';

import type { PlayerId } from '@/core/types';
import { useConfigStore } from '@/state/configStore';

void React;

interface ControllerTabProps {
  player: PlayerId;
  onOpenRemapWizard?: () => void;
}

export function ControllerTab({ player, onOpenRemapWizard }: ControllerTabProps) {
  const playerConfig = useConfigStore((state) => state.players[player]);
  const setPlayer = useConfigStore((state) => state.setPlayer);

  return (
    <div className="flex flex-col gap-6" data-testid="controller-tab">
      {/* Pad Assignment & Wizard */}
      <div
        className="
          flex flex-col gap-3 rounded-panel border border-line/50 bg-panel/60
          p-4
        "
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad className="text-accent block-5 inline-5" />
            <div>
              <h3 className="text-sm font-bold text-text">Gamepad Assignment</h3>
              <p className="text-xs text-muted">
                Assign a physical controller or allow auto-detection on first button strike
              </p>
            </div>
          </div>
          {onOpenRemapWizard && (
            <button
              type="button"
              onClick={onOpenRemapWizard}
              className="
                flex items-center gap-1.5 rounded-field border border-line
                bg-field px-3 py-1.5 text-xs font-semibold text-text
                transition-colors
                hover:bg-field-hover
              "
            >
              <Wrench className="block-3.5 inline-3.5" />
              <span>Remap Wizard</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setPlayer(player, (p) => ({
                pad: { ...p.pad, mode: 'auto' },
              }))
            }
            className={`
              flex-1 rounded-field border py-2 text-xs font-semibold
              transition-colors
              ${
                playerConfig.pad.mode === 'auto'
                  ? 'border-accent bg-accent text-[#1f1f1f]'
                  : `
                    border-line/40 bg-field text-text
                    hover:bg-field-hover
                  `
              }
            `}
          >
            Auto Assign (First Pad Available)
          </button>
          <button
            type="button"
            onClick={() =>
              setPlayer(player, (p) => ({
                pad: { ...p.pad, mode: 'manual' },
              }))
            }
            className={`
              flex-1 rounded-field border py-2 text-xs font-semibold
              transition-colors
              ${
                playerConfig.pad.mode === 'manual'
                  ? 'border-accent bg-accent text-[#1f1f1f]'
                  : `
                    border-line/40 bg-field text-text
                    hover:bg-field-hover
                  `
              }
            `}
          >
            Manual Slot Lock
          </button>
        </div>
      </div>

      {/* Deadzones & Shaping */}
      <div
        className="
          grid grid-cols-1 gap-4 rounded-panel border border-line/50 bg-panel/60
          p-4
          md:grid-cols-2
        "
      >
        {/* Stick Deadzone */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted">Analog Stick Deadzone</label>
            <span className="font-mono text-xs font-bold text-accent">
              {Math.round(playerConfig.controller.stickDeadzone * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="0.4"
            step="0.01"
            value={playerConfig.controller.stickDeadzone}
            onChange={(e) =>
              setPlayer(player, (p) => ({
                controller: {
                  ...p.controller,
                  stickDeadzone: Number(e.target.value),
                },
              }))
            }
            className="accent-accent"
          />
        </div>

        {/* Trigger Deadzone */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted">L2 / R2 Trigger Deadzone</label>
            <span className="font-mono text-xs font-bold text-accent">
              {Math.round(playerConfig.controller.triggerDeadzone * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="0.2"
            step="0.01"
            value={playerConfig.controller.triggerDeadzone}
            onChange={(e) =>
              setPlayer(player, (p) => ({
                controller: {
                  ...p.controller,
                  triggerDeadzone: Number(e.target.value),
                },
              }))
            }
            className="accent-accent"
          />
        </div>

        {/* Curve Type */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted">Response Curve</label>
          <select
            value={playerConfig.controller.curve}
            onChange={(e) =>
              setPlayer(player, (p) => ({
                controller: {
                  ...p.controller,
                  curve: e.target.value as 'linear' | 'expo' | 'log',
                },
              }))
            }
            className="
              rounded-field border border-line/60 bg-field px-3 py-1.5 text-xs
              text-text outline-none block-8
              focus:border-accent
            "
          >
            <option value="linear">Linear (1:1 direct tracking)</option>
            <option value="expo">Exponential (fine control near center)</option>
            <option value="log">Logarithmic (quick response)</option>
          </select>
        </div>

        {/* Invert Y Axis */}
        <div className="flex items-center justify-between py-2">
          <div>
            <label className="text-xs font-medium text-text">Invert Y Axis</label>
            <p className="text-[11px] text-muted">Pushing stick UP increases pitch/filter</p>
          </div>
          <button
            type="button"
            onClick={() =>
              setPlayer(player, (p) => ({
                controller: {
                  ...p.controller,
                  invertY: !p.controller.invertY,
                },
              }))
            }
            className={`
              rounded-field border px-3 py-1 text-xs font-semibold
              transition-colors
              ${
                playerConfig.controller.invertY
                  ? 'border-accent bg-accent/20 text-accent'
                  : 'border-line/40 bg-field text-muted'
              }
            `}
          >
            {playerConfig.controller.invertY ? 'Inverted' : 'Standard'}
          </button>
        </div>
      </div>

      {/* Rumble Haptics */}
      <div
        className="
          flex flex-col gap-3 rounded-panel border border-line/50 bg-panel/60
          p-4
        "
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-text">Haptic Vibration Feedback</h3>
            <p className="text-xs text-muted">
              Tactile pulse on trigger actuation and note strikes
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setPlayer(player, (p) => ({
                rumble: {
                  ...p.rumble,
                  enabled: !p.rumble.enabled,
                },
              }))
            }
            className={`
              rounded-field border px-3 py-1 text-xs font-semibold
              transition-colors
              ${
                playerConfig.rumble.enabled
                  ? 'border-accent bg-accent/20 text-accent'
                  : 'border-line/40 bg-field text-muted'
              }
            `}
          >
            {playerConfig.rumble.enabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {playerConfig.rumble.enabled && (
          <div className="flex items-center gap-3 pbs-2">
            <span className="text-xs text-muted">Intensity</span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={playerConfig.rumble.intensity}
              onChange={(e) =>
                setPlayer(player, (p) => ({
                  rumble: {
                    ...p.rumble,
                    intensity: Number(e.target.value),
                  },
                }))
              }
              className="flex-1 accent-accent"
            />
            <span className="font-mono text-xs font-bold text-accent">
              {Math.round(playerConfig.rumble.intensity * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
