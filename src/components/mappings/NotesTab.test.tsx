import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { NotesTab } from '@/components/mappings/NotesTab';
import { useConfigStore } from '@/state/configStore';

void React;

describe('NotesTab', () => {
  beforeEach(() => {
    useConfigStore.getState().resetAll();
  });

  it('renders mode switchers and 10-button note map by default', () => {
    render(<NotesTab player={0} />);
    expect(screen.getByTestId('notes-tab')).toBeInTheDocument();
    expect(screen.getByText('Absolute (Individual Button Pitches)')).toBeInTheDocument();
    expect(screen.getByText('Scale Quantized (Musical Scale & Key)')).toBeInTheDocument();
    expect(screen.getByText('10-Button Note Map')).toBeInTheDocument();
  });

  it('switches to scale mode and updates scale properties', () => {
    render(<NotesTab player={0} />);
    fireEvent.click(screen.getByText('Scale Quantized (Musical Scale & Key)'));

    expect(useConfigStore.getState().players[0].noteMode).toBe('scale');
    expect(screen.getByText('Root Pitch')).toBeInTheDocument();
    expect(screen.getByText('Scale Type')).toBeInTheDocument();
  });

  it('adjusts octave shift up and down', () => {
    render(<NotesTab player={0} />);
    const plusBtn = screen.getByRole('button', { name: /\+1 Oct/i });
    fireEvent.click(plusBtn);

    expect(useConfigStore.getState().players[0].octaveShift).toBe(1);
  });
});
