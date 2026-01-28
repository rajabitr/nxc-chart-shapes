/**
 * Convert Unix timestamp (seconds) to milliseconds
 */
export function unixToMs(unix: number): number {
  // If already in milliseconds (13 digits), return as is
  if (unix > 9999999999999) {
    return unix;
  }
  // If in seconds (10 digits), convert to milliseconds
  return unix * 1000;
}

/**
 * Convert milliseconds to Unix timestamp (seconds)
 */
export function msToUnix(ms: number): number {
  // If already in seconds (10 digits), return as is
  if (ms < 9999999999) {
    return ms;
  }
  // If in milliseconds (13 digits), convert to seconds
  return Math.floor(ms / 1000);
}

/**
 * Map timeframe minutes to TradingView interval string
 */
export function timeframeMinToInterval(minutes: number): string {
  const mapping: Record<number, string> = {
    1: '1',
    3: '3',
    5: '5',
    15: '15',
    30: '30',
    60: '60',
    120: '120',
    240: '240',
    360: '360',
    480: '480',
    720: '720',
    1440: 'D',
    10080: 'W',
  };

  return mapping[minutes] || String(minutes);
}

/**
 * Map TradingView interval to timeframe minutes
 */
export function intervalToTimeframeMin(interval: string): number {
  const mapping: Record<string, number> = {
    '1': 1,
    '3': 3,
    '5': 5,
    '15': 15,
    '30': 30,
    '60': 60,
    '120': 120,
    '240': 240,
    '360': 360,
    '480': 480,
    '720': 720,
    'D': 1440,
    '1D': 1440,
    'W': 10080,
    '1W': 10080,
  };

  return mapping[interval] || parseInt(interval, 10) || 0;
}

/**
 * Get timeframe display name
 */
export function getTimeframeDisplayName(minutes: number): string {
  const mapping: Record<number, string> = {
    1: '1m',
    3: '3m',
    5: '5m',
    15: '15m',
    30: '30m',
    60: '1h',
    120: '2h',
    240: '4h',
    360: '6h',
    480: '8h',
    720: '12h',
    1440: '1d',
    10080: '1w',
  };

  return mapping[minutes] || `${minutes}m`;
}

/**
 * Check if a timestamp is valid
 */
export function isValidTimestamp(timestamp: number): boolean {
  return timestamp > 0 && timestamp < Date.now() * 2;
}

/**
 * Get the start of a candle based on timeframe
 */
export function getCandleStart(timestamp: number, timeframeMin: number): number {
  const ms = unixToMs(timestamp);
  const intervalMs = timeframeMin * 60 * 1000;
  return Math.floor(ms / intervalMs) * intervalMs;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: number): string {
  const ms = unixToMs(timestamp);
  return new Date(ms).toISOString();
}
