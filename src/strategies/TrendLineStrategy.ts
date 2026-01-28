import type { APISignal, StrategyConfig } from '../types';
import { BaseStrategy } from './BaseStrategy';
import { getSignalColor } from '../utils/colors';

/**
 * Strategy for trend lines (2 points)
 */
export class TrendLineStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'trend_line';
  }

  getMinPoints(): number {
    return 2;
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
      extendLeft: false,
      extendRight: true,
      showLabel: false,
      showMiddlePoint: false,
      showPriceLabels: true,
    };
  }
}

/**
 * Strategy for horizontal lines (1-2 points)
 */
export class HorizontalLineStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'horizontal_line';
  }

  getMinPoints(): number {
    return 1;
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
      showLabel: true,
      showPrice: true,
      text: signal.signal_type === 'B' ? 'Support' : 'Resistance',
    };
  }
}

/**
 * Strategy for vertical lines (1 point)
 */
export class VerticalLineStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'vertical_line';
  }

  getMinPoints(): number {
    return 1;
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
      showTime: true,
    };
  }
}

/**
 * Strategy for extended lines (trend line that extends)
 */
export class ExtendedLineStrategy extends TrendLineStrategy {
  getShapeType(): string {
    return 'extended_line';
  }

  protected getShapeSpecificOverrides(
    signal: APISignal,
    config: StrategyConfig
  ): Record<string, unknown> {
    const baseOverrides = super.getShapeSpecificOverrides(signal, config);

    return {
      ...baseOverrides,
      extendLeft: false,
      extendRight: true,
    };
  }
}
