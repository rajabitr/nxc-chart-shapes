import type { ChartPoint, ShapeResult } from './shape';
import type { APISignal } from './signal';

/**
 * Color configuration for buy/sell signals
 */
export interface SignalColors {
  buy: string;
  sell: string;
}

/**
 * Strategy configuration for a signal type
 */
export interface StrategyConfig {
  /** Unique strategy identifier (matches strategy_id from API) */
  id: number;
  /** Human-readable name */
  name: string;
  /** TradingView shape type to render */
  shapeType: ShapeType;
  /** Number of points this shape requires (0 = only entryPoint) */
  pointCount: number;
  /** Colors for buy/sell signals */
  colors: SignalColors;
  /** Additional shape-specific options */
  options?: Record<string, unknown>;
}

/**
 * Supported TradingView shape types
 */
export type ShapeType =
  | 'trend_line'
  | 'horizontal_line'
  | 'vertical_line'
  | 'parallel_channel'
  | 'rectangle'
  | 'arrow'
  | 'icon'
  | 'fib_retracement'
  | 'fib_extension'
  | 'fib_trend_ext'
  | 'triangle'
  | 'abcd_pattern'
  | 'xabcd_pattern'
  | 'head_and_shoulders'
  | 'three_drives'
  | '3divers_pattern'
  | 'extended_line'
  | 'callout'
  | 'balloon'
  | 'text'
  | 'note'
  // MA Cross type (draws 2 MAs)
  | 'ma_cross'
  // RSI types
  | 'rsi_divergence'
  | 'rsi_signal'
  // MACD types
  | 'macd_divergence'
  // Indicator types
  | 'indicator_IchimokuCloud'
  | 'indicator_MASimple'
  | 'indicator_MAWeighted'
  | 'indicator_MAExponential'
  | 'indicator_RSI'
  | 'indicator_MACD'
  | 'indicator_Volume';

/**
 * Strategy registry type
 */
export type StrategyRegistry = Record<number, StrategyConfig>;

/**
 * Strategy interface for shape rendering
 */
export interface IStrategy {
  /** Get the TradingView shape type */
  getShapeType(): string;

  /** Parse signal into shape result (can return multiple shapes for composite patterns) */
  parse(signal: APISignal, config: StrategyConfig): ShapeResult | ShapeResult[] | null;

  /** Get default overrides for this shape type */
  getOverrides(signal: APISignal, config: StrategyConfig): Record<string, unknown>;
}

/**
 * Point extraction result
 */
export interface PointExtractionResult {
  points: ChartPoint[];
  entryMarker: ChartPoint;
}
