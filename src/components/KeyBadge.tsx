import React, { useEffect, useRef } from 'react';

import type { KeyAction, LogicalButton } from '@/core/types';
import { getFriendlyKeyLabel } from '@/input/keyLabels';
import { liveState } from '@/input/liveState';
import { useConfigStore } from '@/state/configStore';

void React;

interface KeyBadgeProps {
  action: KeyAction;
  className?: string;
}

export function KeyBadge({ action, className = '' }: KeyBadgeProps) {
  const badgeRef = useRef<HTMLSpanElement | null>(null);

  const showHints = useConfigStore((state) => state.settings.keyboard.showHints);
  const keyboardEnabled = useConfigStore((state) => state.settings.keyboard.enabled);
  const keyMap = useConfigStore((state) => state.settings.keyboard.keyMap);
  const activePlayer = useConfigStore((state) => state.settings.activePlayer);

  const keyCode = keyMap[action];
  const label = keyCode ? getFriendlyKeyLabel(keyCode) : '';

  useEffect(() => {
    if (!showHints || !keyboardEnabled || !keyCode) return;

    // Direct DOM subscription for 60Hz key feedback without React re-renders
    const unsubscribe = liveState.subscribe(activePlayer, (p) => {
      const el = badgeRef.current;
      if (!el) return;

      const isPressed = Boolean(p.buttons[action as LogicalButton]);
      const wasActive = el.getAttribute('data-active') === 'true';

      if (isPressed !== wasActive) {
        el.setAttribute('data-active', isPressed ? 'true' : 'false');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [showHints, keyboardEnabled, keyCode, activePlayer, action]);

  if (!showHints || !keyboardEnabled || !label) {
    return null;
  }

  return (
    <span
      ref={badgeRef}
      data-active="false"
      className={`
        inline-flex items-center justify-center rounded-field border
        border-line/60 bg-field/90 px-1 py-0.5 font-mono text-[10px]
        font-semibold text-muted transition-colors duration-75 select-none
        data-[active=true]:border-accent data-[active=true]:bg-accent
        data-[active=true]:text-[#1f1f1f]
        ${className}
      `}
    >
      {label}
    </span>
  );
}
