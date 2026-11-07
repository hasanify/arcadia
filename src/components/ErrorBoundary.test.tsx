import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ErrorBoundary } from '@/components/ErrorBoundary';

void React;

function ProblemChild(): React.JSX.Element {
  throw new Error('Crashing Component');
}

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Smooth sailing</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText('Smooth sailing')).toBeInTheDocument();
  });

  it('catches render error and displays recovery UI', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Audio Workstation Exception')).toBeInTheDocument();
    expect(screen.getByText('Crashing Component')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Studio/i })).toBeInTheDocument();

    errorSpy.mockRestore();
  });
});
