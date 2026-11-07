import { describe, expect, it } from 'vitest';

import { EdgeDetector, type EdgeEvent } from '@/input/edgeDetector';
import { createEmptyPadState } from '@/input/normalize';

describe('edgeDetector', () => {
  it('detects rising edges (buttonDown)', () => {
    const detector = new EdgeDetector();
    const state = createEmptyPadState();
    state.buttons.south = true;
    state.buttonValues.south = 0.95;
    state.timestamp = 100;

    const events: EdgeEvent[] = [];
    detector.process(state, 0, (e) => events.push({ ...e }));

    expect(events).toHaveLength(1);
    expect(events[0]?.type).toBe('down');
    expect(events[0]?.button).toBe('south');
    expect(events[0]?.value).toBe(0.95);
  });

  it('detects falling edges (buttonUp)', () => {
    const detector = new EdgeDetector();
    const state = createEmptyPadState();
    state.buttons.south = true;
    state.timestamp = 100;

    detector.process(state, 0, () => {});

    state.buttons.south = false;
    state.buttonValues.south = 0;
    state.timestamp = 200;

    const events: EdgeEvent[] = [];
    detector.process(state, 0, (e) => events.push({ ...e }));

    expect(events).toHaveLength(1);
    expect(events[0]?.type).toBe('up');
    expect(events[0]?.button).toBe('south');
  });

  it('suppresses jitter when debounce is enabled', () => {
    const detector = new EdgeDetector();
    const state = createEmptyPadState();
    state.buttons.north = true;
    state.timestamp = 100;

    const events: EdgeEvent[] = [];
    detector.process(state, 20, (e) => events.push({ ...e }));
    expect(events).toHaveLength(1);

    // Fast bounce at 110ms (< 20ms)
    state.buttons.north = false;
    state.timestamp = 110;
    detector.process(state, 20, (e) => events.push({ ...e }));
    expect(events).toHaveLength(1); // ignored

    // Legitimate release at 130ms (>= 20ms)
    state.timestamp = 130;
    detector.process(state, 20, (e) => events.push({ ...e }));
    expect(events).toHaveLength(2);
    expect(events[1]?.type).toBe('up');
  });
});
