import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppTheme = 'light' | 'dark';
export type AppTab = 'perform' | 'mappings' | 'sound' | 'effects' | 'sampler' | 'seq';

export interface UIStoreState {
  theme: AppTheme;
  activeTab: AppTab;
  isAudioStarted: boolean;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  setActiveTab: (tab: AppTab) => void;
  setAudioStarted: (started: boolean) => void;
}

const applyThemeToDOM = (theme: AppTheme): void => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#1a1a1d' : '#e6e6eb');
    }
  }
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('arcadia.theme', theme);
    } catch {
      // Ignore storage errors
    }
  }
};

const getInitialTheme = (): AppTheme => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem('arcadia.theme');
      if (stored === 'dark') return 'dark';
      if (stored === 'light') return 'light';
    } catch {
      // Fallback
    }
  }
  return 'light'; // Light is default
};

export const useUIStore = create<UIStoreState>()(
  persist(
    (set, get) => ({
      theme: getInitialTheme(),
      activeTab: 'perform',
      isAudioStarted: false,

      setTheme: (theme) => {
        applyThemeToDOM(theme);
        set({ theme });
      },

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        applyThemeToDOM(next);
        set({ theme: next });
      },

      setActiveTab: (activeTab) => set({ activeTab }),

      setAudioStarted: (isAudioStarted) => set({ isAudioStarted }),
    }),
    {
      name: 'arcadia.ui',
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDOM(state.theme);
        }
      },
    },
  ),
);
