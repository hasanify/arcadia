import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { audioEngine } from '@/audio/audioEngine';
import { performanceController } from '@/engine/performanceController';
import { heldState } from '@/input/heldState';
import { useConfigStore } from '@/state/configStore';

describe('PerformanceController', () => {
  beforeEach(() => {
    useConfigStore.getState().resetAll();
    heldState.clearAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('triggers audio noteOn when a note button is pressed', () => {
    const noteOnSpy = vi.spyOn(audioEngine, 'noteOn').mockImplementation(() => {});

    // Press dpadUp (default maps to C1 / MIDI 36)
    performanceController.handleButtonDown(0, 'dpadUp', 1, 100);

    expect(noteOnSpy).toHaveBeenCalledTimes(1);
    expect(noteOnSpy).toHaveBeenCalledWith(0, 36, 0.8);
    expect(heldState.getHeldNotes(0).get('dpadUp')).toBe(36);
  });

  it('triggers audio noteOff when a note button is released', () => {
    vi.spyOn(audioEngine, 'noteOn').mockImplementation(() => {});
    const noteOffSpy = vi.spyOn(audioEngine, 'noteOff').mockImplementation(() => {});

    performanceController.handleButtonDown(0, 'dpadUp', 1, 100);
    performanceController.handleButtonUp(0, 'dpadUp', 200);

    expect(noteOffSpy).toHaveBeenCalledTimes(1);
    expect(noteOffSpy).toHaveBeenCalledWith(0, 36);
    expect(heldState.getHeldNotes(0).has('dpadUp')).toBe(false);
  });

  it('handles octave actions cleanly', () => {
    expect(useConfigStore.getState().players[0]?.octaveShift).toBe(0);

    performanceController.executeAction(0, 'octaveUp');
    expect(useConfigStore.getState().players[0]?.octaveShift).toBe(1);

    performanceController.executeAction(0, 'octaveDown');
    expect(useConfigStore.getState().players[0]?.octaveShift).toBe(0);
  });

  it('silences all voices and clears held state on panic', () => {
    const panicSpy = vi.spyOn(audioEngine, 'panic').mockImplementation(() => {});
    heldState.setHeldNote(0, 'dpadUp', 36);

    performanceController.panic();

    expect(panicSpy).toHaveBeenCalledTimes(1);
    expect(heldState.getHeldNotes(0).size).toBe(0);
  });
});
