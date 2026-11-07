import React from 'react';
import { Circle, Keyboard, Moon, Play, RotateCcw, Square, Sun } from 'lucide-react';

import { useConfigStore } from '@/state/configStore';
import { useUIStore } from '@/state/uiStore';
import { AudioGate } from '@/components/AudioGate';
import { LevelMeter } from '@/components/LevelMeter';

void React;

export function TopBar() {
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);

  const activePlayer = useConfigStore((state) => state.settings.activePlayer);
  const resetPlayer = useConfigStore((state) => state.resetPlayer);
  const bpm = useConfigStore((state) => state.settings.metronome.bpm);
  const metronomeEnabled = useConfigStore((state) => state.settings.metronome.enabled);
  const setSettings = useConfigStore((state) => state.setSettings);
  const showHints = useConfigStore((state) => state.settings.keyboard.showHints);

  const handleResetCurrentPlayer = (): void => {
    if (window.confirm(`Reset P${activePlayer + 1} parameters to factory defaults?`)) {
      resetPlayer(activePlayer);
    }
  };

  const handleToggleHints = (): void => {
    setSettings((prev) => ({
      keyboard: { ...prev.keyboard, showHints: !prev.keyboard.showHints },
    }));
  };

  const handleToggleMetronome = (): void => {
    setSettings((prev) => ({
      metronome: { ...prev.metronome, enabled: !prev.metronome.enabled },
    }));
  };

  return (
    <header
      className="
        flex items-center justify-between border-be border-line/60 bg-panel px-4
        block-12
      "
      data-testid="top-bar"
    >
      {/* Brand title and logo */}
      <div className="flex items-center gap-3">
        <img
          src="/logo-64.webp"
          alt="Arcadia Logo"
          width={28}
          height={28}
          className="object-contain block-7 inline-auto"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-tight text-text">Arcadia</span>
          <span
            className="
            rounded-field border border-line/50 bg-field/80 px-1.5 py-0.5
            font-mono text-[10px] text-muted
          "
          >
            STUDIO
          </span>
        </div>
      </div>

      {/* Central Transport & Metronome Controls */}
      <div className="flex items-center gap-3">
        {/* Transport Placeholders */}
        <div
          className="
          flex items-center gap-1 rounded-field border border-line/50 bg-field
          p-1
        "
        >
          <button
            type="button"
            className="
              flex items-center justify-center rounded-[2px] p-1.5 text-muted
              transition-colors
              hover:bg-panel hover:text-rec
            "
            title="Record Take"
          >
            <Circle className="fill-current block-3.5 inline-3.5" />
          </button>
          <button
            type="button"
            className="
              flex items-center justify-center rounded-[2px] p-1.5 text-muted
              transition-colors
              hover:bg-panel hover:text-accent
            "
            title="Replay Last Take"
          >
            <Play className="fill-current block-3.5 inline-3.5" />
          </button>
          <button
            type="button"
            className="
              flex items-center justify-center rounded-[2px] p-1.5 text-muted
              transition-colors
              hover:bg-panel hover:text-text
            "
            title="Stop Playback"
          >
            <Square className="fill-current block-3.5 inline-3.5" />
          </button>
        </div>

        {/* BPM & Metronome */}
        <button
          type="button"
          onClick={handleToggleMetronome}
          className={`
            flex items-center gap-1.5 rounded-field border px-2.5 py-1 font-mono
            text-xs font-semibold transition-colors
            ${
              metronomeEnabled
                ? 'border-accent bg-accent/20 text-accent'
                : `
                  border-line/40 bg-field text-muted
                  hover:border-line hover:text-text
                `
            }
          `}
          title="Toggle Metronome"
        >
          <span>BPM</span>
          <span className="text-text">{bpm}</span>
        </button>

        {/* Master Stereo VU Meter */}
        <LevelMeter />
      </div>

      {/* Right Controls: AudioGate, Reset, Hints, Theme */}
      <div className="flex items-center gap-2">
        <AudioGate />

        {/* Reset Player */}
        <button
          type="button"
          onClick={handleResetCurrentPlayer}
          className="
            flex items-center justify-center rounded-field border border-line/50
            bg-field p-1.5 text-muted transition-colors block-8 inline-8
            hover:border-line hover:bg-field-hover hover:text-text
          "
          title="Reset Active Player to Defaults"
        >
          <RotateCcw className="block-4 inline-4" />
        </button>

        {/* Keyboard Hints Toggle */}
        <button
          type="button"
          onClick={handleToggleHints}
          className={`
            flex items-center justify-center rounded-field border p-1.5
            transition-colors block-8 inline-8
            ${
              showHints
                ? 'border-accent bg-accent/20 text-accent'
                : `
                  border-line/50 bg-field text-muted
                  hover:border-line hover:text-text
                `
            }
          `}
          title={`Keyboard Hints ${showHints ? 'Enabled' : 'Disabled'}`}
        >
          <Keyboard className="block-4 inline-4" />
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="
            flex items-center gap-1.5 rounded-field border border-line/50
            bg-field px-2.5 py-1 text-xs font-medium text-text transition-colors
            block-8
            hover:bg-field-hover
          "
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="text-accent block-3.5 inline-3.5" />
          ) : (
            <Moon className="text-accent block-3.5 inline-3.5" />
          )}
          <span className="font-mono text-[11px] uppercase">{theme}</span>
        </button>
      </div>
    </header>
  );
}
