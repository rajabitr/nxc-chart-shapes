// Import types needed for interfaces in this file
import type { StrategyConfig } from './strategy';
import type { TradingViewWidget } from './tradingview';

// Signal types
export type {
  APISignal,
  SignalPayload,
  ParsedPoint,
} from './signal';

// Shape types
export type {
  ChartPoint,
  ShapeResult,
  StoredShape,
  ShapeDrawOptions,
} from './shape';

// Strategy types
export type {
  SignalColors,
  StrategyConfig,
  ShapeType,
  StrategyRegistry,
  IStrategy,
  PointExtractionResult,
} from './strategy';

// TradingView types
export type {
  TradingViewWidget,
  TradingViewChart,
  TradingViewPoint,
  TradingViewShapeOptions,
  TradingViewShapeId,
  TradingViewShapeInfo,
  TradingViewShapeApi,
  TradingViewWidgetOptions,
} from './tradingview';

/**
 * NXCChartShapes configuration options
 */
export interface NXCOptions {
  /** Theme for default colors */
  theme?: 'light' | 'dark';
  /** Whether to show entry marker on signals */
  showEntryMarker?: boolean;
  /** Custom strategy configurations */
  strategies?: Record<number, StrategyConfig>;
  /** Lock shapes from editing */
  lockShapes?: boolean;
  /** Disable shape selection */
  disableSelection?: boolean;
}

/**
 * Combined options for widget factory
 */
export interface CreateChartOptions extends NXCOptions {
  container: HTMLElement | string;
  symbol: string;
  interval: string;
  datafeed: unknown;
  libraryPath?: string;
  locale?: string;
  timezone?: string;
  autosize?: boolean;
  fullscreen?: boolean;
  disabledFeatures?: string[];
  enabledFeatures?: string[];
  overrides?: Record<string, unknown>;
  customCssUrl?: string;
}

/**
 * Result from createChart factory
 */
export interface CreateChartResult {
  widget: TradingViewWidget;
  shapes: import('../core/ShapeManager').ShapeManager;
}
