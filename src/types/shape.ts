/**
 * A point on the chart with time and price coordinates
 */
export interface ChartPoint {
  time: number;
  price: number;
}

/**
 * Result of parsing a signal into a drawable shape
 */
export interface ShapeResult {
  /** TradingView shape type (trend_line, rectangle, etc.) */
  type: string;
  /** Points that define the shape */
  points: ChartPoint[];
  /** TradingView shape overrides (colors, styles, etc.) */
  overrides: Record<string, unknown>;
  /** Optional entry marker to show signal point */
  entryMarker?: ChartPoint;
  /** Original signal ID for reference */
  signalId?: string;
}

/**
 * Stored shape reference for cleanup
 */
export interface StoredShape {
  id: string;
  shapeId: unknown;
  signalId: string;
  type: string;
}

/**
 * Shape drawing options
 */
export interface ShapeDrawOptions {
  showEntryMarker?: boolean;
  zOrder?: 'top' | 'bottom' | 'normal';
  lock?: boolean;
  disableSelection?: boolean;
  disableSave?: boolean;
  disableUndo?: boolean;
}
