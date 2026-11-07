import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TopBar } from '@/components/TopBar';
import { useConfigStore } from '@/state/configStore';

void React;

describe('TopBar', () => {
  beforeEach(() => {
    useConfigStore.getState().resetAll();
  });

  it('renders title, logo, BPM, and AudioGate', () => {
    render(<TopBar />);
    expect(screen.getByText('Arcadia')).toBeInTheDocument();
    expect(screen.getByText('STUDIO')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('ENGAGE AUDIO ENGINE')).toBeInTheDocument();
  });

  it('toggles metronome when BPM button is clicked', () => {
    render(<TopBar />);
    const bpmBtn = screen.getByTitle('Toggle Metronome');
    expect(useConfigStore.getState().settings.metronome.enabled).toBe(false);

    fireEvent.click(bpmBtn);
    expect(useConfigStore.getState().settings.metronome.enabled).toBe(true);
  });

  it('toggles keyboard hints', () => {
    render(<TopBar />);
    const hintsBtn = screen.getByTitle('Keyboard Hints Enabled');
    fireEvent.click(hintsBtn);
    expect(useConfigStore.getState().settings.keyboard.showHints).toBe(false);
  });

  it('prompts to reset player on reset button click', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<TopBar />);

    const resetBtn = screen.getByTitle('Reset Active Player to Defaults');
    fireEvent.click(resetBtn);

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    confirmSpy.mockRestore();
  });
});
