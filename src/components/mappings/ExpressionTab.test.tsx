import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { ExpressionTab } from '@/components/mappings/ExpressionTab';
import { useConfigStore } from '@/state/configStore';

void React;

describe('ExpressionTab', () => {
  beforeEach(() => {
    useConfigStore.getState().resetAll();
  });

  it('renders 8 expression sources with routing controls', () => {
    render(<ExpressionTab player={0} />);
    expect(screen.getByTestId('expression-tab')).toBeInTheDocument();
    expect(screen.getByText('L2 Analog Trigger')).toBeInTheDocument();
    expect(screen.getByText('R2 Analog Trigger')).toBeInTheDocument();
    expect(screen.getByText('Left Stick X (Horizontal)')).toBeInTheDocument();
  });

  it('toggles invert on an expression source', () => {
    render(<ExpressionTab player={0} />);
    const buttons = screen.getAllByRole('button', { name: /Normal|Inverted/i });
    expect(buttons.length).toBeGreaterThan(0);

    const firstButton = buttons[0];
    if (!firstButton) throw new Error('Button not found');
    fireEvent.click(firstButton);
    expect(useConfigStore.getState().players[0].expression.l2.invert).toBe(true);
  });
});
