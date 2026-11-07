import type { LogicalButton } from '@/core/types';
import type { NormalizedPadState } from '@/input/normalize';

export interface EdgeEvent {
  type: 'down' | 'up';
  button: LogicalButton;
  value: number;
  timestamp: number;
}

export class EdgeDetector {
  private prevPressed: Map<LogicalButton, boolean> = new Map();
  private lastTransitionTime: Map<LogicalButton, number> = new Map();
  private reusableEvent: EdgeEvent = {
    type: 'down',
    button: 'south',
    value: 0,
    timestamp: 0,
  };

  public reset(): void {
    this.prevPressed.clear();
    this.lastTransitionTime.clear();
  }

  public process(
    current: NormalizedPadState,
    debounceMs: number,
    onEdge: (event: Readonly<EdgeEvent>) => void,
  ): void {
    const now =
      current.timestamp || (typeof performance !== 'undefined' ? performance.now() : Date.now());

    for (const [btnKey, isPressed] of Object.entries(current.buttons) as [
      LogicalButton,
      boolean,
    ][]) {
      const wasPressed = this.prevPressed.get(btnKey) ?? false;

      if (isPressed !== wasPressed) {
        if (debounceMs > 0) {
          const lastTime = this.lastTransitionTime.get(btnKey) ?? 0;
          if (now - lastTime < debounceMs) {
            continue; // debounce suppressed
          }
        }

        this.prevPressed.set(btnKey, isPressed);
        this.lastTransitionTime.set(btnKey, now);

        this.reusableEvent.type = isPressed ? 'down' : 'up';
        this.reusableEvent.button = btnKey;
        this.reusableEvent.value = isPressed ? current.buttonValues[btnKey] || 1 : 0;
        this.reusableEvent.timestamp = now;

        onEdge(this.reusableEvent);
      }
    }
  }
}
