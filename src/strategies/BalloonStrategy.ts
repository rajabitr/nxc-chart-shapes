import type { APISignal, ChartPoint, ShapeResult, StrategyConfig } from '../types';
import { BaseStrategy } from './BaseStrategy';
import { extractEntryMarker } from '../utils/points';
import { getSignalColor } from '../utils/colors';

/**
 * Strategy for balloon/callout markers (1 point with text)
 */
export class BalloonStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'callout';
  }

  getMinPoints(): number {
    return 1;
  }

  parse(signal: APISignal, config: StrategyConfig): ShapeResult | null {
    // Balloon can use either p1 point or entryPoint
    let point: ChartPoint;

    const p1p = signal.payload.p1p;
    const p1t = signal.payload.p1t;

    if (p1p !== undefined && p1t !== undefined) {
      point = {
        price: typeof p1p === 'string' ? parseFloat(p1p) : p1p,
        time: (typeof p1t === 'number' ? p1t : parseFloat(String(p1t))) * 1000,
      };
    } else {
      point = extractEntryMarker(signal.payload, signal.close_price);
    }

    if (!point.time || isNaN(point.price)) {
      return null;
    }

    const overrides = this.getOverrides(signal, config);

    return {
      type: this.getShapeType(),
      points: [point],
      overrides,
      signalId: signal.signal_id,
    };
  }

  protected getShapeSpecificOverrides(
    signal: APISignal,
    config: StrategyConfig
  ): Record<string, unknown> {
    const color = getSignalColor(signal.signal_type, config.colors);

    return {
      backgroundColor: color,
      borderColor: color,
      color: color,
      text: signal.signal_type === 'B' ? 'BUY' : 'SELL',
      fontsize: 14,
      bold: true,
      wordWrap: true,
      wordWrapWidth: 200,
    };
  }
}

/**
 * Strategy for text labels (1 point with text)
 */
export class TextStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'text';
  }

  getMinPoints(): number {
    return 1;
  }

  parse(signal: APISignal, config: StrategyConfig): ShapeResult | null {
    let point: ChartPoint;

    const p1p = signal.payload.p1p;
    const p1t = signal.payload.p1t;

    if (p1p !== undefined && p1t !== undefined) {
      point = {
        price: typeof p1p === 'string' ? parseFloat(p1p) : p1p,
        time: (typeof p1t === 'number' ? p1t : parseFloat(String(p1t))) * 1000,
      };
    } else {
      point = extractEntryMarker(signal.payload, signal.close_price);
    }

    if (!point.time || isNaN(point.price)) {
      return null;
    }

    const overrides = this.getOverrides(signal, config);

    return {
      type: this.getShapeType(),
      points: [point],
      overrides,
      signalId: signal.signal_id,
    };
  }

  protected getShapeSpecificOverrides(
    signal: APISignal,
    config: StrategyConfig
  ): Record<string, unknown> {
    const color = getSignalColor(signal.signal_type, config.colors);

    return {
      color: color,
      text: signal.signal_type === 'B' ? 'BUY Signal' : 'SELL Signal',
      fontsize: 14,
      bold: true,
    };
  }
}

/**
 * Strategy for note/anchored text
 */
export class NoteStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'note';
  }

  getMinPoints(): number {
    return 1;
  }

  parse(signal: APISignal, config: StrategyConfig): ShapeResult | null {
    let point: ChartPoint;

    const p1p = signal.payload.p1p;
    const p1t = signal.payload.p1t;

    if (p1p !== undefined && p1t !== undefined) {
      point = {
        price: typeof p1p === 'string' ? parseFloat(p1p) : p1p,
        time: (typeof p1t === 'number' ? p1t : parseFloat(String(p1t))) * 1000,
      };
    } else {
      point = extractEntryMarker(signal.payload, signal.close_price);
    }

    if (!point.time || isNaN(point.price)) {
      return null;
    }

    const overrides = this.getOverrides(signal, config);

    return {
      type: this.getShapeType(),
      points: [point],
      overrides,
      signalId: signal.signal_id,
    };
  }

  protected getShapeSpecificOverrides(
    signal: APISignal,
    config: StrategyConfig
  ): Record<string, unknown> {
    const color = getSignalColor(signal.signal_type, config.colors);

    return {
      backgroundColor: color,
      borderColor: color,
      textColor: '#ffffff',
      text: signal.signal_type === 'B' ? 'BUY' : 'SELL',
      fontsize: 12,
      markerColor: color,
    };
  }
}
