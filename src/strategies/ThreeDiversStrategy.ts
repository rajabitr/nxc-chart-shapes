import type { APISignal, ChartPoint, IStrategy, ShapeResult, StrategyConfig } from '../types';
import { extractPoints } from '../utils/points';
import { getSignalColor, withOpacity } from '../utils/colors';

/**
 * Strategy for 3 Divers pattern (strategy_id: 303, 304, 305, 306)
 *
 * This is a composite pattern that draws:
 * 1. 5 trend lines connecting points in zigzag: p1-p2, p2-p3, p3-p4, p4-p5, p5-p6
 * 2. 2 horizontal lines at p3 and p6 prices
 */
export class ThreeDiversStrategy implements IStrategy {
  getShapeType(): string {
    return '3divers_pattern'; // Composite type
  }

  getMinPoints(): number {
    return 6;
  }

  /**
   * Parse signal into multiple shape results
   */
  parse(signal: APISignal, config: StrategyConfig): ShapeResult[] | null {
    const points = extractPoints(signal.payload);

    // Need at least 6 points for this pattern
    if (points.length < 6) {
      console.warn(
        `[NXCChartShapes] 3 Divers pattern requires 6 points, got ${points.length}`
      );
      return null;
    }

    const results: ShapeResult[] = [];
    const color = getSignalColor(signal.signal_type, config.colors);
    const baseSignalId = signal.signal_id;

    // Create 5 trend lines connecting consecutive points (zigzag)
    for (let i = 0; i < 5; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      results.push({
        type: 'trend_line',
        points: [p1, p2],
        overrides: {
          linecolor: color,
          linewidth: 2,
          linestyle: 0, // Solid
          extendLeft: false,
          extendRight: true,
          showLabel: false,
        },
        signalId: `${baseSignalId}_line_${i + 1}`,
      });
    }

    // Create horizontal line at p3 price (point index 2)
    const p3 = points[2];
    const lastPoint = points[points.length - 1];

    results.push({
      type: 'horizontal_line',
      points: [
        { time: p3.time, price: p3.price },
      ],
      overrides: {
        linecolor: withOpacity(color, 0.7),
        linewidth: 1,
        linestyle: 2, // Dashed
        showLabel: false,
        showPrice: true,
      },
      signalId: `${baseSignalId}_hline_1`,
    });

    // Create horizontal line at p6 price (last point)
    const p6 = points[5];
    results.push({
      type: 'horizontal_line',
      points: [
        { time: p6.time, price: p6.price },
      ],
      overrides: {
        linecolor: withOpacity(color, 0.7),
        linewidth: 1,
        linestyle: 2, // Dashed
        showLabel: false,
        showPrice: true,
      },
      signalId: `${baseSignalId}_hline_2`,
    });

    return results;
  }

  /**
   * Get default overrides (used for individual shapes)
   */
  getOverrides(signal: APISignal, config: StrategyConfig): Record<string, unknown> {
    const color = getSignalColor(signal.signal_type, config.colors);
    return {
      linecolor: color,
      linewidth: 2,
      linestyle: 0,
    };
  }
}
