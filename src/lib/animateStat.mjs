/**
 * @param {number | string} value
 * @param {number} progress
 */
export function getAnimatedStatValue(value, progress) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  if (typeof value === "string") {
    return value.slice(0, Math.ceil(value.length * clampedProgress));
  }

  if (value === 0) {
    return String(Math.ceil((1 - clampedProgress) * 9));
  }

  return String(Math.round(value * clampedProgress));
}
