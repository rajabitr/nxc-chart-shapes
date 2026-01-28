/**
 * TradingView Widget interface (partial)
 * Only includes methods used by this library
 */
export interface TradingViewWidget {
  onChartReady(callback: () => void): void;
  activeChart(): TradingViewChart;
  remove(): void;
}

/**
 * TradingView Chart interface (partial)
 */
export interface TradingViewChart {
  createMultipointShape(
    points: TradingViewPoint[],
    options: TradingViewShapeOptions
  ): TradingViewShapeId | null;

  createShape(
    point: TradingViewPoint,
    options: TradingViewShapeOptions
  ): TradingViewShapeId | null;

  createStudy(
    name: string,
    forceOverlay?: boolean,
    lock?: boolean,
    inputs?: unknown[] | Record<string, unknown>,
    overrides?: Record<string, unknown>,
    options?: CreateStudyOptions
  ): Promise<TradingViewShapeId | null>;

  removeEntity(entityId: TradingViewShapeId): void;

  removeAllShapes(): void;

  removeAllStudies(): void;

  getAllShapes(): TradingViewShapeInfo[];

  getShapeById(id: TradingViewShapeId): TradingViewShapeApi | null;
}

/**
 * Options for createStudy
 */
export interface CreateStudyOptions {
  checkLimit?: boolean;
  priceScale?: 'as-series' | 'no-scale' | string;
}

/**
 * TradingView point format
 */
export interface TradingViewPoint {
  time: number;
  price: number;
}

/**
 * TradingView shape creation options
 */
export interface TradingViewShapeOptions {
  shape: string;
  text?: string;
  lock?: boolean;
  disableSelection?: boolean;
  disableSave?: boolean;
  disableUndo?: boolean;
  overrides?: Record<string, unknown>;
  zOrder?: 'top' | 'bottom' | 'normal';
}

/**
 * TradingView shape ID (opaque type)
 */
export type TradingViewShapeId = unknown;

/**
 * TradingView shape info from getAllShapes
 */
export interface TradingViewShapeInfo {
  id: TradingViewShapeId;
  name: string;
}

/**
 * TradingView shape API for manipulation
 */
export interface TradingViewShapeApi {
  setPoints(points: TradingViewPoint[]): void;
  getPoints(): TradingViewPoint[];
  setProperties(properties: Record<string, unknown>): void;
  getProperties(): Record<string, unknown>;
}

/**
 * TradingView widget options for factory
 */
export interface TradingViewWidgetOptions {
  container: HTMLElement | string;
  symbol: string;
  interval: string;
  datafeed: unknown;
  library_path?: string;
  locale?: string;
  timezone?: string;
  theme?: 'Light' | 'Dark';
  autosize?: boolean;
  fullscreen?: boolean;
  disabled_features?: string[];
  enabled_features?: string[];
  overrides?: Record<string, unknown>;
  studies_overrides?: Record<string, unknown>;
  custom_css_url?: string;
}
