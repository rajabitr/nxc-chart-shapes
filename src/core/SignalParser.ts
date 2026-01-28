import type { APISignal, ShapeResult, StrategyConfig, StrategyRegistry } from '../types';
import { getStrategy, createEntryMarkerShape } from '../strategies';
import { extractEntryMarker, extractPoints } from '../utils/points';
import { getBuiltInStrategy, createAutoStrategy } from '../config';

/**
 * Parses API signals into drawable shape results
 */
export class SignalParser {
  private strategies: StrategyRegistry;

  constructor(strategies: StrategyRegistry = {}) {
    this.strategies = strategies;
  }

  /**
   * Update strategy registry
   */
  setStrategies(strategies: StrategyRegistry): void {
    this.strategies = strategies;
  }

  /**
   * Register a single strategy
   */
  registerStrategy(id: number, config: StrategyConfig): void {
    this.strategies[id] = config;
  }

  /**
   * Parse a single signal into shape result(s)
   */
  parse(signal: APISignal, showEntryMarker = true): ShapeResult[] {
    const results: ShapeResult[] = [];

    console.log('[NXCChartShapes] Parsing signal:', signal.signal_id, 'strategy_id:', signal.strategy_id);

    // Get strategy config for this signal
    // Priority: 1. User-defined strategies, 2. Built-in strategies, 3. Auto-detect
    let config: StrategyConfig | null = this.strategies[signal.strategy_id] || null;
    console.log('[NXCChartShapes] User-defined config:', config ? config.shapeType : 'null');

    if (!config) {
      // Try built-in registry
      config = getBuiltInStrategy(signal.strategy_id);
      console.log('[NXCChartShapes] Built-in config:', config ? config.shapeType : 'null');
    }

    if (!config) {
      // Auto-detect based on point count
      const points = extractPoints(signal.payload);
      config = createAutoStrategy(signal.strategy_id, points.length);
      console.warn(
        `[NXCChartShapes] Auto-detected strategy for ${signal.strategy_id}: ${config.shapeType} (${points.length} points)`
      );
    } else {
      console.log('[NXCChartShapes] Using strategy:', config.shapeType, 'for strategy_id:', signal.strategy_id);
    }

    // Get the strategy implementation for this shape type
    const strategy = getStrategy(config.shapeType);
    if (!strategy) {
      console.warn(
        `[NXCChartShapes] No strategy implementation for shape type: ${config.shapeType}`
      );
      return results;
    }

    // Parse the signal using the strategy
    const shapeResult = strategy.parse(signal, config);
    if (shapeResult) {
      // Handle both single result and array of results (for composite patterns)
      if (Array.isArray(shapeResult)) {
        results.push(...shapeResult);
      } else {
        results.push(shapeResult);
      }
    }

    // Add entry marker if requested (and not already the primary shape)
    if (showEntryMarker && config.shapeType !== 'arrow' && config.shapeType !== 'icon') {
      const entryMarker = extractEntryMarker(signal.payload, signal.close_price);
      if (entryMarker.time && !isNaN(entryMarker.price)) {
        results.push(createEntryMarkerShape(signal, entryMarker));
      }
    }

    return results;
  }

  /**
   * Parse multiple signals
   */
  parseAll(signals: APISignal[], showEntryMarker = true): ShapeResult[] {
    const results: ShapeResult[] = [];

    for (const signal of signals) {
      const shapeResults = this.parse(signal, showEntryMarker);
      results.push(...shapeResults);
    }

    return results;
  }

  /**
   * Check if a strategy is configured for a signal
   * Always returns true now (auto-detection as fallback)
   */
  hasStrategy(strategyId: number): boolean {
    return strategyId in this.strategies || getBuiltInStrategy(strategyId) !== null || true;
  }

  /**
   * Get strategy config by ID
   */
  getStrategyConfig(strategyId: number): StrategyConfig | undefined {
    return this.strategies[strategyId] || getBuiltInStrategy(strategyId) || undefined;
  }

  /**
   * Get all registered strategy IDs
   */
  getRegisteredStrategyIds(): number[] {
    return Object.keys(this.strategies).map(Number);
  }
}
