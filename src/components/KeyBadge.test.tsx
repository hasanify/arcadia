import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { KeyBadge } from '@/components/KeyBadge';
import { useConfigStore } from '@/state/configStore';

void React;

describe('KeyBadge', () => {
  beforeEach(() => {
    useConfigStore.getState().resetAll();
  });

  it('renders the friendly keycap label for a note action', () => {
    render(<KeyBadge action="dpadUp" />);
    // dpadUp defaults to KeyA -> 'A'
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders nothing when showHints is false', () => {
    useConfigStore.getState().setSettings((prev) => ({
      keyboard: { ...prev.keyboard, showHints: false },
    }));

    const { container } = render(<KeyBadge action="dpadUp" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when keyboard is disabled', () => {
    useConfigStore.getState().setSettings((prev) => ({
      keyboard: { ...prev.keyboard, enabled: false },
    }));

    const { container } = render(<KeyBadge action="dpadUp" />);
    expect(container).toBeEmptyDOMElement();
  });
});
