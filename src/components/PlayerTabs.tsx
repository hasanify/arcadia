import React from 'react';
import { ChevronRight, Music, Sliders } from 'lucide-react';

import type { PlayerId } from '@/core/types';
import { useConfigStore } from '@/state/configStore';
import { useUIStore } from '@/state/uiStore';

void React;

const PLAYER_COLORS: Record<PlayerId, string> = {
  0: '#4da3ff',
  1: '#ff5a5a',
  2: '#4dff88',
  3: '#ff4dd2',
};

export function PlayerTabs() {
  const activePlayer = useConfigStore((state) => state.settings.activePlayer);
  const setActivePlayer = useConfigStore((state) => state.setActivePlayer);
  const players = useConfigStore((state) => state.players);

  const activeTab = useUIStore((state) => state.activeTab);
  const setActiveTab = useUIStore((state) => state.setActiveTab);

  return (
    <div
      className="
        flex items-center justify-between border-be border-line/60 bg-panel/80
        px-4 py-2 block-12
      "
    >
      {/* P1-P4 Tabs */}
      <div className="flex items-center gap-1.5">
        {(players.map((_, idx) => idx as PlayerId) as PlayerId[]).map((pId) => {
          const isActive = activePlayer === pId;
          const playerConfig = players[pId];
          const playerColor = PLAYER_COLORS[pId];

          return (
            <button
              key={pId}
              type="button"
              onClick={() => setActivePlayer(pId)}
              className={`
                flex items-center gap-2 rounded-field border px-3 py-1.5 text-xs
                font-bold transition-all
                ${
                  isActive
                    ? 'border-accent bg-accent text-[#1f1f1f] shadow-sm'
                    : `
                      border-line/40 bg-field/60 text-muted
                      hover:border-line hover:bg-field hover:text-text
                    `
                }
              `}
            >
              <span
                className="rounded-full block-2 inline-2"
                style={{
                  backgroundColor: playerConfig.enabled ? playerColor : '#6b6b6b',
                }}
              />
              <span>{playerConfig.name}</span>
            </button>
          );
        })}
      </div>

      {/* Navigation Buttons: Mappings › and Sounds › */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === 'mappings' ? 'perform' : 'mappings')}
          className={`
            flex items-center gap-1.5 rounded-field border px-2.5 py-1 text-xs
            font-semibold transition-colors
            ${
              activeTab === 'mappings'
                ? 'border-accent bg-accent/20 text-accent'
                : `
                  border-line/50 bg-field text-text
                  hover:bg-field-hover
                `
            }
          `}
        >
          <Sliders className="block-3.5 inline-3.5" />
          <span>Mappings</span>
          <ChevronRight className="block-3.5 inline-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab(activeTab === 'sound' ? 'perform' : 'sound')}
          className={`
            flex items-center gap-1.5 rounded-field border px-2.5 py-1 text-xs
            font-semibold transition-colors
            ${
              activeTab === 'sound'
                ? 'border-accent bg-accent/20 text-accent'
                : `
                  border-line/50 bg-field text-text
                  hover:bg-field-hover
                `
            }
          `}
        >
          <Music className="block-3.5 inline-3.5" />
          <span>Sounds</span>
          <ChevronRight className="block-3.5 inline-3.5" />
        </button>
      </div>
    </div>
  );
}
