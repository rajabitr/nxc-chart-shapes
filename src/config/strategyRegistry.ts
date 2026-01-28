/**
 * Built-in Strategy Registry
 *
 * This file contains all strategy_id to shape mappings extracted from
 * the original PHP ChartingController.php
 *
 * Users don't need to define strategies - they're built into the library.
 */

import type { StrategyConfig, ShapeType } from '../types';

/**
 * Default colors for buy/sell signals
 */
const DEFAULT_COLORS = {
  buy: '#26a69a',   // Green
  sell: '#ef5350',  // Red
};

const ZONE_COLORS = {
  buy: '#26a69a',   // Green (solid)
  sell: '#ef5350',  // Red (solid)
};

const FIB_COLORS = {
  buy: '#9c27b0',
  sell: '#ff5722',
};

const CHANNEL_COLORS = {
  buy: '#673ab7',   // Purple (solid for lines)
  sell: '#e91e63',  // Pink (solid for lines)
};

const INDICATOR_COLORS = {
  buy: '#2196F3',   // Blue
  sell: '#2196F3',  // Blue (same for indicators)
};

/**
 * Strategy groups - based on PHP ChartingController.php jsScripts function
 */

// ============ INDICATORS ============

// 1-30, 496, 497: Ichimoku Cloud
const ICHIMOKU_IDS = [
  ...Array.from({ length: 30 }, (_, i) => i + 1), // 1-30
  496, 497
];

// SMA indicators
const SMA10_IDS = [31, 32, 33, 34, 51, 52];
const SMA20_IDS = [35, 36, 37, 38, 53, 54];
const SMA50_IDS = [39, 40, 41, 42, 55, 56];
const SMA100_IDS = [43, 44, 45, 46, 57, 58];
const SMA200_IDS = [47, 48, 49, 50, 59, 60];

// WMA indicators
const WMA10_IDS = [61, 62, 63, 64, 81, 82];
const WMA20_IDS = [65, 66, 67, 68, 83, 84];
const WMA50_IDS = [69, 70, 71, 72, 85, 86];
const WMA100_IDS = [73, 74, 75, 76, 87, 88];
const WMA200_IDS = [77, 78, 79, 80, 89, 90];

// EMA indicators
const EMA10_IDS = [91, 92, 93, 94, 111, 112];
const EMA20_IDS = [95, 96, 97, 98, 113, 114];
const EMA50_IDS = [99, 100, 101, 102, 115, 116];
const EMA100_IDS = [103, 104, 105, 106, 117, 118];
const EMA200_IDS = [107, 108, 109, 110, 119, 120];

// MA Cross strategies - each needs 2 MAs drawn
// Will be handled individually below with specific MA configs

// RSI Divergence (with trend lines on both price chart and RSI pane)
const RSI_DIVERGENCE_IDS = [
  ...Array.from({ length: 6 }, (_, i) => i + 215), // 215-220
  277, 278, // RSI divergence with both price and RSI lines
];

// RSI Signal (just RSI + entry marker)
const RSI_SIGNAL_IDS = [
  ...Array.from({ length: 8 }, (_, i) => i + 269), // 269-276
  575, 576
];

// MACD (just indicator + entry marker)
const MACD_IDS = [
  ...Array.from({ length: 8 }, (_, i) => i + 249), // 249-256
];

// MACD Divergence (trend lines on both price chart and MACD pane)
const MACD_DIVERGENCE_IDS = [289, 290, 291, 292];

// Volume indicators
const VOLUME_10_IDS = [507, 508, 509, 510];
const VOLUME_20_IDS = [511, 512, 513, 514];
const VOLUME_50_IDS = [515, 516, 517, 518];

// ============ SHAPES ============

// 181-214: Just signalLine (entry marker only)
const SIGNAL_ONLY_IDS = Array.from({ length: 34 }, (_, i) => i + 181);

// 293, 294: Complex signal with arrows + fib_retracement
const FIB_PATTERN_IDS = [293, 294];

// 295, 296: Zone/Rectangle (using z1p, z1t, z2p, z2t)
const ZONE_IDS = [295, 296];

// 301, 302: Three Drives Pattern (7 points)
const THREE_DRIVES_IDS = [301, 302];

// 303-306: 3 Divers Pattern (zigzag + horizontal lines)
const THREE_DIVERS_IDS = [303, 304, 305, 306];

// 310-319, 330-331: Rectangle
const RECTANGLE_IDS = [310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 330, 331];

// 324-327: Double Rectangle (draws 2 rectangles)
const DOUBLE_RECT_IDS = [324, 325, 326, 327];

// 332-339: Trend Line
const TREND_LINE_IDS = [332, 333, 334, 335, 336, 337, 338, 339];

// 342-361: Parallel Channel
const CHANNEL_IDS = [342, 343, 346, 347, 348, 349, 350, 351, 352, 353, 356, 357, 358, 359, 360, 361];

// 364-407: Triangle Pattern
const TRIANGLE_IDS = Array.from({ length: 44 }, (_, i) => i + 364);

// 408-432 (even): Fibonacci with arrows (bullish)
const FIB_ARROW_EVEN_IDS = [408, 410, 412, 414, 418, 420, 422, 424, 426, 428, 430, 432];

// 409-433 (odd): Fibonacci with arrows (bearish)
const FIB_ARROW_ODD_IDS = [409, 411, 413, 415, 419, 421, 423, 425, 427, 429, 431, 433];

// 464-465: ABCD Pattern
const ABCD_IDS = [464, 465];

// 466-487: XABCD Pattern
const XABCD_IDS = Array.from({ length: 22 }, (_, i) => i + 466);

// 488-495: 3 Divers Pattern variant
const THREE_DIVERS_2_IDS = [488, 489, 490, 491, 492, 493, 494, 495];

// 498, 499, 519, 520: Rectangle + Balloon
const RECT_BALLOON_IDS = [498, 499, 519, 520];

// 501-504: Complex arrow pattern (10 points)
const COMPLEX_ARROW_IDS = [501, 502, 503, 504];

// 505, 506: Head and Shoulders
const HEAD_SHOULDERS_IDS = [505, 506];

// 571-574: RSI with arrows (complex)
const RSI_ARROW_IDS = [571, 572, 573, 574];

// 577-580: MACD with arrows
const MACD_ARROW_IDS = [577, 578, 579, 580];

// 599, 600: Complex arrow signals
const ARROW_SIGNAL_IDS = [599, 600];

/**
 * Build the complete strategy registry
 */
function buildRegistry(): Map<number, StrategyConfig> {
  const registry = new Map<number, StrategyConfig>();

  // Helper to add multiple IDs with same config
  const addGroup = (
    ids: number[],
    shapeType: ShapeType,
    name: string,
    pointCount: number,
    colors = DEFAULT_COLORS,
    options?: Record<string, unknown>
  ) => {
    ids.forEach(id => {
      registry.set(id, {
        id,
        name: `${name} (${id})`,
        shapeType,
        pointCount,
        colors,
        options,
      });
    });
  };

  // ============ INDICATORS ============

  // Ichimoku (1-30, 496-497)
  addGroup(ICHIMOKU_IDS, 'indicator_IchimokuCloud', 'Ichimoku Cloud', 0, INDICATOR_COLORS);

  // SMA - with Length in options (capital L for TradingView)
  addGroup(SMA10_IDS, 'indicator_MASimple', 'SMA 10', 0, INDICATOR_COLORS, { Length: 10 });
  addGroup(SMA20_IDS, 'indicator_MASimple', 'SMA 20', 0, INDICATOR_COLORS, { Length: 20 });
  addGroup(SMA50_IDS, 'indicator_MASimple', 'SMA 50', 0, INDICATOR_COLORS, { Length: 50 });
  addGroup(SMA100_IDS, 'indicator_MASimple', 'SMA 100', 0, INDICATOR_COLORS, { Length: 100 });
  addGroup(SMA200_IDS, 'indicator_MASimple', 'SMA 200', 0, INDICATOR_COLORS, { Length: 200 });

  // WMA - with Length in options (capital L for TradingView)
  addGroup(WMA10_IDS, 'indicator_MAWeighted', 'WMA 10', 0, INDICATOR_COLORS, { Length: 10 });
  addGroup(WMA20_IDS, 'indicator_MAWeighted', 'WMA 20', 0, INDICATOR_COLORS, { Length: 20 });
  addGroup(WMA50_IDS, 'indicator_MAWeighted', 'WMA 50', 0, INDICATOR_COLORS, { Length: 50 });
  addGroup(WMA100_IDS, 'indicator_MAWeighted', 'WMA 100', 0, INDICATOR_COLORS, { Length: 100 });
  addGroup(WMA200_IDS, 'indicator_MAWeighted', 'WMA 200', 0, INDICATOR_COLORS, { Length: 200 });

  // EMA - with Length in options (capital L for TradingView)
  addGroup(EMA10_IDS, 'indicator_MAExponential', 'EMA 10', 0, INDICATOR_COLORS, { Length: 10 });
  addGroup(EMA20_IDS, 'indicator_MAExponential', 'EMA 20', 0, INDICATOR_COLORS, { Length: 20 });
  addGroup(EMA50_IDS, 'indicator_MAExponential', 'EMA 50', 0, INDICATOR_COLORS, { Length: 50 });
  addGroup(EMA100_IDS, 'indicator_MAExponential', 'EMA 100', 0, INDICATOR_COLORS, { Length: 100 });
  addGroup(EMA200_IDS, 'indicator_MAExponential', 'EMA 200', 0, INDICATOR_COLORS, { Length: 200 });

  // ============ MA CROSS STRATEGIES ============
  // Each draws 2 moving averages

  // Helper for MA cross strategies
  const addMACross = (
    id: number,
    name: string,
    ma1Type: 'MASimple' | 'MAWeighted' | 'MAExponential',
    ma1Length: number,
    ma2Type: 'MASimple' | 'MAWeighted' | 'MAExponential',
    ma2Length: number
  ) => {
    registry.set(id, {
      id,
      name,
      shapeType: 'ma_cross',
      pointCount: 0,
      colors: DEFAULT_COLORS,
      options: { ma1Type, ma1Length, ma2Type, ma2Length },
    });
  };

  // SMA Crossover (121-140)
  addMACross(121, 'SMA10 crosses up SMA20', 'MASimple', 10, 'MASimple', 20);
  addMACross(122, 'SMA10 crosses down SMA20', 'MASimple', 10, 'MASimple', 20);
  addMACross(123, 'SMA10 above SMA20', 'MASimple', 10, 'MASimple', 20);
  addMACross(124, 'SMA10 below SMA20', 'MASimple', 10, 'MASimple', 20);
  addMACross(125, 'SMA20 crosses up SMA50', 'MASimple', 20, 'MASimple', 50);
  addMACross(126, 'SMA20 crosses down SMA50', 'MASimple', 20, 'MASimple', 50);
  addMACross(127, 'SMA20 above SMA50', 'MASimple', 20, 'MASimple', 50);
  addMACross(128, 'SMA20 below SMA50', 'MASimple', 20, 'MASimple', 50);
  addMACross(129, 'SMA50 crosses up SMA100', 'MASimple', 50, 'MASimple', 100);
  addMACross(130, 'SMA50 crosses down SMA100', 'MASimple', 50, 'MASimple', 100);
  addMACross(131, 'SMA50 above SMA100', 'MASimple', 50, 'MASimple', 100);
  addMACross(132, 'SMA50 below SMA100', 'MASimple', 50, 'MASimple', 100);
  addMACross(133, 'SMA100 crosses up SMA200', 'MASimple', 100, 'MASimple', 200);
  addMACross(134, 'SMA100 crosses down SMA200', 'MASimple', 100, 'MASimple', 200);
  addMACross(135, 'SMA100 above SMA200', 'MASimple', 100, 'MASimple', 200);
  addMACross(136, 'SMA100 below SMA200', 'MASimple', 100, 'MASimple', 200);
  addMACross(137, 'SMA50 crosses up SMA200', 'MASimple', 50, 'MASimple', 200);
  addMACross(138, 'SMA50 crosses down SMA200', 'MASimple', 50, 'MASimple', 200);
  addMACross(139, 'SMA50 above SMA200', 'MASimple', 50, 'MASimple', 200);
  addMACross(140, 'SMA50 below SMA200', 'MASimple', 50, 'MASimple', 200);

  // WMA Crossover (141-160)
  addMACross(141, 'WMA10 crosses up WMA20', 'MAWeighted', 10, 'MAWeighted', 20);
  addMACross(142, 'WMA10 crosses down WMA20', 'MAWeighted', 10, 'MAWeighted', 20);
  addMACross(143, 'WMA10 above WMA20', 'MAWeighted', 10, 'MAWeighted', 20);
  addMACross(144, 'WMA10 below WMA20', 'MAWeighted', 10, 'MAWeighted', 20);
  addMACross(145, 'WMA20 crosses up WMA50', 'MAWeighted', 20, 'MAWeighted', 50);
  addMACross(146, 'WMA20 crosses down WMA50', 'MAWeighted', 20, 'MAWeighted', 50);
  addMACross(147, 'WMA20 above WMA50', 'MAWeighted', 20, 'MAWeighted', 50);
  addMACross(148, 'WMA20 below WMA50', 'MAWeighted', 20, 'MAWeighted', 50);
  addMACross(149, 'WMA50 crosses up WMA100', 'MAWeighted', 50, 'MAWeighted', 100);
  addMACross(150, 'WMA50 crosses down WMA100', 'MAWeighted', 50, 'MAWeighted', 100);
  addMACross(151, 'WMA50 above WMA100', 'MAWeighted', 50, 'MAWeighted', 100);
  addMACross(152, 'WMA50 below WMA100', 'MAWeighted', 50, 'MAWeighted', 100);
  addMACross(153, 'WMA100 crosses up WMA200', 'MAWeighted', 100, 'MAWeighted', 200);
  addMACross(154, 'WMA100 crosses down WMA200', 'MAWeighted', 100, 'MAWeighted', 200);
  addMACross(155, 'WMA100 above WMA200', 'MAWeighted', 100, 'MAWeighted', 200);
  addMACross(156, 'WMA100 below WMA200', 'MAWeighted', 100, 'MAWeighted', 200);
  addMACross(157, 'WMA50 crosses up WMA200', 'MAWeighted', 50, 'MAWeighted', 200);
  addMACross(158, 'WMA50 crosses down WMA200', 'MAWeighted', 50, 'MAWeighted', 200);
  addMACross(159, 'WMA50 above WMA200', 'MAWeighted', 50, 'MAWeighted', 200);
  addMACross(160, 'WMA50 below WMA200', 'MAWeighted', 50, 'MAWeighted', 200);

  // EMA Crossover (161-180)
  addMACross(161, 'EMA10 crosses up EMA20', 'MAExponential', 10, 'MAExponential', 20);
  addMACross(162, 'EMA10 crosses down EMA20', 'MAExponential', 10, 'MAExponential', 20);
  addMACross(163, 'EMA10 above EMA20', 'MAExponential', 10, 'MAExponential', 20);
  addMACross(164, 'EMA10 below EMA20', 'MAExponential', 10, 'MAExponential', 20);
  addMACross(165, 'EMA20 crosses up EMA50', 'MAExponential', 20, 'MAExponential', 50);
  addMACross(166, 'EMA20 crosses down EMA50', 'MAExponential', 20, 'MAExponential', 50);
  addMACross(167, 'EMA20 above EMA50', 'MAExponential', 20, 'MAExponential', 50);
  addMACross(168, 'EMA20 below EMA50', 'MAExponential', 20, 'MAExponential', 50);
  addMACross(169, 'EMA50 crosses up EMA100', 'MAExponential', 50, 'MAExponential', 100);
  addMACross(170, 'EMA50 crosses down EMA100', 'MAExponential', 50, 'MAExponential', 100);
  addMACross(171, 'EMA50 above EMA100', 'MAExponential', 50, 'MAExponential', 100);
  addMACross(172, 'EMA50 below EMA100', 'MAExponential', 50, 'MAExponential', 100);
  addMACross(173, 'EMA100 crosses up EMA200', 'MAExponential', 100, 'MAExponential', 200);
  addMACross(174, 'EMA100 crosses down EMA200', 'MAExponential', 100, 'MAExponential', 200);
  addMACross(175, 'EMA100 above EMA200', 'MAExponential', 100, 'MAExponential', 200);
  addMACross(176, 'EMA100 below EMA200', 'MAExponential', 100, 'MAExponential', 200);
  addMACross(177, 'EMA50 crosses up EMA200', 'MAExponential', 50, 'MAExponential', 200);
  addMACross(178, 'EMA50 crosses down EMA200', 'MAExponential', 50, 'MAExponential', 200);
  addMACross(179, 'EMA50 above EMA200', 'MAExponential', 50, 'MAExponential', 200);
  addMACross(180, 'EMA50 below EMA200', 'MAExponential', 50, 'MAExponential', 200);

  // RSI Divergence - draws RSI + trend line + entry marker
  addGroup(RSI_DIVERGENCE_IDS, 'rsi_divergence', 'RSI Divergence', 2, INDICATOR_COLORS);

  // RSI Signal - draws RSI + entry marker (no trend line)
  addGroup(RSI_SIGNAL_IDS, 'rsi_signal', 'RSI Signal', 0, INDICATOR_COLORS);

  // MACD (just indicator)
  addGroup(MACD_IDS, 'indicator_MACD', 'MACD', 0, INDICATOR_COLORS);

  // MACD Divergence - draws MACD + trend lines on price chart (p1,p2) and MACD pane (p3,p4)
  addGroup(MACD_DIVERGENCE_IDS, 'macd_divergence', 'MACD Divergence', 4, INDICATOR_COLORS);

  // Volume - with length in options
  addGroup(VOLUME_10_IDS, 'indicator_Volume', 'Volume 10', 0, INDICATOR_COLORS, { 'MA Length': 10 });
  addGroup(VOLUME_20_IDS, 'indicator_Volume', 'Volume 20', 0, INDICATOR_COLORS, { 'MA Length': 20 });
  addGroup(VOLUME_50_IDS, 'indicator_Volume', 'Volume 50', 0, INDICATOR_COLORS, { 'MA Length': 50 });

  // ============ SHAPES ============

  // Signal only (181-214)
  addGroup(SIGNAL_ONLY_IDS, 'vertical_line', 'Signal', 0, DEFAULT_COLORS);

  // Fib Pattern (293, 294)
  addGroup(FIB_PATTERN_IDS, 'fib_retracement', 'Fibonacci Pattern', 4, FIB_COLORS);

  // Zones (295, 296) - uses z1p/z1t format
  addGroup(ZONE_IDS, 'rectangle', 'Zone', 2, ZONE_COLORS);

  // Three Drives (301, 302)
  addGroup(THREE_DRIVES_IDS, 'three_drives', 'Three Drives', 7, DEFAULT_COLORS);

  // 3 Divers Pattern (303-306)
  addGroup(THREE_DIVERS_IDS, '3divers_pattern', '3 Divers', 6, DEFAULT_COLORS);

  // Rectangles (310-319, 330-331)
  addGroup(RECTANGLE_IDS, 'rectangle', 'Support/Resistance', 2, ZONE_COLORS);

  // Double Rectangle (324-327) - draws 2 rectangles
  addGroup(DOUBLE_RECT_IDS, 'rectangle', 'Double Zone', 4, ZONE_COLORS);

  // Trend Lines (332-339)
  addGroup(TREND_LINE_IDS, 'trend_line', 'Trend Line', 2, DEFAULT_COLORS);

  // Channels (342-361)
  addGroup(CHANNEL_IDS, 'parallel_channel', 'Channel', 3, CHANNEL_COLORS);

  // Triangle (364-407)
  addGroup(TRIANGLE_IDS, 'triangle', 'Triangle', 4, DEFAULT_COLORS);

  // Fib with arrows (408-433)
  addGroup(FIB_ARROW_EVEN_IDS, 'fib_retracement', 'Fib Retracement', 3, FIB_COLORS);
  addGroup(FIB_ARROW_ODD_IDS, 'fib_retracement', 'Fib Retracement', 3, FIB_COLORS);

  // ABCD Pattern (464-465)
  addGroup(ABCD_IDS, 'abcd_pattern', 'ABCD', 4, DEFAULT_COLORS);

  // XABCD Pattern (466-487)
  addGroup(XABCD_IDS, 'xabcd_pattern', 'XABCD', 5, DEFAULT_COLORS);

  // 3 Divers variant (488-495)
  addGroup(THREE_DIVERS_2_IDS, '3divers_pattern', '3 Divers', 7, DEFAULT_COLORS);

  // Rectangle + Balloon (498, 499, 519, 520)
  addGroup(RECT_BALLOON_IDS, 'rectangle', 'Order Block', 2, ZONE_COLORS);

  // Complex arrow pattern (501-504)
  addGroup(COMPLEX_ARROW_IDS, 'trend_line', 'Complex Signal', 10, DEFAULT_COLORS);

  // Head and Shoulders (505, 506)
  addGroup(HEAD_SHOULDERS_IDS, 'head_and_shoulders', 'Head & Shoulders', 7, DEFAULT_COLORS);

  // RSI with arrows (571-574)
  addGroup(RSI_ARROW_IDS, 'indicator_RSI', 'RSI Divergence', 0, INDICATOR_COLORS);

  // MACD with arrows (577-580)
  addGroup(MACD_ARROW_IDS, 'indicator_MACD', 'MACD Divergence', 0, INDICATOR_COLORS);

  // Arrow signals (599, 600)
  addGroup(ARROW_SIGNAL_IDS, 'trend_line', 'Trend Signal', 6, DEFAULT_COLORS);

  return registry;
}

/**
 * The built-in strategy registry
 */
export const BUILT_IN_STRATEGIES: Map<number, StrategyConfig> = buildRegistry();

/**
 * Get strategy config by ID
 * Returns null if not found
 */
export function getBuiltInStrategy(strategyId: number): StrategyConfig | null {
  return BUILT_IN_STRATEGIES.get(strategyId) || null;
}

/**
 * Auto-detect shape type based on point count in payload
 * Used as fallback when strategy_id is not in registry
 */
export function autoDetectShapeType(pointCount: number): ShapeType {
  switch (pointCount) {
    case 0:
    case 1:
      return 'vertical_line';
    case 2:
      return 'trend_line';
    case 3:
      return 'parallel_channel';
    case 4:
      return 'abcd_pattern';
    case 5:
      return 'xabcd_pattern';
    default:
      return 'trend_line';
  }
}

/**
 * Create a strategy config for unknown strategy_id
 * Uses auto-detection based on point count
 */
export function createAutoStrategy(strategyId: number, pointCount: number): StrategyConfig {
  const shapeType = autoDetectShapeType(pointCount);
  return {
    id: strategyId,
    name: `Auto Strategy ${strategyId}`,
    shapeType,
    pointCount,
    colors: DEFAULT_COLORS,
  };
}

/**
 * Get all registered strategy IDs
 */
export function getRegisteredStrategyIds(): number[] {
  return Array.from(BUILT_IN_STRATEGIES.keys());
}

/**
 * Check if strategy ID is registered
 */
export function isStrategyRegistered(strategyId: number): boolean {
  return BUILT_IN_STRATEGIES.has(strategyId);
}
