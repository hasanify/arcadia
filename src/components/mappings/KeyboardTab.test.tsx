import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { KeyboardTab } from '@/components/mappings/KeyboardTab';
import { useConfigStore } from '@/state/configStore';

void React;

describe('KeyboardTab', () => {
  beforeEach(() => {
    useConfigStore.getState().resetAll();
  });

  it('renders global keyboard switches and keybinding matrix', () => {
    render(<KeyboardTab />);
    expect(screen.getByTestId('keyboard-tab')).toBeInTheDocument();
    expect(screen.getByText('Computer Keyboard Input')).toBeInTheDocument();
    expect(screen.getByText('Keybindings Configuration')).toBeInTheDocument();
    expect(screen.getByText('Pad 1 (D-Pad Up)')).toBeInTheDocument();
  });

  it('resets keyboard bindings to default on reset button click', () => {
    useConfigStore.getState().setSettings((prev) => ({
      keyboard: {
        ...prev.keyboard,
        keyMap: { ...prev.keyboard.keyMap, dpadUp: 'KeyX' },
      },
    }));

    render(<KeyboardTab />);
    const resetBtn = screen.getByRole('button', { name: /Reset Defaults/i });
    fireEvent.click(resetBtn);

    expect(useConfigStore.getState().settings.keyboard.keyMap.dpadUp).toBe('KeyA');
  });
});
