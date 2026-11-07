export interface StickShapingOptions {
  deadzone: number; // 0..0.4
  curve: 'linear' | 'expo' | 'log';
  curveAmount: number; // 0..1
  invertY: boolean;
}

export interface ShapedStick {
  x: number;
  y: number;
  magnitude: number;
}

export function shapeStick(
  rawX: number,
  rawY: number,
  options: StickShapingOptions,
  out?: ShapedStick,
): ShapedStick {
  const result = out ?? { x: 0, y: 0, magnitude: 0 };
  const rawMag = Math.sqrt(rawX * rawX + rawY * rawY);

  if (rawMag <= options.deadzone || rawMag === 0) {
    result.x = 0;
    result.y = 0;
    result.magnitude = 0;
    return result;
  }

  // Rescale range (deadzone..1) to (0..1)
  const clampedMag = Math.min(1, rawMag);
  const remappedMag = (clampedMag - options.deadzone) / (1 - options.deadzone);
  const normalizedMag = Math.max(0, Math.min(1, remappedMag));

  let curvedMag = normalizedMag;
  if (options.curve === 'expo') {
    const power = 1 + 2 * options.curveAmount;
    curvedMag = Math.pow(normalizedMag, power);
  } else if (options.curve === 'log') {
    const logVal = Math.log10(1 + 9 * normalizedMag);
    curvedMag = normalizedMag * (1 - options.curveAmount) + logVal * options.curveAmount;
  }

  const dirX = rawX / rawMag;
  const dirY = rawY / rawMag;

  result.x = Math.max(-1, Math.min(1, dirX * curvedMag));
  const shapedY = dirY * curvedMag;
  result.y = Math.max(-1, Math.min(1, options.invertY ? -shapedY : shapedY));
  result.magnitude = curvedMag;

  return result;
}

export function shapeTrigger(raw: number, deadzone: number): number {
  if (raw <= deadzone) return 0;
  const scaled = (raw - deadzone) / (1 - deadzone);
  return Math.max(0, Math.min(1, scaled));
}
