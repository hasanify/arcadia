import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { NoteColumn } from '@/components/NoteColumn';
import { useConfigStore } from '@/state/configStore';

void React;

describe('NoteColumn', () => {
  beforeEach(() => {
    useConfigStore.getState().resetAll();
  });

  it('renders left side note column with 5 buttons', () => {
    render(<NoteColumn player={0} side="left" />);
    expect(screen.getByText('Left Pad')).toBeInTheDocument();
    expect(screen.getByText('L1')).toBeInTheDocument();
    expect(screen.getByText('↑')).toBeInTheDocument();
    expect(screen.getByText('↓')).toBeInTheDocument();
    expect(screen.getByText('←')).toBeInTheDocument();
    expect(screen.getByText('→')).toBeInTheDocument();
  });

  it('renders right side note column with 5 buttons', () => {
    render(<NoteColumn player={0} side="right" />);
    expect(screen.getByText('Right Pad')).toBeInTheDocument();
    expect(screen.getByText('R1')).toBeInTheDocument();
    expect(screen.getByText('△')).toBeInTheDocument();
    expect(screen.getByText('□')).toBeInTheDocument();
    expect(screen.getByText('○')).toBeInTheDocument();
    expect(screen.getByText('✕')).toBeInTheDocument();
  });
});
