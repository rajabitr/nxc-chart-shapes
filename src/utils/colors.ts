import type { SignalColors } from '../types';

/**
 * Default colors for light theme
 */
export const LIGHT_THEME_COLORS: SignalColors = {
  buy: '#26a69a',
  sell: '#ef5350',
};

/**
 * Default colors for dark theme
 */
export const DARK_THEME_COLORS: SignalColors = {
  buy: '#4caf50',
  sell: '#f44336',
};

/**
 * Entry marker colors
 */
export const ENTRY_MARKER_COLORS: SignalColors = {
  buy: '#00e676',
  sell: '#ff1744',
};

/**
 * Get theme colors
 */
export function getThemeColors(theme: 'light' | 'dark'): SignalColors {
  return theme === 'dark' ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;
}

/**
 * Get color for signal type
 */
export function getSignalColor(
  signalType: 'S' | 'B',
  colors: SignalColors
): string {
  return signalType === 'B' ? colors.buy : colors.sell;
}

/**
 * Get entry marker color for signal type
 */
export function getEntryMarkerColor(signalType: 'S' | 'B'): string {
  return signalType === 'B' ? ENTRY_MARKER_COLORS.buy : ENTRY_MARKER_COLORS.sell;
}

/**
 * Adjust color opacity
 */
export function withOpacity(color: string, opacity: number): string {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  // Handle rgb colors
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  }
  // Handle rgba colors - replace existing opacity
  if (color.startsWith('rgba(')) {
    return color.replace(/,\s*[\d.]+\)$/, `, ${opacity})`);
  }
  return color;
}

/**
 * Default shape colors by type
 */
export const SHAPE_TYPE_COLORS: Record<string, { line: string; background: string }> = {
  trend_line: { line: '#2196f3', background: 'transparent' },
  horizontal_line: { line: '#ff9800', background: 'transparent' },
  vertical_line: { line: '#9c27b0', background: 'transparent' },
  parallel_channel: { line: '#00bcd4', background: 'rgba(0, 188, 212, 0.1)' },
  rectangle: { line: '#ff5722', background: 'rgba(255, 87, 34, 0.1)' },
  fib_retracement: { line: '#e91e63', background: 'transparent' },
  fib_extension: { line: '#673ab7', background: 'transparent' },
  triangle: { line: '#009688', background: 'rgba(0, 150, 136, 0.1)' },
  abcd_pattern: { line: '#3f51b5', background: 'transparent' },
  xabcd_pattern: { line: '#795548', background: 'transparent' },
};
