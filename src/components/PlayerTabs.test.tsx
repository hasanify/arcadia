import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { PlayerTabs } from '@/components/PlayerTabs';
import { useConfigStore } from '@/state/configStore';
import { useUIStore } from '@/state/uiStore';

void React;

describe('PlayerTabs', () => {
  beforeEach(() => {
    useConfigStore.getState().resetAll();
    useUIStore.setState({ activeTab: 'perform' });
  });

  it('renders tabs for P1, P2, P3, P4', () => {
    render(<PlayerTabs />);
    expect(screen.getByText('P1')).toBeInTheDocument();
    expect(screen.getByText('P2')).toBeInTheDocument();
    expect(screen.getByText('P3')).toBeInTheDocument();
    expect(screen.getByText('P4')).toBeInTheDocument();
  });

  it('switches active player on tab click', () => {
    render(<PlayerTabs />);
    fireEvent.click(screen.getByText('P2'));
    expect(useConfigStore.getState().settings.activePlayer).toBe(1);
  });

  it('toggles Mappings and Sounds views', () => {
    render(<PlayerTabs />);
    fireEvent.click(screen.getByText('Mappings'));
    expect(useUIStore.getState().activeTab).toBe('mappings');

    fireEvent.click(screen.getByText('Sounds'));
    expect(useUIStore.getState().activeTab).toBe('sound');
  });
});
