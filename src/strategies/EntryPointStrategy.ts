import type { APISignal, ChartPoint, ShapeResult, StrategyConfig } from '../types';
import { BaseStrategy } from './BaseStrategy';
import { extractEntryMarker } from '../utils/points';
import { getSignalColor, getEntryMarkerColor } from '../utils/colors';

/**
 * Strategy for entry point markers (vertical line)
 * TradingView's arrow requires 2 points, so we use vertical_line for single-point markers
 */
export class EntryPointStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'vertical_line';
  }

  getMinPoints(): number {
    return 0; // Only uses entryPoint
  }

  parse(signal: APISignal, config: StrategyConfig): ShapeResult | null {
    const entryMarker = extractEntryMarker(signal.payload, signal.close_price);

    if (!entryMarker.time || isNaN(entryMarker.price)) {
      console.warn(
        `[NXCChartShapes] Signal ${signal.signal_id} has invalid entry marker`
      );
      return null;
    }

    const overrides = this.getOverrides(signal, config);

    return {
      type: this.getShapeType(),
      points: [entryMarker],
      overrides,
      entryMarker,
      signalId: signal.signal_id,
    };
  }

  protected getShapeSpecificOverrides(
    signal: APISignal,
    config: StrategyConfig
  ): Record<string, unknown> {
    const color = getSignalColor(signal.signal_type, config.colors);

    return {
      linecolor: color,
      linewidth: 2,
      linestyle: 2, // Dashed
      showLabel: true,
      text: 'Signal Point',
      showTime: true,
      fontsize: 14,
      bold: true,
    };
  }
}

/**
 * Strategy for icon markers
 */
export class IconMarkerStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'icon';
  }

  getMinPoints(): number {
    return 0;
  }

  parse(signal: APISignal, config: StrategyConfig): ShapeResult | null {
    const entryMarker = extractEntryMarker(signal.payload, signal.close_price);

    if (!entryMarker.time || isNaN(entryMarker.price)) {
      return null;
    }

    const overrides = this.getOverrides(signal, config);

    return {
      type: this.getShapeType(),
      points: [entryMarker],
      overrides,
      entryMarker,
      signalId: signal.signal_id,
    };
  }

  protected getShapeSpecificOverrides(
    signal: APISignal,
    config: StrategyConfig
  ): Record<string, unknown> {
    const color = getSignalColor(signal.signal_type, config.colors);
    const isBuy = signal.signal_type === 'B';

    return {
      color: color,
      icon: isBuy ? 0xf062 : 0xf063, // Font Awesome arrow icons
      size: 20,
    };
  }
}

/**
 * Create entry marker shape result (vertical line)
 */
export function createEntryMarkerShape(
  signal: APISignal,
  entryMarker: ChartPoint
): ShapeResult {
  const color = getEntryMarkerColor(signal.signal_type);

  return {
    type: 'vertical_line',
    points: [entryMarker],
    overrides: {
      linecolor: color,
      linewidth: 2,
      linestyle: 2, // Dashed
      showLabel: true,
      text: 'Signal Point',
      showTime: true,
      fontsize: 14,
      bold: true,
    },
    entryMarker,
    signalId: `${signal.signal_id}_entry`,
  };
}
