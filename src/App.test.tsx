import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from '@/App';

describe('App', () => {
  it('renders the Arcadia header and title', () => {
    render(<App />);
    expect(screen.getByText('Arcadia Gamepad Studio')).toBeInTheDocument();
    expect(screen.getByText('EXPR')).toBeInTheDocument();
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
