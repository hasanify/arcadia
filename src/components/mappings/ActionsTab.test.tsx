import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { ActionsTab } from '@/components/mappings/ActionsTab';
import { useConfigStore } from '@/state/configStore';

void React;

describe('ActionsTab', () => {
  beforeEach(() => {
    useConfigStore.getState().resetAll();
  });

  it('renders hardware auxiliary action selects', () => {
    render(<ActionsTab player={0} />);
    expect(screen.getByTestId('actions-tab')).toBeInTheDocument();
    expect(screen.getByText('Start / Options')).toBeInTheDocument();
    expect(screen.getByText('Select / Share / Create')).toBeInTheDocument();
    expect(screen.getByText('Left Stick Click (L3)')).toBeInTheDocument();
  });

  it('updates mapped global action on change', () => {
    render(<ActionsTab player={0} />);
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);

    const targetSelect = selects[0];
    if (!targetSelect) throw new Error('Select element not found');
    fireEvent.change(targetSelect, { target: { value: 'metronomeToggle' } });
    expect(useConfigStore.getState().players[0].actions.start).toBe('metronomeToggle');
  });
});
