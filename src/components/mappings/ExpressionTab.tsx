import React from 'react';

import type { ExprSource, ExprTarget, PlayerId } from '@/core/types';
import { useConfigStore } from '@/state/configStore';

void React;

interface ExpressionTabProps {
  player: PlayerId;
}

const EXPR_SOURCES: { id: ExprSource; label: string }[] = [
  { id: 'l2', label: 'L2 Analog Trigger' },
  { id: 'r2', label: 'R2 Analog Trigger' },
  { id: 'leftX', label: 'Left Stick X (Horizontal)' },
  { id: 'leftY', label: 'Left Stick Y (Vertical)' },
  { id: 'rightX', label: 'Right Stick X (Horizontal)' },
  { id: 'rightY', label: 'Right Stick Y (Vertical)' },
  { id: 'tiltX', label: 'Motion Tilt X (WebHID)' },
  { id: 'tiltY', label: 'Motion Tilt Y (WebHID)' },
];

const TARGET_OPTIONS: { value: ExprTarget; label: string }[] = [
  { value: 'none', label: 'None (Unassigned)' },
  { value: 'pitchBend', label: 'Pitch Bend' },
  { value: 'filterCutoff', label: 'Filter Cutoff Sweep' },
  { value: 'vibratoDepth', label: 'Vibrato Depth' },
  { value: 'volume', label: 'Voice Volume' },
  { value: 'pan', label: 'Stereo Pan' },
  { value: 'reverbSend', label: 'Reverb FX Send' },
  { value: 'delaySend', label: 'Delay FX Send' },
  { value: 'macro1', label: 'Macro 1' },
  { value: 'macro2', label: 'Macro 2' },
  { value: 'macro3', label: 'Macro 3' },
  { value: 'macro4', label: 'Macro 4' },
];

export function ExpressionTab({ player }: ExpressionTabProps) {
  const playerConfig = useConfigStore((state) => state.players[player]);
  const setPlayer = useConfigStore((state) => state.setPlayer);

  const handleTargetChange = (source: ExprSource, target: ExprTarget): void => {
    setPlayer(player, (prev) => ({
      expression: {
        ...prev.expression,
        [source]: {
          ...prev.expression[source],
          target,
        },
      },
    }));
  };

  const handleAmountChange = (source: ExprSource, amount: number): void => {
    setPlayer(player, (prev) => ({
      expression: {
        ...prev.expression,
        [source]: {
          ...prev.expression[source],
          amount,
        },
      },
    }));
  };

  const handleInvertChange = (source: ExprSource, invert: boolean): void => {
    setPlayer(player, (prev) => ({
      expression: {
        ...prev.expression,
        [source]: {
          ...prev.expression[source],
          invert,
        },
      },
    }));
  };

  return (
    <div className="flex flex-col gap-6" data-testid="expression-tab">
      {/* Bend Range Config */}
      <div
        className="
          flex items-center justify-between rounded-panel border border-line/50
          bg-panel/60 p-4
        "
      >
        <div>
          <h3 className="text-sm font-bold text-text">Pitch Bend Range</h3>
          <p className="text-xs text-muted">Maximum bend semitones for analog pitch controls</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={playerConfig.bendRangeSemitones}
            onChange={(e) => setPlayer(player, { bendRangeSemitones: Number(e.target.value) })}
            className="
              rounded-field border border-line/60 bg-field px-3 py-1.5 font-mono
              text-xs font-bold text-text outline-none block-8 inline-24
              focus:border-accent
            "
          >
            {[1, 2, 3, 4, 5, 7, 12, 24].map((st) => (
              <option key={st} value={st}>
                ±{st} Semitones
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 8-Source Expression Routing Matrix */}
      <div
        className="
          flex flex-col gap-3 rounded-panel border border-line/50 bg-panel/60
          p-4
        "
      >
        <label className="text-xs font-bold tracking-wider text-muted uppercase">
          Analog Expression Routing Matrix
        </label>
        <div className="flex flex-col gap-2">
          {EXPR_SOURCES.map((src) => {
            const binding = playerConfig.expression[src.id];
            return (
              <div
                key={src.id}
                className="
                  flex flex-col items-start justify-between gap-3 rounded-field
                  border border-line/40 bg-field p-3
                  md:flex-row md:items-center
                "
              >
                {/* Source Label */}
                <div className="inline-48">
                  <span className="text-xs font-semibold text-text">{src.label}</span>
                </div>

                {/* Destination Dropdown */}
                <div className="inline-56">
                  <select
                    value={binding.target}
                    onChange={(e) => handleTargetChange(src.id, e.target.value as ExprTarget)}
                    className="
                      rounded-field border border-line/60 bg-bg px-2.5 py-1
                      text-xs text-text outline-none block-8 inline-full
                      focus:border-accent
                    "
                  >
                    {TARGET_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Depth Slider */}
                <div className="flex flex-1 items-center gap-2 inline-full">
                  <span className="font-mono text-[11px] text-muted inline-10">
                    {Math.round(binding.amount * 100)}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={binding.amount}
                    onChange={(e) => handleAmountChange(src.id, Number(e.target.value))}
                    className="flex-1 accent-accent"
                  />
                </div>

                {/* Invert Button */}
                <button
                  type="button"
                  onClick={() => handleInvertChange(src.id, !binding.invert)}
                  className={`
                    rounded-field border px-2.5 py-1 text-[11px] font-semibold
                    transition-colors block-8
                    ${
                      binding.invert
                        ? 'border-accent bg-accent/20 text-accent'
                        : `
                          border-line/40 bg-bg text-muted
                          hover:text-text
                        `
                    }
                  `}
                >
                  {binding.invert ? 'Inverted' : 'Normal'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
