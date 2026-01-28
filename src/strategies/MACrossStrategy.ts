import type { APISignal, IStrategy, ShapeResult, StrategyConfig } from '../types';
import { extractEntryMarker } from '../utils/points';

/**
 * MA Cross configuration - specifies which two MAs to draw
 */
export interface MACrossConfig {
  ma1Type: 'MASimple' | 'MAWeighted' | 'MAExponential';
  ma1Length: number;
  ma2Type: 'MASimple' | 'MAWeighted' | 'MAExponential';
  ma2Length: number;
}

/**
 * Strategy for MA cross signals
 * Draws both moving averages involved in the cross
 */
export class MACrossStrategy implements IStrategy {
  getShapeType(): string {
    return 'ma_cross';
  }

  /**
   * Parse signal - returns 2 indicator ShapeResults for both MAs
   */
  parse(signal: APISignal, config: StrategyConfig): ShapeResult[] | null {
    const entryMarker = extractEntryMarker(signal.payload, signal.close_price);

    // Get MA cross config from strategy options
    const crossConfig = config.options as MACrossConfig | undefined;
    if (!crossConfig) {
      console.warn('[MACrossStrategy] No cross config found for strategy:', config.id);
      return null;
    }

    const results: ShapeResult[] = [];

    // First MA
    results.push({
      type: `indicator_${crossConfig.ma1Type}`,
      points: [],
      overrides: {
        indicatorType: crossConfig.ma1Type,
        indicatorParams: { Length: crossConfig.ma1Length },
      },
      entryMarker,
      signalId: `${signal.signal_id}_ma1`,
    });

    // Second MA
    results.push({
      type: `indicator_${crossConfig.ma2Type}`,
      points: [],
      overrides: {
        indicatorType: crossConfig.ma2Type,
        indicatorParams: { Length: crossConfig.ma2Length },
      },
      signalId: `${signal.signal_id}_ma2`,
    });

    return results;
  }

  getOverrides(_signal: APISignal, _config: StrategyConfig): Record<string, unknown> {
    return {};
  }
}
