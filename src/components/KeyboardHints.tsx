import React, { useEffect, useRef } from 'react';
import { Sliders, X } from 'lucide-react';

import { resolveNote } from '@/core/mapping';
import { midiToNoteName } from '@/core/notes';
import type { NoteButton } from '@/core/types';
import { getFriendlyKeyLabel } from '@/input/keyLabels';
import { useConfigStore } from '@/state/configStore';
import { useUIStore } from '@/state/uiStore';

void React;

interface KeyCapProps {
  keyCode: string;
  label: string;
  subText: string;
}

function KeyCap({ keyCode, label, subText }: KeyCapProps) {
  const capRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!keyCode) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.code === keyCode) {
        capRef.current?.setAttribute('data-active', 'true');
      }
    };
    const handleKeyUp = (e: KeyboardEvent): void => {
      if (e.code === keyCode) {
        capRef.current?.setAttribute('data-active', 'false');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyCode]);

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        ref={capRef}
        data-active="false"
        className="
          flex items-center justify-center rounded-field border border-line/60
          bg-field px-1.5 py-0.5 font-mono text-[11px] font-bold text-text
          shadow-xs transition-colors duration-75 block-6 inline-7
          data-[active=true]:border-accent data-[active=true]:bg-accent
          data-[active=true]:text-[#1f1f1f]
        "
      >
        {label}
      </div>
      <span className="font-mono text-[10px] text-muted">{subText}</span>
    </div>
  );
}

export function KeyboardHints() {
  const showHints = useConfigStore((state) => state.settings.keyboard.showHints);
  const keyboardEnabled = useConfigStore((state) => state.settings.keyboard.enabled);
  const keyMap = useConfigStore((state) => state.settings.keyboard.keyMap);
  const activePlayer = useConfigStore((state) => state.settings.activePlayer);
  const playerConfig = useConfigStore((state) => state.players[activePlayer]);
  const setSettings = useConfigStore((state) => state.setSettings);

  const setActiveTab = useUIStore((state) => state.setActiveTab);

  if (!showHints || !keyboardEnabled) {
    return null;
  }

  const noteButtons: NoteButton[] = [
    'dpadUp',
    'dpadLeft',
    'dpadDown',
    'dpadRight',
    'north',
    'west',
    'south',
    'east',
    'l1',
    'r1',
  ];

  const handleHide = (): void => {
    setSettings((prev) => ({
      keyboard: { ...prev.keyboard, showHints: false },
    }));
  };

  return (
    <div
      className="
        relative flex flex-wrap items-center justify-between border-bs
        border-line/60 bg-panel/90 px-4 py-2.5 text-xs text-text
      "
      data-testid="keyboard-hints"
    >
      {/* 10 Performance Notes */}
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[11px] text-muted">
          Notes → <strong className="text-accent">{playerConfig.name}</strong>
        </span>
        <div className="flex items-center gap-1.5">
          {noteButtons.map((btn) => {
            const code = keyMap[btn];
            const resolvedMidi = resolveNote(btn, playerConfig);
            const noteName = resolvedMidi !== null ? midiToNoteName(resolvedMidi) : 'C1';
            return (
              <KeyCap
                key={btn}
                keyCode={code}
                label={code ? getFriendlyKeyLabel(code) : '-'}
                subText={noteName}
              />
            );
          })}
        </div>
      </div>

      {/* Control Actions: Octave, Expression, Transport */}
      <div className="flex items-center gap-4">
        {/* Octave */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] text-muted">Octave</span>
          <div className="flex items-center gap-1">
            <KeyCap
              keyCode={keyMap.octaveDown}
              label={getFriendlyKeyLabel(keyMap.octaveDown)}
              subText="−"
            />
            <KeyCap
              keyCode={keyMap.octaveUp}
              label={getFriendlyKeyLabel(keyMap.octaveUp)}
              subText="+"
            />
          </div>
        </div>

        {/* Bend */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] text-muted">Pitch Bend</span>
          <div className="flex items-center gap-1">
            <KeyCap
              keyCode={keyMap.bendDown}
              label={getFriendlyKeyLabel(keyMap.bendDown)}
              subText="↓"
            />
            <KeyCap
              keyCode={keyMap.bendUp}
              label={getFriendlyKeyLabel(keyMap.bendUp)}
              subText="↑"
            />
          </div>
        </div>

        {/* Hold Mod */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] text-muted">Hold</span>
          <div className="flex items-center gap-1">
            <KeyCap
              keyCode={keyMap.vibrato}
              label={getFriendlyKeyLabel(keyMap.vibrato)}
              subText="vib"
            />
            <KeyCap
              keyCode={keyMap.filterClose}
              label={getFriendlyKeyLabel(keyMap.filterClose)}
              subText="filt"
            />
          </div>
        </div>

        {/* Panic / Quick Help */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] text-muted">Global</span>
          <div className="flex items-center gap-1">
            <KeyCap
              keyCode={keyMap.panic}
              label={getFriendlyKeyLabel(keyMap.panic)}
              subText="panic"
            />
          </div>
        </div>
      </div>

      {/* Action links & Dismiss button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('mappings')}
          className="
            flex items-center gap-1 rounded-field border border-line/50 bg-field
            px-2 py-1 text-[11px] text-muted
            hover:border-line hover:text-text
          "
        >
          <Sliders className="block-3 inline-3" />
          <span>Edit keys</span>
        </button>
        <button
          type="button"
          onClick={handleHide}
          title="Hide keyboard hints [/]"
          className="
            rounded-field p-1 text-muted
            hover:bg-field hover:text-text
          "
        >
          <X className="block-4 inline-4" />
        </button>
      </div>
    </div>
  );
}
