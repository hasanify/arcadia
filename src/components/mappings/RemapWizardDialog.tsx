import React, { useEffect, useState } from 'react';
import { Check, ChevronRight, RotateCcw, X } from 'lucide-react';

import type { LogicalButton } from '@/core/types';
import { liveState } from '@/input/liveState';
import { useConfigStore } from '@/state/configStore';

void React;

interface RemapWizardDialogProps {
  open: boolean;
  onClose: () => void;
}

const WIZARD_STEPS: { button: LogicalButton; prompt: string }[] = [
  { button: 'south', prompt: 'Bottom Face Button (✕ / A / B)' },
  { button: 'east', prompt: 'Right Face Button (○ / B / A)' },
  { button: 'west', prompt: 'Left Face Button (□ / X / Y)' },
  { button: 'north', prompt: 'Top Face Button (△ / Y / X)' },
  { button: 'l1', prompt: 'Left Shoulder (L1 / LB)' },
  { button: 'r1', prompt: 'Right Shoulder (R1 / RB)' },
  { button: 'l2', prompt: 'Left Trigger (L2 / LT)' },
  { button: 'r2', prompt: 'Right Trigger (R2 / RT)' },
  { button: 'dpadUp', prompt: 'D-Pad Up' },
  { button: 'dpadDown', prompt: 'D-Pad Down' },
  { button: 'dpadLeft', prompt: 'D-Pad Left' },
  { button: 'dpadRight', prompt: 'D-Pad Right' },
  { button: 'l3', prompt: 'Left Stick Click (L3)' },
  { button: 'r3', prompt: 'Right Stick Click (R3)' },
  { button: 'select', prompt: 'Select / Share / Back' },
  { button: 'start', prompt: 'Start / Options / Menu' },
];

export function RemapWizardDialog({ open, onClose }: RemapWizardDialogProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const activePlayer = useConfigStore((state) => state.settings.activePlayer);

  const step = WIZARD_STEPS[currentStepIndex];

  useEffect(() => {
    if (!open || !step) return;

    // Listen to liveState buttons
    const unsubscribe = liveState.subscribe(activePlayer, (p) => {
      for (const pressed of Object.values(p.buttons)) {
        if (pressed) {
          break;
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [open, step, activePlayer]);

  if (!open || !step) return null;

  const handleClose = (): void => {
    setCurrentStepIndex(0);
    onClose();
  };

  const handleNext = (): void => {
    if (currentStepIndex < WIZARD_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = (): void => {
    handleNext();
  };

  const isCompleted = currentStepIndex >= WIZARD_STEPS.length - 1;

  return (
    <div
      className="
      fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4
    "
    >
      <div
        className="
        flex flex-col gap-5 rounded-panel border border-line bg-panel p-6
        shadow-2xl inline-full max-inline-md
      "
      >
        {/* Header */}
        <div
          className="
          flex items-center justify-between border-be border-line/50 pbe-3
        "
        >
          <div className="flex items-center gap-2">
            <span
              className="
              flex items-center justify-center rounded-full bg-accent/20
              font-mono text-xs font-bold text-accent block-6 inline-6
            "
            >
              {currentStepIndex + 1}
            </span>
            <h3 className="text-sm font-bold text-text">Controller Remap Wizard</h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="
              rounded-field p-1 text-muted
              hover:bg-field hover:text-text
            "
          >
            <X className="block-4 inline-4" />
          </button>
        </div>

        {/* Step Body */}
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <p className="text-xs text-muted">Press the corresponding button on your controller:</p>
          <div
            className="
            rounded-panel border border-accent/40 bg-field/80 px-6 py-4
            shadow-inner inline-full
          "
          >
            <span className="text-base font-bold text-accent">{step.prompt}</span>
          </div>
          <p className="font-mono text-[11px] text-muted">
            Step {currentStepIndex + 1} of {WIZARD_STEPS.length}
          </p>
        </div>

        {/* Footer Actions */}
        <div
          className="
          flex items-center justify-between border-bs border-line/50 pbs-4
        "
        >
          <button
            type="button"
            onClick={handleSkip}
            className="
              rounded-field border border-line/40 bg-field px-3 py-1.5 text-xs
              font-semibold text-muted transition-colors
              hover:text-text
            "
          >
            Skip Button
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentStepIndex(0)}
              className="
                flex items-center gap-1 rounded-field border border-line/40
                bg-field px-3 py-1.5 text-xs font-semibold text-muted
                hover:text-text
              "
            >
              <RotateCcw className="block-3.5 inline-3.5" />
              <span>Restart</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="
                flex items-center gap-1.5 rounded-field border border-accent
                bg-accent px-4 py-1.5 text-xs font-bold text-[#1f1f1f]
                transition-transform
                hover:scale-102
              "
            >
              {isCompleted ? (
                <>
                  <Check className="block-3.5 inline-3.5" />
                  <span>Finish Wizard</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ChevronRight className="block-3.5 inline-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
