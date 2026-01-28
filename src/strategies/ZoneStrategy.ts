import type { APISignal, ChartPoint, StrategyConfig } from '../types';
import { BaseStrategy } from './BaseStrategy';
import { getSignalColor, withOpacity } from '../utils/colors';

/**
 * Strategy for rectangles/zones (2 points)
 */
export class ZoneStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'rectangle';
  }

  getMinPoints(): number {
    return 2;
  }

  protected transformPoints(
    points: ChartPoint[],
    signal: APISignal,
    _config: StrategyConfig
  ): ChartPoint[] {
    // If we only have 2 points, use them as corners
    if (points.length >= 2) {
      return points.slice(0, 2);
    }

    // If only 1 point with zone_range, create rectangle
    if (points.length === 1 && signal.zone_range !== null) {
      const point = points[0];
      const range = signal.zone_range;

      return [
        { time: point.time, price: point.price - range / 2 },
        { time: point.time + 86400000, price: point.price + range / 2 }, // 1 day later
      ];
    }

    return points;
  }

  protected getShapeSpecificOverrides(
    signal: APISignal,
    config: StrategyConfig
  ): Record<string, unknown> {
    const color = getSignalColor(signal.signal_type, config.colors);

    return {
      linecolor: color,
      linewidth: 2,
      linestyle: 0,
      backgroundColor: withOpacity(color, 0.3),
      fillBackground: true,
      extendLeft: false,
      extendRight: true,
      showLabel: false,
    };
  }
}

/**
 * Strategy for supply/demand zones with extended rectangle
 */
export class SupplyDemandZoneStrategy extends ZoneStrategy {
  protected getShapeSpecificOverrides(
    signal: APISignal,
    config: StrategyConfig
  ): Record<string, unknown> {
    const baseOverrides = super.getShapeSpecificOverrides(signal, config);
    const color = getSignalColor(signal.signal_type, config.colors);

    return {
      ...baseOverrides,
      backgroundColor: withOpacity(color, 0.2),
      extendRight: true,
      text: signal.signal_type === 'B' ? 'Demand Zone' : 'Supply Zone',
      showLabel: true,
    };
  }
}

/**
 * Strategy for price range zones with dotted border
 */
export class PriceRangeStrategy extends ZoneStrategy {
  protected getShapeSpecificOverrides(
    signal: APISignal,
    config: StrategyConfig
  ): Record<string, unknown> {
    const baseOverrides = super.getShapeSpecificOverrides(signal, config);

    return {
      ...baseOverrides,
      linestyle: 1, // Dotted
      linewidth: 1,
      extendRight: true,
    };
  }
}
