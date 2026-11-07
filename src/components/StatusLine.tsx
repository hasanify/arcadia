import React, { useEffect, useState } from 'react';
import { Keyboard } from 'lucide-react';

import type { PlayerId } from '@/core/types';
import { liveState } from '@/input/liveState';
import { useConfigStore } from '@/state/configStore';
import { useUIStore } from '@/state/uiStore';

void React;

interface StatusLineProps {
  player: PlayerId;
}

export function StatusLine({ player }: StatusLineProps) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const isAudioStarted = useUIStore((state) => state.isAudioStarted);
  const keyboardEnabled = useConfigStore((state) => state.settings.keyboard.enabled);
  const playerConfig = useConfigStore((state) => state.players[player]);

  useEffect(() => {
    const unsubscribe = liveState.subscribe(player, (p) => {
      setIsConnected(p.connected);
    });

    return () => {
      unsubscribe();
    };
  }, [player]);

  const hasPad = isConnected;
  const inputActive = hasPad || keyboardEnabled;
  const motionActive = Boolean(playerConfig?.hid?.motionEnabled);

  return (
    <footer
      className="
        flex items-center justify-between border-bs border-line/60 bg-panel px-4
        font-mono text-[11px] text-muted block-7
      "
      data-testid="status-line"
    >
      {/* Device and input state */}
      <div className="flex items-center gap-2">
        <span
          className={`
            inline-block rounded-full block-2 inline-2
            ${hasPad ? 'bg-accent' : 'bg-muted/40'}
          `}
        />
        <div className="flex items-center gap-1.5">
          {hasPad && (
            <span className="font-semibold text-text">{playerConfig.name} Controller</span>
          )}
          {hasPad && keyboardEnabled && <span className="text-muted/60">+</span>}
          {keyboardEnabled && (
            <span className="flex items-center gap-1">
              <Keyboard className="block-3 inline-3" />
              <span>Keyboard</span>
            </span>
          )}
          {!hasPad && !keyboardEnabled && <span>No Input Device</span>}
          <span className="text-muted/60">·</span>
          <span>{inputActive ? 'Input Active' : 'Input Standby'}</span>
          <span className="text-muted/60">·</span>
          <span>{motionActive ? 'Motion On' : 'Motion Off'}</span>
        </div>
      </div>

      {/* Engine & version */}
      <div className="flex items-center gap-3">
        <span>Engine {isAudioStarted ? 'Active' : 'Locked'}</span>
        <span className="text-muted/60">·</span>
        <span>v0.1.0</span>
      </div>
    </footer>
  );
}
