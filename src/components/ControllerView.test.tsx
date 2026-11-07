import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ControllerView } from '@/components/ControllerView';

void React;

describe('ControllerView', () => {
  it('renders SVG controller diagram with button target elements', () => {
    const { container } = render(<ControllerView player={0} />);
    expect(screen.getByTestId('controller-view')).toBeInTheDocument();

    expect(container.querySelector('[data-ctl="dpadUp"]')).toBeInTheDocument();
    expect(container.querySelector('[data-ctl="north"]')).toBeInTheDocument();
    expect(container.querySelector('[data-ctl="l1"]')).toBeInTheDocument();
    expect(container.querySelector('[data-ctl="r1"]')).toBeInTheDocument();
    expect(container.querySelector('[data-ctl="l2"]')).toBeInTheDocument();
    expect(container.querySelector('[data-ctl="r2"]')).toBeInTheDocument();
    expect(container.querySelector('[data-ctl="l3"]')).toBeInTheDocument();
    expect(container.querySelector('[data-ctl="r3"]')).toBeInTheDocument();
  });
});
