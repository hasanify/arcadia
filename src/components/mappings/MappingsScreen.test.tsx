import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { MappingsScreen } from '@/components/mappings/MappingsScreen';
import { useConfigStore } from '@/state/configStore';
import { useUIStore } from '@/state/uiStore';

void React;

describe('MappingsScreen', () => {
  beforeEach(() => {
    useConfigStore.getState().resetAll();
    useUIStore.setState({ activeTab: 'mappings' });
  });

  it('renders mappings navigation and tabs', () => {
    render(<MappingsScreen player={0} />);
    expect(screen.getByTestId('mappings-screen')).toBeInTheDocument();
    expect(screen.getByText('Back to Studio')).toBeInTheDocument();
    expect(screen.getByText('Notes & Scales')).toBeInTheDocument();
    expect(screen.getByText('Expression')).toBeInTheDocument();
    expect(screen.getByText('Controller & Shaping')).toBeInTheDocument();
    expect(screen.getByText('Auxiliary Actions')).toBeInTheDocument();
    expect(screen.getByText('Keyboard Bindings')).toBeInTheDocument();
  });

  it('navigates back to studio when Back button is clicked', () => {
    render(<MappingsScreen player={0} />);
    const backBtn = screen.getByRole('button', { name: /Back to Studio/i });
    fireEvent.click(backBtn);

    expect(useUIStore.getState().activeTab).toBe('perform');
  });

  it('switches between sub-tabs cleanly', () => {
    render(<MappingsScreen player={0} />);
    fireEvent.click(screen.getByText('Expression'));
    expect(screen.getByTestId('expression-tab')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Controller & Shaping'));
    expect(screen.getByTestId('controller-tab')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Auxiliary Actions'));
    expect(screen.getByTestId('actions-tab')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Keyboard Bindings'));
    expect(screen.getByTestId('keyboard-tab')).toBeInTheDocument();
  });
});
