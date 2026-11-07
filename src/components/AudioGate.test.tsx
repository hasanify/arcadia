import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AudioGate } from '@/components/AudioGate';
import { performanceController } from '@/engine/performanceController';
import { useUIStore } from '@/state/uiStore';

void React;

describe('AudioGate', () => {
  beforeEach(() => {
    useUIStore.setState({ isAudioStarted: false });
  });

  it('renders "ENGAGE AUDIO ENGINE" when audio is inactive', () => {
    render(<AudioGate />);
    expect(screen.getByText('ENGAGE AUDIO ENGINE')).toBeInTheDocument();
  });

  it('triggers unlockAudio when clicked', () => {
    const unlockSpy = vi.spyOn(performanceController, 'unlockAudio').mockResolvedValue(true);

    render(<AudioGate />);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);

    expect(unlockSpy).toHaveBeenCalledTimes(1);
  });

  it('displays "AUDIO ENGINE ACTIVE" when started', () => {
    useUIStore.setState({ isAudioStarted: true });
    render(<AudioGate />);

    expect(screen.getByText('AUDIO ENGINE ACTIVE')).toBeInTheDocument();
  });
});
