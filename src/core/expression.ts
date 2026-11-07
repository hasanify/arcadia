import type { ExprBinding, ExprSource, ExprTarget } from '@/core/types';

export const UNIPOLAR_TARGETS: ReadonlySet<ExprTarget> = new Set([
  'vibratoDepth',
  'filterCutoff',
  'volume',
  'reverbSend',
  'delaySend',
  'macro1',
  'macro2',
  'macro3',
  'macro4',
]);

export const BIPOLAR_TARGETS: ReadonlySet<ExprTarget> = new Set(['pitchBend', 'pan']);

export function isTriggerSource(source: ExprSource): boolean {
  return source === 'l2' || source === 'r2';
}

export function isBipolarTarget(target: ExprTarget): boolean {
  return BIPOLAR_TARGETS.has(target);
}

export function isUnipolarTarget(target: ExprTarget): boolean {
  return UNIPOLAR_TARGETS.has(target);
}

/**
 * Resolves an expression raw controller value into a normalized target output value.
 *
 * @param source Raw input value: 0..1 for triggers, -1..1 for sticks/tilt
 * @param sourceKind 'trigger' (0..1) or 'stick' (-1..1)
 * @param binding Target, amount (0..1 depth), and invert flag
 * @param rest Neutral base value when amount is 0 (default: 0 for bipolar, 1 for cutoff/volume, 0 for sends/vibrato)
 */
export function resolveExpressionValue(
  rawVal: number,
  sourceKind: 'trigger' | 'stick',
  binding: ExprBinding,
  rest?: number,
): number {
  if (binding.target === 'none') return 0;

  const isBipolar = isBipolarTarget(binding.target);
  let v = 0;

  if (sourceKind === 'trigger') {
    // rawVal in 0..1
    const t = Math.max(0, Math.min(1, rawVal));
    if (isBipolar) {
      v = binding.invert ? -t : t;
    } else {
      v = binding.invert ? 1 - t : t;
    }
  } else {
    // stick or tilt: rawVal in -1..1
    const a = Math.max(-1, Math.min(1, rawVal));
    if (isBipolar) {
      v = binding.invert ? -a : a;
    } else {
      // Centre a=0 maps to 0.5
      v = ((binding.invert ? -a : a) + 1) / 2;
    }
  }

  // Determine neutral rest value if not provided
  let defaultRest = 0;
  if (!isBipolar) {
    if (binding.target === 'volume' || binding.target === 'filterCutoff') {
      defaultRest = 1;
    } else {
      defaultRest = 0;
    }
  }
  const neutral = rest ?? defaultRest;

  // Blend with amount
  const blended = v * binding.amount + neutral * (1 - binding.amount);

  // Clamp output
  if (isBipolar) {
    return Math.max(-1, Math.min(1, blended));
  }
  return Math.max(0, Math.min(1, blended));
}
