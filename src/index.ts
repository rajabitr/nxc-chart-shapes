/**
 * nxc-chart-shapes
 *
 * TradingView chart shapes library for NexCryptoTrade
 *
 * @example
 * ```typescript
 * import { NXCChartShapes } from 'nxc-chart-shapes';
 *
 * const shapes = new NXCChartShapes({
 *   theme: 'dark',
 *   showEntryMarker: true,
 *   strategies: {
 *     315: {
 *       id: 315,
 *       name: 'Trend Line',
 *       shapeType: 'trend_line',
 *       pointCount: 2,
 *       colors: { buy: '#4caf50', sell: '#f44336' }
 *     }
 *   }
 * });
 *
 * shapes.attach(widget);
 * shapes.draw(signals);
 * ```
 */

// Main class export
export { ShapeManager, ShapeManager as NXCChartShapes } from './core/ShapeManager';

// Core exports
export { SignalParser } from './core/SignalParser';
export { ShapeRenderer } from './core/ShapeRenderer';
export { createChart, isTradingViewLoaded, waitForTradingView } from './core/WidgetFactory';

// Strategy exports
export {
  BaseStrategy,
  TrendLineStrategy,
  HorizontalLineStrategy,
  VerticalLineStrategy,
  ExtendedLineStrategy,
  ChannelStrategy,
  TriangleStrategy,
  ABCDPatternStrategy,
  XABCDPatternStrategy,
  HeadAndShouldersStrategy,
  ThreeDrivesStrategy,
  FibRetracementStrategy,
  FibExtensionStrategy,
  FibTrendExtStrategy,
  ZoneStrategy,
  SupplyDemandZoneStrategy,
  PriceRangeStrategy,
  EntryPointStrategy,
  IconMarkerStrategy,
  BalloonStrategy,
  TextStrategy,
  NoteStrategy,
  getStrategy,
  createStrategyFromConfig,
  isShapeTypeSupported,
  getSupportedShapeTypes,
} from './strategies';

// Config exports (built-in strategies)
export {
  BUILT_IN_STRATEGIES,
  getBuiltInStrategy,
  autoDetectShapeType,
  createAutoStrategy,
  getRegisteredStrategyIds,
  isStrategyRegistered,
} from './config';

// Utility exports
export {
  // Colors
  LIGHT_THEME_COLORS,
  DARK_THEME_COLORS,
  ENTRY_MARKER_COLORS,
  SHAPE_TYPE_COLORS,
  getThemeColors,
  getSignalColor,
  getEntryMarkerColor,
  withOpacity,
  // Points
  extractPoints,
  extractEntryMarker,
  extractAllPoints,
  getParsedPoints,
  validatePointCount,
  getPointByIndex,
  sortPointsByTime,
  sortPointsByPrice,
  calculateCenterPoint,
  // Time
  unixToMs,
  msToUnix,
  timeframeMinToInterval,
  intervalToTimeframeMin,
  getTimeframeDisplayName,
  isValidTimestamp,
  getCandleStart,
  formatTimestamp,
} from './utils';

// Type exports
export type {
  // Signal types
  APISignal,
  SignalPayload,
  ParsedPoint,
  // Shape types
  ChartPoint,
  ShapeResult,
  StoredShape,
  ShapeDrawOptions,
  // Strategy types
  SignalColors,
  StrategyConfig,
  ShapeType,
  StrategyRegistry,
  IStrategy,
  PointExtractionResult,
  // TradingView types
  TradingViewWidget,
  TradingViewChart,
  TradingViewPoint,
  TradingViewShapeOptions,
  TradingViewShapeId,
  TradingViewShapeInfo,
  TradingViewShapeApi,
  TradingViewWidgetOptions,
  // Options types
  NXCOptions,
  CreateChartOptions,
  CreateChartResult,
} from './types';

// Default export for UMD
import { ShapeManager } from './core/ShapeManager';
export default ShapeManager;
