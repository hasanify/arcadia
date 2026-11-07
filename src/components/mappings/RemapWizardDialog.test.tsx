import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RemapWizardDialog } from '@/components/mappings/RemapWizardDialog';

void React;

describe('RemapWizardDialog', () => {
  it('renders step prompt when open', () => {
    render(<RemapWizardDialog open={true} onClose={() => {}} />);
    expect(screen.getByText('Controller Remap Wizard')).toBeInTheDocument();
    expect(screen.getByText('Bottom Face Button (✕ / A / B)')).toBeInTheDocument();
  });

  it('advances step on skip or next button click', () => {
    render(<RemapWizardDialog open={true} onClose={() => {}} />);
    const skipBtn = screen.getByRole('button', { name: /Skip Button/i });
    fireEvent.click(skipBtn);

    expect(screen.getByText('Right Face Button (○ / B / A)')).toBeInTheDocument();
  });

  it('closes dialog when exit button is clicked', () => {
    const closeSpy = vi.fn();
    render(<RemapWizardDialog open={true} onClose={closeSpy} />);

    // Click the X close button
    const exitBtn = screen.getByRole('button', { name: '' });
    fireEvent.click(exitBtn);

    expect(closeSpy).toHaveBeenCalled();
  });
});
