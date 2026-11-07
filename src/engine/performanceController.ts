import { isTriggerSource, resolveExpressionValue } from '@/core/expression';
import { resolveNote } from '@/core/mapping';
import type {
  ExprSource,
  GlobalAction,
  KeyAction,
  LogicalButton,
  NoteButton,
  PlayerConfig,
  PlayerId,
} from '@/core/types';
import { NOTE_BUTTONS } from '@/core/types';
import { audioEngine } from '@/audio/audioEngine';
import { ensureAudioStarted, isAudioStarted } from '@/audio/context';
import { GamepadManager } from '@/input/gamepadManager';
import { heldState } from '@/input/heldState';
import { KeyboardInputManager } from '@/input/keyboardInput';
import { useConfigStore } from '@/state/configStore';
import { useUIStore } from '@/state/uiStore';

const NOTE_BUTTON_SET = new Set<string>(NOTE_BUTTONS);

export class PerformanceController {
  public readonly gamepadManager: GamepadManager;
  public readonly keyboardManager: KeyboardInputManager;
  private active = false;

  constructor() {
    this.gamepadManager = new GamepadManager({
      onButtonDown: this.handleButtonDown.bind(this),
      onButtonUp: this.handleButtonUp.bind(this),
      onExpressionChange: this.handleExpressionChange.bind(this),
    });

    this.keyboardManager = new KeyboardInputManager({
      onButtonDown: this.handleNoteButtonDown.bind(this),
      onButtonUp: this.handleNoteButtonUp.bind(this),
      onAction: this.handleAction.bind(this),
    });
  }

  public async start(): Promise<void> {
    if (this.active) return;
    this.active = true;

    this.gamepadManager.start();
    this.keyboardManager.start();
  }

  public stop(): void {
    if (!this.active) return;
    this.active = false;

    this.gamepadManager.stop();
    this.keyboardManager.stop();
    this.panic();
  }

  public async unlockAudio(): Promise<boolean> {
    const started = await ensureAudioStarted();
    useUIStore.getState().setAudioStarted(started);
    return started;
  }

  public handleButtonDown(
    playerId: PlayerId,
    button: LogicalButton,
    value: number,
    _timestamp: number,
  ): void {
    const playerConfig = useConfigStore.getState().players[playerId];
    if (!playerConfig || !playerConfig.enabled) return;

    // Check if this button is a Global Action
    const action = playerConfig.actions[button];
    if (action && action !== 'none') {
      this.executeAction(playerId, action);
      return;
    }

    // Check if this button is a Note Button
    if (NOTE_BUTTON_SET.has(button)) {
      this.triggerNoteOn(playerId, button as NoteButton, value, playerConfig);
    }
  }

  public handleButtonUp(playerId: PlayerId, button: LogicalButton, _timestamp: number): void {
    if (NOTE_BUTTON_SET.has(button)) {
      this.triggerNoteOff(playerId, button as NoteButton);
    }
  }

  private handleNoteButtonDown(
    playerId: PlayerId,
    button: NoteButton,
    value: number,
    _timestamp: number,
  ): void {
    const playerConfig = useConfigStore.getState().players[playerId];
    if (!playerConfig || !playerConfig.enabled) return;
    this.triggerNoteOn(playerId, button, value, playerConfig);
  }

  private handleNoteButtonUp(playerId: PlayerId, button: NoteButton, _timestamp: number): void {
    this.triggerNoteOff(playerId, button);
  }

  private triggerNoteOn(
    playerId: PlayerId,
    button: NoteButton,
    rawValue: number,
    config: PlayerConfig,
  ): void {
    // Auto-unlock audio on first note if possible
    if (!isAudioStarted()) {
      void this.unlockAudio();
    }

    const note = resolveNote(button, config);
    if (note === null) return;

    // Calculate velocity
    const velocity =
      config.velocity.mode === 'fixed'
        ? config.velocity.fixed
        : Math.max(0.1, Math.min(1, rawValue));

    // Store in held state so release knows which pitch was triggered
    heldState.setHeldNote(playerId, button, note);
    audioEngine.noteOn(playerId, note, velocity);
  }

  private triggerNoteOff(playerId: PlayerId, button: NoteButton): void {
    const activePitch = heldState.clearHeldNote(playerId, button);
    if (activePitch !== null) {
      audioEngine.noteOff(playerId, activePitch);
    }
  }

  public handleExpressionChange(playerId: PlayerId, source: string, value: number): void {
    const config = useConfigStore.getState().players[playerId];
    if (!config) return;

    const binding = config.expression[source as ExprSource];
    if (!binding || binding.target === 'none') return;

    const exprSource = source as ExprSource;
    const sourceKind = isTriggerSource(exprSource) ? 'trigger' : 'stick';
    const normalizedValue = resolveExpressionValue(value, sourceKind, binding);

    switch (binding.target) {
      case 'pitchBend': {
        // Bend semitones (-bendRange .. +bendRange)
        const bendSemitones = (normalizedValue * 2 - 1) * config.bendRangeSemitones;
        audioEngine.setPitchBend(playerId, bendSemitones);
        break;
      }
      case 'filterCutoff': {
        // Exp range 50Hz to 18000Hz
        const cutoff = 50 * Math.pow(18000 / 50, normalizedValue);
        audioEngine.setFilterCutoff(playerId, cutoff);
        break;
      }
      case 'volume': {
        audioEngine.setVolume(playerId, normalizedValue);
        break;
      }
      case 'pan': {
        audioEngine.setPan(playerId, normalizedValue * 2 - 1);
        break;
      }
      case 'reverbSend': {
        audioEngine.setReverbSend(playerId, normalizedValue);
        break;
      }
      case 'delaySend': {
        audioEngine.setDelaySend(playerId, normalizedValue);
        break;
      }
    }
  }

  public handleAction(action: KeyAction): void {
    const activePlayer = useConfigStore.getState().settings.activePlayer;
    this.executeAction(activePlayer, action as GlobalAction);
  }

  public executeAction(playerId: PlayerId, action: GlobalAction): void {
    const store = useConfigStore.getState();

    switch (action) {
      case 'octaveUp': {
        const current = store.players[playerId].octaveShift;
        if (current < 3) {
          store.setPlayer(playerId, { octaveShift: current + 1 });
        }
        break;
      }
      case 'octaveDown': {
        const current = store.players[playerId].octaveShift;
        if (current > -3) {
          store.setPlayer(playerId, { octaveShift: current - 1 });
        }
        break;
      }
      case 'panic': {
        this.panic();
        break;
      }
      case 'metronomeToggle': {
        const current = store.settings.metronome.enabled;
        store.setSettings({
          metronome: { ...store.settings.metronome, enabled: !current },
        });
        break;
      }
    }
  }

  public panic(): void {
    heldState.clearAll();
    audioEngine.panic();
  }
}

export const performanceController = new PerformanceController();
