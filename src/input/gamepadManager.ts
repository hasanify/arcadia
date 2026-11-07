import type { LogicalButton, PlayerId } from '@/core/types';
import { EdgeDetector, type EdgeEvent } from '@/input/edgeDetector';
import { liveState } from '@/input/liveState';
import { createEmptyPadState, normalizeGamepad, type NormalizedPadState } from '@/input/normalize';
import { identifyController, type ControllerProfile } from '@/input/profiles';
import { useConfigStore } from '@/state/configStore';

export interface GamepadEventHandlers {
  onButtonDown?: (
    playerId: PlayerId,
    button: LogicalButton,
    value: number,
    timestamp: number,
  ) => void;
  onButtonUp?: (playerId: PlayerId, button: LogicalButton, timestamp: number) => void;
  onExpressionChange?: (playerId: PlayerId, source: string, value: number) => void;
  onConnect?: (gamepadIndex: number, profile: ControllerProfile) => void;
  onDisconnect?: (gamepadIndex: number) => void;
}

export class GamepadManager {
  private running = false;
  private rafId: number | null = null;
  private handlers: GamepadEventHandlers = {};

  // Pre-allocated per-player buffers (zero GC in hot loop)
  private readonly normalizedStates: [
    NormalizedPadState,
    NormalizedPadState,
    NormalizedPadState,
    NormalizedPadState,
  ] = [createEmptyPadState(), createEmptyPadState(), createEmptyPadState(), createEmptyPadState()];

  private readonly edgeDetectors: [EdgeDetector, EdgeDetector, EdgeDetector, EdgeDetector] = [
    new EdgeDetector(),
    new EdgeDetector(),
    new EdgeDetector(),
    new EdgeDetector(),
  ];

  // Cached profile per gamepad index
  private profilesByIndex = new Map<number, ControllerProfile>();

  constructor(handlers: GamepadEventHandlers = {}) {
    this.handlers = handlers;
    this.handleWindowGamepadConnected = this.handleWindowGamepadConnected.bind(this);
    this.handleWindowGamepadDisconnected = this.handleWindowGamepadDisconnected.bind(this);
    this.tick = this.tick.bind(this);
  }

  public setHandlers(handlers: GamepadEventHandlers): void {
    this.handlers = handlers;
  }

  public start(): void {
    if (this.running) return;
    this.running = true;

    if (typeof window !== 'undefined') {
      window.addEventListener('gamepadconnected', this.handleWindowGamepadConnected);
      window.addEventListener('gamepaddisconnected', this.handleWindowGamepadDisconnected);
      this.rafId = window.requestAnimationFrame(this.tick);
    }
  }

  public stop(): void {
    this.running = false;
    if (this.rafId !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('gamepadconnected', this.handleWindowGamepadConnected);
      window.removeEventListener('gamepaddisconnected', this.handleWindowGamepadDisconnected);
    }
  }

  private handleWindowGamepadConnected(event: GamepadEvent): void {
    const pad = event.gamepad;
    const profile = identifyController(pad.id);
    this.profilesByIndex.set(pad.index, profile);
    this.handlers.onConnect?.(pad.index, profile);
  }

  private handleWindowGamepadDisconnected(event: GamepadEvent): void {
    const pad = event.gamepad;
    this.profilesByIndex.delete(pad.index);
    this.handlers.onDisconnect?.(pad.index);
  }

  public pollGamepads(): (Gamepad | null)[] {
    if (typeof navigator === 'undefined' || !navigator.getGamepads) {
      return [];
    }
    return navigator.getGamepads();
  }

  public tick(): void {
    if (!this.running) return;

    const gamepads = this.pollGamepads();
    const config = useConfigStore.getState();

    // Iterate through player slots (0..3)
    for (let pIdx = 0; pIdx < 4; pIdx++) {
      const playerId = pIdx as PlayerId;
      const playerConfig = config.players[playerId];
      const targetState = this.normalizedStates[playerId];

      if (!playerConfig || !playerConfig.enabled) {
        if (targetState.connected) {
          targetState.connected = false;
          liveState.updatePlayerState(playerId, targetState);
        }
        continue;
      }

      // Find gamepad assigned to this player
      let assignedPad: Gamepad | null = null;
      if (playerConfig.pad.mode === 'manual' && playerConfig.pad.padKey) {
        for (const pad of gamepads) {
          if (pad && pad.id === playerConfig.pad.padKey) {
            assignedPad = pad;
            break;
          }
        }
      } else {
        // Auto: 1-to-1 match by index
        assignedPad = gamepads[pIdx] ?? null;
      }

      if (assignedPad && assignedPad.connected) {
        let profile = this.profilesByIndex.get(assignedPad.index);
        if (!profile) {
          profile = identifyController(assignedPad.id);
          this.profilesByIndex.set(assignedPad.index, profile);
        }

        normalizeGamepad(assignedPad, profile, playerConfig.controller, targetState);
        liveState.updatePlayerState(playerId, targetState);

        // Edge detection
        const detector = this.edgeDetectors[playerId];
        detector.process(
          targetState,
          playerConfig.controller.debounceMs,
          (edgeEvent: Readonly<EdgeEvent>) => {
            if (edgeEvent.type === 'down') {
              this.handlers.onButtonDown?.(
                playerId,
                edgeEvent.button,
                edgeEvent.value,
                edgeEvent.timestamp,
              );
            } else {
              this.handlers.onButtonUp?.(playerId, edgeEvent.button, edgeEvent.timestamp);
            }
          },
        );
      } else {
        if (targetState.connected) {
          targetState.connected = false;
          this.edgeDetectors[playerId].reset();
          liveState.updatePlayerState(playerId, targetState);
        }
      }
    }

    if (this.running && typeof window !== 'undefined') {
      this.rafId = window.requestAnimationFrame(this.tick);
    }
  }
}
