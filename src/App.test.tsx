import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from '@/App';

void React;

describe('App', () => {
  it('renders the Arcadia studio workstation header and controller', () => {
    render(<App />);
    expect(screen.getByText('Arcadia')).toBeInTheDocument();
    expect(screen.getByText('STUDIO')).toBeInTheDocument();
    expect(screen.getByTestId('controller-view')).toBeInTheDocument();
    expect(screen.getByTestId('status-line')).toBeInTheDocument();
  });

  it('toggles between dark and light themes', () => {
    render(<App />);
    const themeButton = screen.getByTitle(/Switch to (Light|Dark) mode/i);
    expect(themeButton).toBeInTheDocument();

    const initialTheme = document.documentElement.getAttribute('data-theme');
    fireEvent.click(themeButton);
    const newTheme = document.documentElement.getAttribute('data-theme');

    expect(newTheme).not.toBe(initialTheme);
  });
});
