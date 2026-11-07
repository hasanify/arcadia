import React, { useEffect, useRef } from 'react';

import type { PlayerId } from '@/core/types';
import { liveState } from '@/input/liveState';

void React;

interface ControllerViewProps {
  player: PlayerId;
  className?: string;
}

export function ControllerView({ player, className = '' }: ControllerViewProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const leftStickRef = useRef<SVGCircleElement | null>(null);
  const rightStickRef = useRef<SVGCircleElement | null>(null);
  const l2FillRef = useRef<SVGRectElement | null>(null);
  const r2FillRef = useRef<SVGRectElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const buttonElements: Record<string, SVGElement | null> = {
      dpadUp: svg.querySelector('[data-ctl="dpadUp"]'),
      dpadDown: svg.querySelector('[data-ctl="dpadDown"]'),
      dpadLeft: svg.querySelector('[data-ctl="dpadLeft"]'),
      dpadRight: svg.querySelector('[data-ctl="dpadRight"]'),
      north: svg.querySelector('[data-ctl="north"]'),
      south: svg.querySelector('[data-ctl="south"]'),
      west: svg.querySelector('[data-ctl="west"]'),
      east: svg.querySelector('[data-ctl="east"]'),
      l1: svg.querySelector('[data-ctl="l1"]'),
      r1: svg.querySelector('[data-ctl="r1"]'),
      l2: svg.querySelector('[data-ctl="l2"]'),
      r2: svg.querySelector('[data-ctl="r2"]'),
      l3: svg.querySelector('[data-ctl="l3"]'),
      r3: svg.querySelector('[data-ctl="r3"]'),
      select: svg.querySelector('[data-ctl="select"]'),
      start: svg.querySelector('[data-ctl="start"]'),
      home: svg.querySelector('[data-ctl="home"]'),
    };

    const unsubscribe = liveState.subscribe(player, (p) => {
      // Update button highlights
      for (const [btnName, el] of Object.entries(buttonElements)) {
        if (!el) continue;
        const btn = p.buttons[btnName as keyof typeof p.buttons];
        const isPressed = Boolean(btn);
        const wasActive = el.getAttribute('data-active') === 'true';
        if (isPressed !== wasActive) {
          el.setAttribute('data-active', isPressed ? 'true' : 'false');
        }
      }

      // Update analog trigger fills (0..1)
      if (l2FillRef.current) {
        l2FillRef.current.style.transform = `scaleY(${p.l2})`;
      }
      if (r2FillRef.current) {
        r2FillRef.current.style.transform = `scaleY(${p.r2})`;
      }

      // Update stick positions (max offset ±12px)
      if (leftStickRef.current) {
        const dx = p.lx * 12;
        const dy = -p.ly * 12; // Invert so up moves visual stick up
        leftStickRef.current.setAttribute('cx', String(160 + dx));
        leftStickRef.current.setAttribute('cy', String(205 + dy));
      }
      if (rightStickRef.current) {
        const dx = p.rx * 12;
        const dy = -p.ry * 12;
        rightStickRef.current.setAttribute('cx', String(290 + dx));
        rightStickRef.current.setAttribute('cy', String(205 + dy));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [player]);

  return (
    <div
      className={`
        relative flex items-center justify-center p-4
        ${className}
      `}
      data-testid="controller-view"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 450 310"
        className="select-none max-block-80 max-inline-full"
        style={{
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
      >
        <defs>
          <linearGradient id="controllerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f6a547" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#f6a547" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Outer Controller Shell Outline */}
        <path
          d="
            M 130 50
            C 160 50, 180 65, 225 65
            C 270 65, 290 50, 320 50
            C 365 50, 420 85, 430 160
            C 438 220, 395 285, 345 285
            C 310 285, 280 250, 260 220
            C 245 200, 205 200, 190 220
            C 170 250, 140 285, 105 285
            C 55 285, 12 220, 20 160
            C 30 85, 85 50, 130 50 Z
          "
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-line/60"
        />

        {/* Center Touchpad outline */}
        <rect
          x="170"
          y="75"
          width="110"
          height="65"
          rx="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-line/40"
        />

        {/* L1 Bumper */}
        <path
          data-ctl="l1"
          d="M 90 40 C 110 38, 140 40, 160 48 L 155 58 C 135 52, 110 50, 95 52 Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          className="
            text-line/30 transition-colors
            data-[active=true]:text-accent
          "
        />

        {/* R1 Bumper */}
        <path
          data-ctl="r1"
          d="M 360 40 C 340 38, 310 40, 290 48 L 295 58 C 315 52, 340 50, 355 52 Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          className="
            text-line/30 transition-colors
            data-[active=true]:text-accent
          "
        />

        {/* L2 Analog Trigger Gauge Container */}
        <g transform="translate(60, 22)">
          <rect
            data-ctl="l2"
            x="0"
            y="0"
            width="28"
            height="18"
            rx="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="
              text-line/50 transition-colors
              data-[active=true]:text-accent
            "
          />
          <rect
            ref={l2FillRef}
            x="2"
            y="2"
            width="24"
            height="14"
            rx="2"
            fill="currentColor"
            className="
              origin-bottom text-accent/70 transition-transform duration-75
            "
            style={{ transform: 'scaleY(0)' }}
          />
          <text
            x="14"
            y="13"
            textAnchor="middle"
            className="fill-muted font-mono text-[9px] font-bold"
          >
            L2
          </text>
        </g>

        {/* R2 Analog Trigger Gauge Container */}
        <g transform="translate(362, 22)">
          <rect
            data-ctl="r2"
            x="0"
            y="0"
            width="28"
            height="18"
            rx="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="
              text-line/50 transition-colors
              data-[active=true]:text-accent
            "
          />
          <rect
            ref={r2FillRef}
            x="2"
            y="2"
            width="24"
            height="14"
            rx="2"
            fill="currentColor"
            className="
              origin-bottom text-accent/70 transition-transform duration-75
            "
            style={{ transform: 'scaleY(0)' }}
          />
          <text
            x="14"
            y="13"
            textAnchor="middle"
            className="fill-muted font-mono text-[9px] font-bold"
          >
            R2
          </text>
        </g>

        {/* D-PAD CLUSTER */}
        <g transform="translate(100, 135)">
          {/* D-Pad Up */}
          <rect
            data-ctl="dpadUp"
            x="-7"
            y="-26"
            width="14"
            height="18"
            rx="2"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.2"
            className="
              text-line/30 transition-colors
              data-[active=true]:text-accent
            "
          />
          {/* D-Pad Down */}
          <rect
            data-ctl="dpadDown"
            x="-7"
            y="8"
            width="14"
            height="18"
            rx="2"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.2"
            className="
              text-line/30 transition-colors
              data-[active=true]:text-accent
            "
          />
          {/* D-Pad Left */}
          <rect
            data-ctl="dpadLeft"
            x="-26"
            y="-7"
            width="18"
            height="14"
            rx="2"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.2"
            className="
              text-line/30 transition-colors
              data-[active=true]:text-accent
            "
          />
          {/* D-Pad Right */}
          <rect
            data-ctl="dpadRight"
            x="8"
            y="-7"
            width="18"
            height="14"
            rx="2"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.2"
            className="
              text-line/30 transition-colors
              data-[active=true]:text-accent
            "
          />
          {/* D-Pad Center Cap */}
          <circle cx="0" cy="0" r="6" fill="currentColor" className="text-bg" />
        </g>

        {/* FACE BUTTONS CLUSTER */}
        <g transform="translate(350, 135)">
          {/* North (△ / Y) */}
          <circle
            data-ctl="north"
            cx="0"
            cy="-18"
            r="9"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.2"
            className="
              text-line/30 transition-colors
              data-[active=true]:text-accent
            "
          />
          <text
            x="0"
            y="-15"
            textAnchor="middle"
            className="
              pointer-events-none fill-text font-mono text-[9px] font-bold
            "
          >
            △
          </text>

          {/* West (□ / X) */}
          <circle
            data-ctl="west"
            cx="-18"
            cy="0"
            r="9"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.2"
            className="
              text-line/30 transition-colors
              data-[active=true]:text-accent
            "
          />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            className="
              pointer-events-none fill-text font-mono text-[9px] font-bold
            "
          >
            □
          </text>

          {/* East (○ / B) */}
          <circle
            data-ctl="east"
            cx="18"
            cy="0"
            r="9"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.2"
            className="
              text-line/30 transition-colors
              data-[active=true]:text-accent
            "
          />
          <text
            x="18"
            y="3"
            textAnchor="middle"
            className="
              pointer-events-none fill-text font-mono text-[9px] font-bold
            "
          >
            ○
          </text>

          {/* South (✕ / A) */}
          <circle
            data-ctl="south"
            cx="0"
            cy="18"
            r="9"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.2"
            className="
              text-line/30 transition-colors
              data-[active=true]:text-accent
            "
          />
          <text
            x="0"
            y="21"
            textAnchor="middle"
            className="
              pointer-events-none fill-text font-mono text-[9px] font-bold
            "
          >
            ✕
          </text>
        </g>

        {/* LEFT THUMBSTICK (L3) */}
        <g>
          {/* Outer Ring */}
          <circle
            cx="160"
            cy="205"
            r="26"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-line/20"
          />
          {/* Center Stick Cap (Offset in realtime via liveState) */}
          <circle
            ref={leftStickRef}
            data-ctl="l3"
            cx="160"
            cy="205"
            r="16"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.5"
            className="
              text-field transition-colors
              data-[active=true]:text-accent
            "
          />
        </g>

        {/* RIGHT THUMBSTICK (R3) */}
        <g>
          <circle
            cx="290"
            cy="205"
            r="26"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-line/20"
          />
          <circle
            ref={rightStickRef}
            data-ctl="r3"
            cx="290"
            cy="205"
            r="16"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.5"
            className="
              text-field transition-colors
              data-[active=true]:text-accent
            "
          />
        </g>

        {/* CENTER BUTTONS: Select / Share, PS / Home, Start / Options */}
        <rect
          data-ctl="select"
          x="142"
          y="85"
          width="8"
          height="14"
          rx="2"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
          className="
            text-line/40 transition-colors
            data-[active=true]:text-accent
          "
        />
        <rect
          data-ctl="start"
          x="300"
          y="85"
          width="8"
          height="14"
          rx="2"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
          className="
            text-line/40 transition-colors
            data-[active=true]:text-accent
          "
        />
        <circle
          data-ctl="home"
          cx="225"
          cy="180"
          r="8"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
          className="
            text-line/30 transition-colors
            data-[active=true]:text-accent
          "
        />
      </svg>
    </div>
  );
}
