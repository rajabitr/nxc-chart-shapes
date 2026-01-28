import type { APISignal, IStrategy, ShapeResult, StrategyConfig } from '../types';
import { extractEntryMarker } from '../utils/points';

/**
 * Indicator types supported by TradingView
 */
export type IndicatorType =
  | 'IchimokuCloud'
  | 'MASimple'
  | 'MAWeighted'
  | 'MAExponential'
  | 'RSI'
  | 'MACD'
  | 'Volume';

/**
 * Strategy for adding indicators to the chart
 * Uses TradingView's createStudy API instead of createShape
 */
export class IndicatorStrategy implements IStrategy {
  private indicatorType: IndicatorType;
  private defaultParams: Record<string, unknown>;

  constructor(indicatorType: IndicatorType, defaultParams: Record<string, unknown> = {}) {
    this.indicatorType = indicatorType;
    this.defaultParams = defaultParams;
  }

  getShapeType(): string {
    return `indicator_${this.indicatorType}`;
  }

  getMinPoints(): number {
    return 0; // Indicators don't need points from payload
  }

  /**
   * Merge default params with config options
   * Config options take priority (e.g., length from strategyRegistry)
   */
  private getIndicatorParams(config: StrategyConfig): Record<string, unknown> {
    // Start with default params from constructor
    const params = { ...this.defaultParams };

    // Override with config.options if present (from strategyRegistry)
    if (config.options) {
      Object.assign(params, config.options);
    }

    return params;
  }

  /**
   * Parse signal - returns indicator info instead of shape
   */
  parse(signal: APISignal, config: StrategyConfig): ShapeResult | null {
    const entryMarker = extractEntryMarker(signal.payload, signal.close_price);
    const indicatorParams = this.getIndicatorParams(config);

    return {
      type: `indicator_${this.indicatorType}`,
      points: [], // No points for indicators
      overrides: {
        indicatorType: this.indicatorType,
        indicatorParams,
      },
      entryMarker,
      signalId: signal.signal_id,
    };
  }

  getOverrides(_signal: APISignal, config: StrategyConfig): Record<string, unknown> {
    return {
      indicatorType: this.indicatorType,
      indicatorParams: this.getIndicatorParams(config),
    };
  }
}

/**
 * Pre-configured indicator strategies
 */
export const IchimokuStrategy = new IndicatorStrategy('IchimokuCloud');

export const SMA10Strategy = new IndicatorStrategy('MASimple', { length: 10 });
export const SMA20Strategy = new IndicatorStrategy('MASimple', { length: 20 });
export const SMA50Strategy = new IndicatorStrategy('MASimple', { length: 50 });
export const SMA100Strategy = new IndicatorStrategy('MASimple', { length: 100 });
export const SMA200Strategy = new IndicatorStrategy('MASimple', { length: 200 });

export const WMA10Strategy = new IndicatorStrategy('MAWeighted', { length: 10 });
export const WMA20Strategy = new IndicatorStrategy('MAWeighted', { length: 20 });
export const WMA50Strategy = new IndicatorStrategy('MAWeighted', { length: 50 });
export const WMA100Strategy = new IndicatorStrategy('MAWeighted', { length: 100 });
export const WMA200Strategy = new IndicatorStrategy('MAWeighted', { length: 200 });

export const EMA10Strategy = new IndicatorStrategy('MAExponential', { length: 10 });
export const EMA20Strategy = new IndicatorStrategy('MAExponential', { length: 20 });
export const EMA50Strategy = new IndicatorStrategy('MAExponential', { length: 50 });
export const EMA100Strategy = new IndicatorStrategy('MAExponential', { length: 100 });
export const EMA200Strategy = new IndicatorStrategy('MAExponential', { length: 200 });

export const RSIStrategy = new IndicatorStrategy('RSI', { length: 14 });
export const MACDStrategy = new IndicatorStrategy('MACD');
