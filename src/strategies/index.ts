import type { IStrategy, ShapeType, StrategyConfig } from '../types';

// Strategy implementations
export { BaseStrategy } from './BaseStrategy';
export {
  TrendLineStrategy,
  HorizontalLineStrategy,
  VerticalLineStrategy,
  ExtendedLineStrategy,
} from './TrendLineStrategy';
export { ChannelStrategy, TriangleStrategy } from './ChannelStrategy';
export {
  ABCDPatternStrategy,
  XABCDPatternStrategy,
  HeadAndShouldersStrategy,
  ThreeDrivesStrategy,
} from './PatternStrategy';
export {
  FibRetracementStrategy,
  FibExtensionStrategy,
  FibTrendExtStrategy,
} from './FibonacciStrategy';
export {
  ZoneStrategy,
  SupplyDemandZoneStrategy,
  PriceRangeStrategy,
} from './ZoneStrategy';
export {
  EntryPointStrategy,
  IconMarkerStrategy,
  createEntryMarkerShape,
} from './EntryPointStrategy';
export {
  BalloonStrategy,
  TextStrategy,
  NoteStrategy,
} from './BalloonStrategy';
export { ThreeDiversStrategy } from './ThreeDiversStrategy';
export { MACrossStrategy } from './MACrossStrategy';
export { RSIDivergenceStrategy, RSISignalStrategy } from './RSIDivergenceStrategy';
export { MACDDivergenceStrategy } from './MACDDivergenceStrategy';
export {
  IndicatorStrategy,
  IchimokuStrategy,
  SMA10Strategy, SMA20Strategy, SMA50Strategy, SMA100Strategy, SMA200Strategy,
  WMA10Strategy, WMA20Strategy, WMA50Strategy, WMA100Strategy, WMA200Strategy,
  EMA10Strategy, EMA20Strategy, EMA50Strategy, EMA100Strategy, EMA200Strategy,
  RSIStrategy,
  MACDStrategy,
} from './IndicatorStrategy';

// Import all strategy classes for registry
import { TrendLineStrategy, HorizontalLineStrategy, VerticalLineStrategy, ExtendedLineStrategy } from './TrendLineStrategy';
import { ChannelStrategy, TriangleStrategy } from './ChannelStrategy';
import { ABCDPatternStrategy, XABCDPatternStrategy, HeadAndShouldersStrategy, ThreeDrivesStrategy } from './PatternStrategy';
import { FibRetracementStrategy, FibExtensionStrategy, FibTrendExtStrategy } from './FibonacciStrategy';
import { ZoneStrategy, SupplyDemandZoneStrategy, PriceRangeStrategy } from './ZoneStrategy';
import { EntryPointStrategy, IconMarkerStrategy } from './EntryPointStrategy';
import { BalloonStrategy, TextStrategy, NoteStrategy } from './BalloonStrategy';
import { ThreeDiversStrategy } from './ThreeDiversStrategy';
import { MACrossStrategy } from './MACrossStrategy';
import { RSIDivergenceStrategy, RSISignalStrategy } from './RSIDivergenceStrategy';
import { MACDDivergenceStrategy } from './MACDDivergenceStrategy';
import {
  IndicatorStrategy,
  IchimokuStrategy,
  SMA10Strategy, SMA20Strategy, SMA50Strategy, SMA100Strategy, SMA200Strategy,
  WMA10Strategy, WMA20Strategy, WMA50Strategy, WMA100Strategy, WMA200Strategy,
  EMA10Strategy, EMA20Strategy, EMA50Strategy, EMA100Strategy, EMA200Strategy,
  RSIStrategy,
  MACDStrategy,
} from './IndicatorStrategy';

/**
 * Map of shape types to strategy class constructors
 */
const strategyClassMap: Partial<Record<ShapeType, new () => IStrategy>> = {
  trend_line: TrendLineStrategy,
  horizontal_line: HorizontalLineStrategy,
  vertical_line: VerticalLineStrategy,
  extended_line: ExtendedLineStrategy,
  parallel_channel: ChannelStrategy,
  rectangle: ZoneStrategy,
  arrow: EntryPointStrategy,
  icon: IconMarkerStrategy,
  fib_retracement: FibRetracementStrategy,
  ma_cross: MACrossStrategy,
  rsi_divergence: RSIDivergenceStrategy,
  rsi_signal: RSISignalStrategy,
  macd_divergence: MACDDivergenceStrategy,
  fib_extension: FibExtensionStrategy,
  fib_trend_ext: FibTrendExtStrategy,
  triangle: TriangleStrategy,
  abcd_pattern: ABCDPatternStrategy,
  xabcd_pattern: XABCDPatternStrategy,
  head_and_shoulders: HeadAndShouldersStrategy,
  three_drives: ThreeDrivesStrategy,
  '3divers_pattern': ThreeDiversStrategy,
  callout: BalloonStrategy,
  balloon: BalloonStrategy,
  text: TextStrategy,
  note: NoteStrategy,
};

/**
 * Map of indicator types to pre-instantiated strategy instances
 */
const indicatorInstanceMap: Partial<Record<ShapeType, IStrategy>> = {
  indicator_IchimokuCloud: IchimokuStrategy,
  indicator_MASimple: SMA10Strategy, // Default SMA
  indicator_MAWeighted: WMA10Strategy, // Default WMA
  indicator_MAExponential: EMA10Strategy, // Default EMA
  indicator_RSI: RSIStrategy,
  indicator_MACD: MACDStrategy,
  indicator_Volume: new IndicatorStrategy('Volume'),
};

/**
 * Get strategy instance for a shape type
 */
export function getStrategy(shapeType: ShapeType): IStrategy | null {
  // Check if it's an indicator type (pre-instantiated)
  if (shapeType.startsWith('indicator_')) {
    const instance = indicatorInstanceMap[shapeType];
    if (instance) {
      return instance;
    }
    // Fallback: try to create from the indicator type
    const indicatorType = shapeType.replace('indicator_', '');
    console.warn(`[NXCChartShapes] Creating fallback indicator strategy for: ${indicatorType}`);
    return new IndicatorStrategy(indicatorType as any);
  }

  // Check class-based strategies
  const StrategyClass = strategyClassMap[shapeType];
  if (!StrategyClass) {
    console.warn(`[NXCChartShapes] Unknown shape type: ${shapeType}`);
    return null;
  }
  return new StrategyClass();
}

/**
 * Create strategy instance from config
 */
export function createStrategyFromConfig(config: StrategyConfig): IStrategy | null {
  return getStrategy(config.shapeType);
}

/**
 * Check if shape type is supported
 */
export function isShapeTypeSupported(shapeType: string): shapeType is ShapeType {
  return shapeType in strategyClassMap || shapeType in indicatorInstanceMap || shapeType.startsWith('indicator_');
}

/**
 * Get all supported shape types
 */
export function getSupportedShapeTypes(): ShapeType[] {
  const classTypes = Object.keys(strategyClassMap) as ShapeType[];
  const indicatorTypes = Object.keys(indicatorInstanceMap) as ShapeType[];
  return [...classTypes, ...indicatorTypes];
}
