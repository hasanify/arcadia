import React, { useEffect } from 'react';

import { performanceController } from '@/engine/performanceController';
import { useConfigStore } from '@/state/configStore';
import { ControllerView } from '@/components/ControllerView';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { KeyboardHints } from '@/components/KeyboardHints';
import { NoteColumn } from '@/components/NoteColumn';
import { PlayerTabs } from '@/components/PlayerTabs';
import { StatusLine } from '@/components/StatusLine';
import { TopBar } from '@/components/TopBar';

void React;

export function AppShell() {
  const activePlayer = useConfigStore((state) => state.settings.activePlayer);

  useEffect(() => {
    void performanceController.start();
    return () => {
      performanceController.stop();
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex flex-col bg-bg text-text min-block-screen">
        {/* Studio Hardware Header */}
        <TopBar />

        {/* Player Tabs Strip */}
        <PlayerTabs />

        {/* Central Performance Workspace */}
        <main
          className="
            flex flex-1 items-center justify-center p-4
            md:p-8
          "
        >
          <div
            className="
              flex flex-col items-center justify-between gap-6 inline-full
              max-inline-6xl
              lg:flex-row lg:items-center
            "
          >
            {/* Left 5 Note Pads */}
            <NoteColumn player={activePlayer} side="left" />

            {/* Central Interactive Controller Visualizer */}
            <div className="flex flex-1 items-center justify-center">
              <ControllerView player={activePlayer} />
            </div>

            {/* Right 5 Note Pads */}
            <NoteColumn player={activePlayer} side="right" />
          </div>
        </main>

        {/* Togglable On-Screen Keyboard Hints */}
        <KeyboardHints />

        {/* Hardware Status Line */}
        <StatusLine player={activePlayer} />
      </div>
    </ErrorBoundary>
  );
}
