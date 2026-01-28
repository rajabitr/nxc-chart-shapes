import type { APISignal, ChartPoint, StrategyConfig } from '../types';
import { BaseStrategy } from './BaseStrategy';
import { getSignalColor, withOpacity } from '../utils/colors';

/**
 * Strategy for Fibonacci retracement (2 points)
 */
export class FibRetracementStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'fib_retracement';
  }

  getMinPoints(): number {
    return 2;
  }

  protected transformPoints(
    points: ChartPoint[],
    _signal: APISignal,
    _config: StrategyConfig
  ): ChartPoint[] {
    return points.slice(0, 2);
  }

  protected getShapeSpecificOverrides(
    signal: APISignal,
    config: StrategyConfig
  ): Record<string, unknown> {
    const color = getSignalColor(signal.signal_type, config.colors);

    return {
      linecolor: color,
      linewidth: 1,
      showCoeffs: true,
      showPrices: true,
      fillBackground: true,
      transparency: 90,
      extendLines: false,
      horzLabelsAlign: 'right',
      vertLabelsAlign: 'bottom',
      reverse: false,
      coeffsAsPercents: false,
      fibLevelsBasedOnLogScale: false,
      // Standard Fibonacci levels
      level1: 0,
      level2: 0.236,
      level3: 0.382,
      level4: 0.5,
      level5: 0.618,
      level6: 0.786,
      level7: 1,
      level8: 1.272,
      level9: 1.618,
    };
  }
}

/**
 * Strategy for Fibonacci extension (3 points)
 */
export class FibExtensionStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'fib_extension';
  }

  getMinPoints(): number {
    return 3;
  }

  protected transformPoints(
    points: ChartPoint[],
    _signal: APISignal,
    _config: StrategyConfig
  ): ChartPoint[] {
    return points.slice(0, 3);
  }

  protected getShapeSpecificOverrides(
    signal: APISignal,
    config: StrategyConfig
  ): Record<string, unknown> {
    const color = getSignalColor(signal.signal_type, config.colors);

    return {
      linecolor: color,
      linewidth: 1,
      showCoeffs: true,
      showPrices: true,
      fillBackground: true,
      transparency: 90,
      extendLines: false,
      reverse: false,
      // Extension levels
      level1: 0,
      level2: 0.236,
      level3: 0.382,
      level4: 0.5,
      level5: 0.618,
      level6: 1,
      level7: 1.272,
      level8: 1.618,
      level9: 2,
      level10: 2.618,
    };
  }
}

/**
 * Strategy for Fibonacci trend-based extension (3 points)
 */
export class FibTrendExtStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'fib_trend_ext';
  }

  getMinPoints(): number {
    return 3;
  }

  protected transformPoints(
    points: ChartPoint[],
    _signal: APISignal,
    _config: StrategyConfig
  ): ChartPoint[] {
    return points.slice(0, 3);
  }

  protected getShapeSpecificOverrides(
    signal: APISignal,
    config: StrategyConfig
  ): Record<string, unknown> {
    const color = getSignalColor(signal.signal_type, config.colors);

    return {
      linecolor: color,
      linewidth: 1,
      trendline: {
        visible: true,
        color: withOpacity(color, 0.5),
        linewidth: 1,
        linestyle: 2,
      },
      showCoeffs: true,
      showPrices: true,
    };
  }
}
