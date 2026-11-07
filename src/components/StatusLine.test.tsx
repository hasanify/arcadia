import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StatusLine } from '@/components/StatusLine';

void React;

describe('StatusLine', () => {
  it('renders input ready and audio engine lock status', () => {
    render(<StatusLine player={0} />);
    expect(screen.getByTestId('status-line')).toBeInTheDocument();
    expect(screen.getByText('Keyboard')).toBeInTheDocument();
    expect(screen.getByText('v0.1.0')).toBeInTheDocument();
  });
});
