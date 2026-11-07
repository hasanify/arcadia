import React, { useEffect, useRef } from 'react';

import { masterBus } from '@/audio/masterBus';

void React;

interface LevelMeterProps {
  className?: string;
}

export function LevelMeter({ className = '' }: LevelMeterProps) {
  const leftBarRef = useRef<HTMLDivElement | null>(null);
  const rightBarRef = useRef<HTMLDivElement | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const updateMeter = (): void => {
      const [leftDb, rightDb] = masterBus.getLevels();

      // Normalize -60dB..0dB to 0%..100%
      const normL = Math.max(0, Math.min(100, ((leftDb + 60) / 60) * 100));
      const normR = Math.max(0, Math.min(100, ((rightDb + 60) / 60) * 100));

      if (leftBarRef.current) {
        leftBarRef.current.style.transform = `scaleX(${normL / 100})`;
      }
      if (rightBarRef.current) {
        rightBarRef.current.style.transform = `scaleX(${normR / 100})`;
      }

      rafIdRef.current = requestAnimationFrame(updateMeter);
    };

    rafIdRef.current = requestAnimationFrame(updateMeter);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`
        flex flex-col justify-center gap-1 rounded-field border border-line/60
        bg-field/80 px-1.5 py-1 block-6 inline-18
        ${className}
      `}
      title="Master Bus Stereo Level"
    >
      {/* Left Channel */}
      <div
        className="
        relative overflow-hidden rounded-[1px] bg-bg/70 block-1.5 inline-full
      "
      >
        <div
          ref={leftBarRef}
          className="
            origin-left bg-accent transition-transform block-full inline-full
          "
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
      {/* Right Channel */}
      <div
        className="
        relative overflow-hidden rounded-[1px] bg-bg/70 block-1.5 inline-full
      "
      >
        <div
          ref={rightBarRef}
          className="
            origin-left bg-accent transition-transform block-full inline-full
          "
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </div>
  );
}
