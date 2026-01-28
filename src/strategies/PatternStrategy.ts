import type { APISignal, ChartPoint, StrategyConfig } from '../types';
import { BaseStrategy } from './BaseStrategy';
import { getSignalColor } from '../utils/colors';

/**
 * Strategy for ABCD patterns (4 points)
 */
export class ABCDPatternStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'abcd_pattern';
  }

  getMinPoints(): number {
    return 4;
  }

  protected transformPoints(
    points: ChartPoint[],
    _signal: APISignal,
    _config: StrategyConfig
  ): ChartPoint[] {
    return points.slice(0, 4);
  }

  protected getShapeSpecificOverrides(
    signal: APISignal,
    config: StrategyConfig
  ): Record<string, unknown> {
    const color = getSignalColor(signal.signal_type, config.colors);

    return {
      color: color,
      linecolor: color,
      linewidth: 2,
      showLabels: true,
      fontsize: 12,
    };
  }
}

/**
 * Strategy for XABCD patterns (5 points)
 */
export class XABCDPatternStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'xabcd_pattern';
  }

  getMinPoints(): number {
    return 5;
  }

  protected transformPoints(
    points: ChartPoint[],
    _signal: APISignal,
    _config: StrategyConfig
  ): ChartPoint[] {
    return points.slice(0, 5);
  }

  protected getShapeSpecificOverrides(
    signal: APISignal,
    config: StrategyConfig
  ): Record<string, unknown> {
    const color = getSignalColor(signal.signal_type, config.colors);

    return {
      color: color,
      linecolor: color,
      linewidth: 2,
      showLabels: true,
      fontsize: 12,
    };
  }
}

/**
 * Strategy for Head and Shoulders patterns (5+ points)
 */
export class HeadAndShouldersStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'head_and_shoulders';
  }

  getMinPoints(): number {
    return 5;
  }

  protected transformPoints(
    points: ChartPoint[],
    _signal: APISignal,
    _config: StrategyConfig
  ): ChartPoint[] {
    // Head and shoulders needs 5 points:
    // Left shoulder, head, right shoulder + neckline points
    return points.slice(0, 5);
  }

  protected getShapeSpecificOverrides(
    signal: APISignal,
    config: StrategyConfig
  ): Record<string, unknown> {
    const color = getSignalColor(signal.signal_type, config.colors);

    return {
      color: color,
      linecolor: color,
      linewidth: 2,
      showLabels: true,
    };
  }
}

/**
 * Strategy for Three Drives patterns (6 points)
 */
export class ThreeDrivesStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'three_drives';
  }

  getMinPoints(): number {
    return 5;
  }

  protected transformPoints(
    points: ChartPoint[],
    _signal: APISignal,
    _config: StrategyConfig
  ): ChartPoint[] {
    return points.slice(0, 6);
  }

  protected getShapeSpecificOverrides(
    signal: APISignal,
    config: StrategyConfig
  ): Record<string, unknown> {
    const color = getSignalColor(signal.signal_type, config.colors);

    return {
      color: color,
      linecolor: color,
      linewidth: 2,
      showLabels: true,
    };
  }
}
