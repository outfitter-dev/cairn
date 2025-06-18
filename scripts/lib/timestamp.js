/**
 * Generate a standardized timestamp for waymark log files
 * Format: YYYYMMDDhhmm
 * @param {Date} [date] - Optional date object, defaults to now
 * @returns {string} Timestamp string
 */
export function getLogTimestamp(date = new Date()) {
  return date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0') +
    String(date.getHours()).padStart(2, '0') +
    String(date.getMinutes()).padStart(2, '0');
}

export default { getLogTimestamp };