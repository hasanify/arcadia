import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { NoteField } from '@/components/NoteField';
import { useConfigStore } from '@/state/configStore';

void React;

describe('NoteField', () => {
  beforeEach(() => {
    useConfigStore.getState().resetAll();
  });

  it('renders glyph and resolved note name', () => {
    render(<NoteField player={0} button="dpadUp" side="left" />);
    // dpadUp glyph is ↑, default note is C1
    expect(screen.getByText('↑')).toBeInTheDocument();
    expect(screen.getByText('C1')).toBeInTheDocument();
  });

  it('allows editing note pitch on click and commits with Enter', () => {
    render(<NoteField player={0} button="dpadUp" side="left" />);
    const noteBtn = screen.getByText('C1');
    fireEvent.click(noteBtn);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'D#2' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(useConfigStore.getState().players[0].noteMap.dpadUp).toBe('D#2');
    expect(screen.getByText('D#2')).toBeInTheDocument();
  });
});
