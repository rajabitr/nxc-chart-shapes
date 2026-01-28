import type { APISignal, ChartPoint, IStrategy, ShapeResult, StrategyConfig } from '../types';
import { extractPoints, extractEntryMarker } from '../utils/points';
import { getSignalColor } from '../utils/colors';

/**
 * Abstract base class for shape strategies
 */
export abstract class BaseStrategy implements IStrategy {
  /**
   * Get the TradingView shape type for this strategy
   */
  abstract getShapeType(): string;

  /**
   * Get the minimum number of points required
   */
  abstract getMinPoints(): number;

  /**
   * Parse a signal into a shape result
   */
  parse(signal: APISignal, config: StrategyConfig): ShapeResult | null {
    const points = extractPoints(signal.payload);

    // Validate point count
    if (points.length < this.getMinPoints()) {
      console.warn(
        `[NXCChartShapes] Signal ${signal.signal_id} has ${points.length} points, ` +
        `but ${config.name} requires at least ${this.getMinPoints()}`
      );
      return null;
    }

    const entryMarker = extractEntryMarker(signal.payload, signal.close_price);
    const overrides = this.getOverrides(signal, config);

    return {
      type: this.getShapeType(),
      points: this.transformPoints(points, signal, config),
      overrides,
      entryMarker,
      signalId: signal.signal_id,
    };
  }

  /**
   * Transform points if needed (override in subclasses)
   */
  protected transformPoints(
    points: ChartPoint[],
    _signal: APISignal,
    _config: StrategyConfig
  ): ChartPoint[] {
    return points;
  }

  /**
   * Get default overrides for this shape type
   */
  getOverrides(signal: APISignal, config: StrategyConfig): Record<string, unknown> {
    const color = getSignalColor(signal.signal_type, config.colors);

    return {
      linecolor: color,
      linewidth: 2,
      linestyle: 0, // Solid
      ...this.getShapeSpecificOverrides(signal, config),
    };
  }

  /**
   * Get shape-specific overrides (override in subclasses)
   */
  protected getShapeSpecificOverrides(
    _signal: APISignal,
    _config: StrategyConfig
  ): Record<string, unknown> {
    return {};
  }
}
