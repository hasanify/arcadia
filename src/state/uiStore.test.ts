import { beforeEach, describe, expect, it } from 'vitest';

import { useUIStore } from '@/state/uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useUIStore.setState({ theme: 'light', activeTab: 'perform', isAudioStarted: false });
  });

  it('defaults to light theme', () => {
    expect(useUIStore.getState().theme).toBe('light');
  });

  it('toggles theme between light and dark', () => {
    useUIStore.getState().toggleTheme();
    expect(useUIStore.getState().theme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    useUIStore.getState().toggleTheme();
    expect(useUIStore.getState().theme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('updates active tab', () => {
    useUIStore.getState().setActiveTab('sound');
    expect(useUIStore.getState().activeTab).toBe('sound');
  });

  it('tracks audio context started state', () => {
    useUIStore.getState().setAudioStarted(true);
    expect(useUIStore.getState().isAudioStarted).toBe(true);
  });
});
