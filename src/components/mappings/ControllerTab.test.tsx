import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ControllerTab } from '@/components/mappings/ControllerTab';
import { useConfigStore } from '@/state/configStore';

void React;

describe('ControllerTab', () => {
  beforeEach(() => {
    useConfigStore.getState().resetAll();
  });

  it('renders deadzone sliders, curve select, and rumble switch', () => {
    render(<ControllerTab player={0} />);
    expect(screen.getByTestId('controller-tab')).toBeInTheDocument();
    expect(screen.getByText('Gamepad Assignment')).toBeInTheDocument();
    expect(screen.getByText('Analog Stick Deadzone')).toBeInTheDocument();
    expect(screen.getByText('Response Curve')).toBeInTheDocument();
  });

  it('toggles invert Y axis setting', () => {
    render(<ControllerTab player={0} />);
    const invertBtn = screen.getByRole('button', { name: /Inverted|Standard/i });
    fireEvent.click(invertBtn);

    expect(useConfigStore.getState().players[0].controller.invertY).toBe(false);
  });

  it('triggers onOpenRemapWizard when wizard button is clicked', () => {
    const wizardSpy = vi.fn();
    render(<ControllerTab player={0} onOpenRemapWizard={wizardSpy} />);

    const wizardBtn = screen.getByRole('button', { name: /Remap Wizard/i });
    fireEvent.click(wizardBtn);

    expect(wizardSpy).toHaveBeenCalledTimes(1);
  });
});
