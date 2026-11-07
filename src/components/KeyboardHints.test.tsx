import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { KeyboardHints } from '@/components/KeyboardHints';
import { useConfigStore } from '@/state/configStore';

void React;

describe('KeyboardHints', () => {
  beforeEach(() => {
    useConfigStore.getState().resetAll();
  });

  it('renders resolved note labels and keyboard action keys', () => {
    render(<KeyboardHints />);
    expect(screen.getByTestId('keyboard-hints')).toBeInTheDocument();
    expect(screen.getByText('C1')).toBeInTheDocument();
    expect(screen.getByText('Octave')).toBeInTheDocument();
    expect(screen.getByText('Pitch Bend')).toBeInTheDocument();
  });

  it('hides when the close button is clicked', () => {
    render(<KeyboardHints />);
    const closeBtn = screen.getByTitle(/Hide keyboard hints/i);
    fireEvent.click(closeBtn);

    expect(useConfigStore.getState().settings.keyboard.showHints).toBe(false);
  });
});
