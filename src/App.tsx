import React from 'react';
import { Moon, Sun } from 'lucide-react';

import { useUIStore } from '@/state/uiStore';

void React;

export function App() {
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);

  return (
    <div className="flex flex-col bg-bg text-text min-block-screen">
      {/* Hardware Top Bar */}
      <header
        className="
          flex items-center justify-between border-be border-line bg-panel px-4
          block-12
        "
      >
        <div className="flex items-center gap-3">
          <img src="/logo.webp" alt="Arcadia Logo" className="object-contain block-7 inline-auto" />
          <span className="text-sm font-semibold tracking-wide text-text">Arcadia</span>
        </div>

        {/* Studio Controls & Theme */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="
              flex items-center gap-1.5 rounded-field border border-line
              bg-field px-2.5 py-1 text-xs font-medium text-text
              transition-colors
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

      {/* Main Studio Workspace Placeholder for Phase 0 */}
      <main
        className="
          flex flex-1 flex-col items-center justify-center p-6 text-center
        "
      >
        <div className="space-y-4 max-inline-md">
          <div
            className="
              inline-flex items-center justify-center rounded-full border
              border-line bg-field p-3
            "
          >
            <img src="/logo.webp" alt="Arcadia" className="object-contain block-12 inline-12" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text">Arcadia Gamepad Studio</h1>
          <p className="text-sm/relaxed text-muted">
            Connect a game controller (DualSense, DualShock, Xbox, Switch Pro) or use your physical
            keyboard to perform and produce beats.
          </p>
        </div>
      </main>

      {/* Hardware Status Line */}
      <footer
        className="
          flex items-center justify-between border-bs border-line bg-panel px-4
          font-mono text-[11px] text-muted block-7
        "
      >
        <div className="flex items-center gap-2">
          <span className="inline-block rounded-full bg-muted/60 block-2 inline-2" />
          <span>No Controller Connected · Input Ready</span>
        </div>
        <div>
          <span>v0.1.0</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
