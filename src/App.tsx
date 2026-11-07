import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('arcadia.theme');
      if (stored === 'light' || stored === 'dark') return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('arcadia.theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      {/* Hardware Top Bar */}
      <header className="flex h-12 items-center justify-between border-b border-line px-4 bg-panel">
        <div className="flex items-center gap-3">
          <img src="/logo.webp" alt="Arcadia Logo" className="h-7 w-auto object-contain" />
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wide text-text text-sm">Arcadia</span>
            <span className="rounded-[3px] border border-line px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted">
              EXPR
            </span>
          </div>
        </div>

        {/* Studio Controls & Theme */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 rounded-[3px] border border-line bg-field px-2.5 py-1 text-xs font-medium text-text hover:bg-field-hover transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-3.5 w-3.5 text-accent" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-accent" />
            )}
            <span className="text-[11px] font-mono uppercase">{theme}</span>
          </button>
        </div>
      </header>

      {/* Main Studio Workspace Placeholder for Phase 0 */}
      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-field border border-line">
            <img src="/logo.webp" alt="Arcadia" className="h-12 w-12 object-contain" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text">Arcadia Gamepad Studio</h1>
          <p className="text-sm text-muted leading-relaxed">
            Connect a game controller (DualSense, DualShock, Xbox, Switch Pro) or use your physical
            keyboard to perform and produce beats.
          </p>
        </div>
      </main>

      {/* Hardware Status Line */}
      <footer className="flex h-7 items-center justify-between border-t border-line px-4 text-[11px] font-mono text-muted bg-panel">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-muted/60" />
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
