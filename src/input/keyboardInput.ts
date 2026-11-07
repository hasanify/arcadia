import { NOTE_BUTTONS, type KeyAction, type NoteButton, type PlayerId } from '@/core/types';
import { liveState } from '@/input/liveState';
import { useConfigStore } from '@/state/configStore';

export interface KeyboardInputHandlers {
  onButtonDown?: (playerId: PlayerId, button: NoteButton, value: number, timestamp: number) => void;
  onButtonUp?: (playerId: PlayerId, button: NoteButton, timestamp: number) => void;
  onAction?: (action: KeyAction) => void;
}

const NOTE_BUTTON_SET = new Set<string>(NOTE_BUTTONS);

function isInteractiveElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    target.isContentEditable ||
    target.getAttribute('role') === 'textbox'
  );
}

function getActionForKeyCode(
  keyMap: Record<KeyAction, string>,
  code: string,
): KeyAction | undefined {
  for (const [action, mappedCode] of Object.entries(keyMap)) {
    if (mappedCode === code) return action as KeyAction;
  }
  return undefined;
}

export class KeyboardInputManager {
  private handlers: KeyboardInputHandlers = {};
  private activeKeys = new Set<string>();
  private active = false;

  constructor(handlers: KeyboardInputHandlers = {}) {
    this.handlers = handlers;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleWindowBlur = this.handleWindowBlur.bind(this);
  }

  public setHandlers(handlers: KeyboardInputHandlers): void {
    this.handlers = handlers;
  }

  public start(): void {
    if (this.active || typeof window === 'undefined') return;
    this.active = true;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleWindowBlur);
  }

  public stop(): void {
    if (!this.active || typeof window === 'undefined') return;
    this.active = false;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleWindowBlur);
    this.releaseAll();
  }

  private getTargetPlayerId(): PlayerId {
    const settings = useConfigStore.getState().settings;
    if (settings.keyboard.target === 'active') {
      return settings.activePlayer;
    }
    const idx = Number(settings.keyboard.target);
    return (idx >= 0 && idx <= 3 ? idx : 0) as PlayerId;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (isInteractiveElement(event.target)) return;
    if (event.repeat) return;

    const keyboardSettings = useConfigStore.getState().settings.keyboard;
    if (!keyboardSettings.enabled) return;

    const action = getActionForKeyCode(keyboardSettings.keyMap, event.code);
    if (!action) return;

    // Prevent scrolling / default action for mapped keys (e.g. Space)
    event.preventDefault();

    this.activeKeys.add(event.code);
    const playerId = this.getTargetPlayerId();
    const now = performance.now();

    if (NOTE_BUTTON_SET.has(action)) {
      const button = action as NoteButton;

      // Update liveState direct DOM bus
      const current = liveState.getPlayerState(playerId);
      const mutable = {
        ...current,
        connected: true,
        buttons: { ...current.buttons, [button]: true },
        buttonValues: { ...current.buttonValues, [button]: 1 },
        timestamp: now,
      };
      liveState.updatePlayerState(playerId, mutable);

      this.handlers.onButtonDown?.(playerId, button, 1, now);
    } else {
      this.handlers.onAction?.(action);
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    if (!this.activeKeys.has(event.code)) return;
    this.activeKeys.delete(event.code);

    const keyboardSettings = useConfigStore.getState().settings.keyboard;
    const action = getActionForKeyCode(keyboardSettings.keyMap, event.code);
    if (!action) return;

    const playerId = this.getTargetPlayerId();
    const now = performance.now();

    if (NOTE_BUTTON_SET.has(action)) {
      const button = action as NoteButton;

      // Update liveState direct DOM bus
      const current = liveState.getPlayerState(playerId);
      const mutable = {
        ...current,
        buttons: { ...current.buttons, [button]: false },
        buttonValues: { ...current.buttonValues, [button]: 0 },
        timestamp: now,
      };
      liveState.updatePlayerState(playerId, mutable);

      this.handlers.onButtonUp?.(playerId, button, now);
    }
  }

  private handleWindowBlur(): void {
    this.releaseAll();
  }

  public releaseAll(): void {
    if (this.activeKeys.size === 0) return;

    const keyboardSettings = useConfigStore.getState().settings.keyboard;
    const playerId = this.getTargetPlayerId();
    const now = performance.now();

    for (const code of this.activeKeys) {
      const action = getActionForKeyCode(keyboardSettings.keyMap, code);
      if (action && NOTE_BUTTON_SET.has(action)) {
        const button = action as NoteButton;
        const current = liveState.getPlayerState(playerId);
        const mutable = {
          ...current,
          buttons: { ...current.buttons, [button]: false },
          buttonValues: { ...current.buttonValues, [button]: 0 },
          timestamp: now,
        };
        liveState.updatePlayerState(playerId, mutable);
        this.handlers.onButtonUp?.(playerId, button, now);
      }
    }

    this.activeKeys.clear();
  }
}
