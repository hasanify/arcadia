export interface PadCalibration {
  padId: string;
  leftStickCenter: [number, number];
  rightStickCenter: [number, number];
  leftTriggerMin: number;
  rightTriggerMin: number;
  updatedAt: number;
}

const STORAGE_PREFIX = 'arcadia.calibration.';

export function getPadCalibration(padId: string): PadCalibration | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${padId}`);
    if (!raw) return null;
    return JSON.parse(raw) as PadCalibration;
  } catch {
    return null;
  }
}

export function savePadCalibration(calibration: PadCalibration): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}${calibration.padId}`,
      JSON.stringify({ ...calibration, updatedAt: Date.now() }),
    );
  } catch {
    // Ignore storage quota or access errors
  }
}

export function clearPadCalibration(padId: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${padId}`);
  } catch {
    // Ignore storage errors
  }
}
