import type { APISignal, ChartPoint, StrategyConfig } from '../types';
import { BaseStrategy } from './BaseStrategy';
import { getSignalColor, withOpacity } from '../utils/colors';

/**
 * Strategy for parallel channels (3-4 points)
 */
export class ChannelStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'parallel_channel';
  }

  getMinPoints(): number {
    return 3;
  }

  protected transformPoints(
    points: ChartPoint[],
    _signal: APISignal,
    _config: StrategyConfig
  ): ChartPoint[] {
    // Parallel channel needs 3 points minimum:
    // Point 1 and 2 define the first line
    // Point 3 defines the parallel line offset
    if (points.length >= 4) {
      return points.slice(0, 4);
    }
    return points.slice(0, 3);
  }

  protected getShapeSpecificOverrides(
    signal: APISignal,
    config: StrategyConfig
  ): Record<string, unknown> {
    const color = getSignalColor(signal.signal_type, config.colors);

    return {
      linecolor: color,
      linewidth: 3,
      linestyle: 0,
      backgroundColor: withOpacity(color, 0.2),
      fillBackground: true,
      extendLeft: false,
      extendRight: true,
      showMidline: true,
      midlineColor: withOpacity(color, 0.7),
      midlineStyle: 2, // Dashed
      midlineWidth: 1,
    };
  }
}

/**
 * Strategy for triangle patterns (3-4 points)
 */
export class TriangleStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'triangle';
  }

  getMinPoints(): number {
    return 3;
  }

  protected transformPoints(
    points: ChartPoint[],
    _signal: APISignal,
    _config: StrategyConfig
  ): ChartPoint[] {
    // Triangle needs 3 points
    return points.slice(0, 3);
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
      backgroundColor: withOpacity(color, 0.1),
      fillBackground: true,
    };
  }
}
