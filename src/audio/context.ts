import * as Tone from 'tone';

let audioStarted = false;

export async function ensureAudioStarted(): Promise<boolean> {
  if (audioStarted && Tone.getContext().state === 'running') {
    return true;
  }

  try {
    await Tone.start();
    audioStarted = true;
    return true;
  } catch (err) {
    console.warn('Failed to initialize Web Audio context:', err);
    return false;
  }
}

export function isAudioStarted(): boolean {
  return audioStarted && Tone.getContext().state === 'running';
}

export function getAudioContext(): Tone.BaseContext {
  return Tone.getContext();
}
