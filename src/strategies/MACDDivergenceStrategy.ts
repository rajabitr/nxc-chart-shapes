import type { APISignal, ChartPoint, IStrategy, ShapeResult, StrategyConfig } from '../types';
import { extractEntryMarker } from '../utils/points';

/**
 * Extract points for price chart (p1, p2) and MACD pane (p3, p4) from payload
 */
function extractDivergencePoints(payload: Record<string, unknown>): {
  pricePoints: ChartPoint[];
  macdPoints: ChartPoint[];
} {
  const pricePoints: ChartPoint[] = [];
  const macdPoints: ChartPoint[] = [];

  // Price chart points: p1, p2
  if (payload.p1p !== undefined && payload.p1t !== undefined) {
    pricePoints.push({
      price: typeof payload.p1p === 'string' ? parseFloat(payload.p1p) : (payload.p1p as number),
      time: (payload.p1t as number) * 1000,
    });
  }
  if (payload.p2p !== undefined && payload.p2t !== undefined) {
    pricePoints.push({
      price: typeof payload.p2p === 'string' ? parseFloat(payload.p2p) : (payload.p2p as number),
      time: (payload.p2t as number) * 1000,
    });
  }

  // MACD pane points: p3, p4
  if (payload.p3p !== undefined && payload.p3t !== undefined) {
    macdPoints.push({
      price: typeof payload.p3p === 'string' ? parseFloat(payload.p3p) : (payload.p3p as number),
      time: (payload.p3t as number) * 1000,
    });
  }
  if (payload.p4p !== undefined && payload.p4t !== undefined) {
    macdPoints.push({
      price: typeof payload.p4p === 'string' ? parseFloat(payload.p4p) : (payload.p4p as number),
      time: (payload.p4t as number) * 1000,
    });
  }

  return { pricePoints, macdPoints };
}

/**
 * Strategy for MACD Divergence signals (289-292)
 * Draws:
 * 1. MACD indicator
 * 2. Trend line on MAIN CHART (p1, p2)
 * 3. Trend line on MACD pane (p3, p4)
 * 4. Entry point marker
 */
export class MACDDivergenceStrategy implements IStrategy {
  getShapeType(): string {
    return 'macd_divergence';
  }

  /**
   * Parse signal - returns MACD indicator + 2 trend lines + entry marker
   */
  parse(signal: APISignal, config: StrategyConfig): ShapeResult[] | null {
    const { pricePoints, macdPoints } = extractDivergencePoints(signal.payload);
    const entryMarker = extractEntryMarker(signal.payload, signal.close_price);
    const isBuy = signal.signal_type === 'B';
    const color = isBuy ? (config.colors?.buy || '#26a69a') : (config.colors?.sell || '#ef5350');

    console.log('[NXCChartShapes] MACDDivergenceStrategy parsing:', {
      signalId: signal.signal_id,
      strategyId: signal.strategy_id,
      pricePoints: pricePoints.length,
      macdPoints: macdPoints.length,
    });

    const results: ShapeResult[] = [];

    // 1. MACD Indicator
    results.push({
      type: 'indicator_MACD',
      points: [],
      overrides: {
        indicatorType: 'MACD',
        indicatorParams: {},
      },
      signalId: `${signal.signal_id}_macd`,
    });

    // 2. Trend line on MAIN CHART (price divergence line: p1 to p2)
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

    // 3. Trend line on MACD pane (MACD divergence line: p3 to p4)
    if (macdPoints.length >= 2) {
      results.push({
        type: 'trend_line',
        points: [macdPoints[0], macdPoints[1]],
        overrides: {
          linecolor: color,
          linewidth: 2,
          linestyle: 0,
          extendLeft: false,
          extendRight: true,
          // Mark this as belonging to MACD pane
          ownerStudyId: 'MACD',
          drawOnStudy: true,
        },
        signalId: `${signal.signal_id}_macd_line`,
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
        text: 'MACD Divergence',
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
