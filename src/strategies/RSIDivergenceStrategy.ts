import type { APISignal, ChartPoint, IStrategy, ShapeResult, StrategyConfig } from '../types';
import { extractPoints, extractEntryMarker } from '../utils/points';

/**
 * Extract RSI-specific points from payload
 * Supports two formats:
 * 1. rsi_p1p, rsi_p1t, rsi_p2p, rsi_p2t (preferred)
 * 2. p3p, p3t, p4p, p4t (fallback - RSI values stored as points 3 and 4)
 */
function extractRSIPoints(payload: Record<string, unknown>): ChartPoint[] {
  const points: ChartPoint[] = [];

  // Try rsi_p1, rsi_p2 format first
  let i = 1;
  while (payload[`rsi_p${i}p`] !== undefined && payload[`rsi_p${i}t`] !== undefined) {
    const price = payload[`rsi_p${i}p`];
    const time = payload[`rsi_p${i}t`];

    if (price !== undefined && time !== undefined) {
      points.push({
        price: typeof price === 'string' ? parseFloat(price) : (price as number),
        time: (time as number) * 1000, // Convert to milliseconds
      });
    }
    i++;
  }

  // If no rsi_p points found, try p3, p4 format (RSI values stored as points 3,4)
  if (points.length === 0) {
    for (let j = 3; j <= 4; j++) {
      const price = payload[`p${j}p`];
      const time = payload[`p${j}t`];

      if (price !== undefined && time !== undefined) {
        points.push({
          price: typeof price === 'string' ? parseFloat(price) : (price as number),
          time: (time as number) * 1000, // Convert to milliseconds
        });
      }
    }
  }

  return points;
}

/**
 * Strategy for RSI Divergence signals (215-220, 277-278)
 * Draws:
 * 1. RSI indicator
 * 2. Trend line on MAIN CHART (p1, p2)
 * 3. Trend line on RSI pane (rsi_p1, rsi_p2)
 * 4. Entry point marker
 */
export class RSIDivergenceStrategy implements IStrategy {
  getShapeType(): string {
    return 'rsi_divergence';
  }

  /**
   * Parse signal - returns RSI indicator + 2 trend lines + entry marker
   */
  parse(signal: APISignal, config: StrategyConfig): ShapeResult[] | null {
    const allPoints = extractPoints(signal.payload); // All points (p1, p2, p3, p4, ...)
    // Only use first 2 points for price chart line
    const pricePoints = allPoints.slice(0, 2);
    // Get RSI-specific points (rsi_p1, rsi_p2 OR p3, p4)
    const rsiPoints = extractRSIPoints(signal.payload);
    const entryMarker = extractEntryMarker(signal.payload, signal.close_price);
    const isBuy = signal.signal_type === 'B';
    const color = isBuy ? (config.colors?.buy || '#26a69a') : (config.colors?.sell || '#ef5350');

    console.log('[NXCChartShapes] RSIDivergenceStrategy parsing:', {
      signalId: signal.signal_id,
      strategyId: signal.strategy_id,
      pricePoints: pricePoints.length,
      rsiPoints: rsiPoints.length,
      allPoints: allPoints.length,
    });

    const results: ShapeResult[] = [];

    // 1. RSI Indicator
    results.push({
      type: 'indicator_RSI',
      points: [],
      overrides: {
        indicatorType: 'RSI',
        indicatorParams: { Length: 14 },
      },
      signalId: `${signal.signal_id}_rsi`,
    });

    // 2. Trend line on MAIN CHART (price divergence line)
    if (pricePoints.length >= 2) {
      results.push({
        type: 'trend_line',
        points: [pricePoints[0], pricePoints[1]],
        overrides: {
          linecolor: color,
          linewidth: 2,
          linestyle: 0,
          extendLeft: false,
          extendRight: true,
          showLabel: false,
        },
        signalId: `${signal.signal_id}_price_line`,
      });
    }

    // 3. Trend line on RSI pane (RSI divergence line)
    if (rsiPoints.length >= 2) {
      results.push({
        type: 'trend_line',
        points: [rsiPoints[0], rsiPoints[1]],
        overrides: {
          linecolor: color,
          linewidth: 2,
          linestyle: 0,
          extendLeft: false,
          extendRight: true,
          // Mark this as belonging to RSI pane
          ownerStudyId: 'RSI',
          drawOnStudy: true,
        },
        signalId: `${signal.signal_id}_rsi_line`,
      });
    } else if (pricePoints.length >= 2) {
      // Fallback: if no RSI points, draw the price points on RSI pane
      results.push({
        type: 'trend_line',
        points: [pricePoints[0], pricePoints[1]],
        overrides: {
          linecolor: color,
          linewidth: 2,
          linestyle: 0,
          extendLeft: false,
          extendRight: true,
          ownerStudyId: 'RSI',
          drawOnStudy: true,
        },
        signalId: `${signal.signal_id}_rsi_line`,
      });
    }

    // 4. Entry point marker (on main chart)
    results.push({
      type: 'vertical_line',
      points: [entryMarker],
      overrides: {
        linecolor: color,
        linewidth: 2,
        linestyle: 2,
        showLabel: true,
        text: 'RSI Divergence',
      },
      entryMarker,
      signalId: `${signal.signal_id}_entry`,
    });

    return results;
  }

  getOverrides(_signal: APISignal, _config: StrategyConfig): Record<string, unknown> {
    return {};
  }
}

/**
 * Strategy for simple RSI signals (269-276, 575-576)
 * Just draws RSI indicator + entry marker (no trend line)
 */
export class RSISignalStrategy implements IStrategy {
  getShapeType(): string {
    return 'rsi_signal';
  }

  parse(signal: APISignal, config: StrategyConfig): ShapeResult[] | null {
    const entryMarker = extractEntryMarker(signal.payload, signal.close_price);
    const isBuy = signal.signal_type === 'B';
    const color = isBuy ? (config.colors?.buy || '#26a69a') : (config.colors?.sell || '#ef5350');

    const results: ShapeResult[] = [];

    // 1. RSI Indicator
    results.push({
      type: 'indicator_RSI',
      points: [],
      overrides: {
        indicatorType: 'RSI',
        indicatorParams: { Length: 14 },
      },
      signalId: `${signal.signal_id}_rsi`,
    });

    // 2. Entry point marker
    results.push({
      type: 'vertical_line',
      points: [entryMarker],
      overrides: {
        linecolor: color,
        linewidth: 2,
        linestyle: 2,
        showLabel: true,
        text: 'RSI Signal',
      },
      entryMarker,
      signalId: `${signal.signal_id}_entry`,
    });

    return results;
  }

  getOverrides(_signal: APISignal, _config: StrategyConfig): Record<string, unknown> {
    return {};
  }
}
