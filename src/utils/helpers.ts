/**
 * Parses a string into an integer, returning a default value if parsing fails.
 *
 * @param {string | undefined} value - The string to parse as an integer.
 * @param {number} defaultValue - The value to return if parsing fails or value is undefined.
 * @returns {number} The parsed integer, or the default value if parsing fails.
 */
export function parseIntWithDefault(
  value: string | undefined,
  defaultValue: number
): number {
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}
