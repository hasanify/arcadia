import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

import { performanceController } from '@/engine/performanceController';
import { useUIStore } from '@/state/uiStore';

void React;

export function AudioGate() {
  const isAudioStarted = useUIStore((state) => state.isAudioStarted);

  const handleToggle = async () => {
    if (!isAudioStarted) {
      await performanceController.unlockAudio();
    } else {
      performanceController.panic();
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleToggle()}
      className={`
        flex items-center gap-2 rounded-field border px-3 py-1 font-mono text-xs
        font-medium transition-colors
        ${
          isAudioStarted
            ? `
              border-line bg-field text-text
              hover:bg-field-hover
            `
            : `
              border-accent bg-accent text-accent-contrast
              hover:bg-accent-hover
            `
        }
      `}
      title={
        isAudioStarted ? 'Audio Engine Active (Click to Panic)' : 'Click to Engage Audio Engine'
      }
    >
      {isAudioStarted ? (
        <>
          <Volume2 className="block-3.5 inline-3.5" />
          <span>AUDIO ENGINE ACTIVE</span>
        </>
      ) : (
        <>
          <VolumeX className="block-3.5 inline-3.5" />
          <span>ENGAGE AUDIO ENGINE</span>
        </>
      )}
    </button>
  );
}

export default AudioGate;
