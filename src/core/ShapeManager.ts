import type {
  APISignal,
  NXCOptions,
  ShapeDrawOptions,
  StrategyConfig,
  StrategyRegistry,
  TradingViewWidget,
} from '../types';
import { SignalParser } from './SignalParser';
import { ShapeRenderer } from './ShapeRenderer';
import { getThemeColors } from '../utils/colors';

/**
 * Main orchestrator for nxc-chart-shapes
 * Manages parsing signals and rendering shapes on TradingView
 */
export class ShapeManager {
  private parser: SignalParser;
  private renderer: ShapeRenderer;
  private options: Required<NXCOptions>;
  private widget: TradingViewWidget | null = null;

  constructor(options: NXCOptions = {}) {
    this.options = {
      theme: options.theme ?? 'dark',
      showEntryMarker: options.showEntryMarker ?? true,
      strategies: options.strategies ?? {},
      lockShapes: options.lockShapes ?? false,
      disableSelection: options.disableSelection ?? true,
    };

    this.parser = new SignalParser(this.options.strategies);
    this.renderer = new ShapeRenderer();
  }

  /**
   * Attach to an existing TradingView widget
   */
  async attach(widget: TradingViewWidget): Promise<void> {
    this.widget = widget;
    await this.renderer.attach(widget);
  }

  /**
   * Check if attached and ready
   */
  isReady(): boolean {
    return this.renderer.ready();
  }

  /**
   * Draw signals on chart (async to handle indicator dependencies)
   */
  async draw(signals: APISignal | APISignal[]): Promise<string[]> {
    if (!this.renderer.ready()) {
      console.warn('[NXCChartShapes] Not attached to a widget');
      return [];
    }

    const signalArray = Array.isArray(signals) ? signals : [signals];

    // Parse signals into shape results
    const shapeResults = this.parser.parseAll(signalArray, this.options.showEntryMarker);

    // Draw options
    const drawOptions: ShapeDrawOptions = {
      lock: this.options.lockShapes,
      disableSelection: this.options.disableSelection,
      disableSave: true,
      disableUndo: true,
      zOrder: 'top',
    };

    // Render shapes (async)
    return this.renderer.drawAll(shapeResults, drawOptions);
  }

  /**
   * Clear all drawn shapes
   */
  clear(): void {
    this.renderer.clear();
  }

  /**
   * Clear all shapes including untracked
   */
  clearAll(): void {
    this.renderer.clearAll();
  }

  /**
   * Remove shapes for a specific signal
   */
  removeSignal(signalId: string): number {
    return this.renderer.removeBySignalId(signalId);
  }

  /**
   * Set theme
   */
  setTheme(theme: 'light' | 'dark'): void {
    this.options.theme = theme;
  }

  /**
   * Register a strategy configuration
   */
  registerStrategy(id: number, config: StrategyConfig): void {
    this.options.strategies[id] = config;
    this.parser.registerStrategy(id, config);
  }

  /**
   * Register multiple strategies
   */
  registerStrategies(strategies: StrategyRegistry): void {
    for (const [id, config] of Object.entries(strategies)) {
      this.registerStrategy(Number(id), config);
    }
  }

  /**
   * Get registered strategy IDs
   */
  getRegisteredStrategies(): number[] {
    return this.parser.getRegisteredStrategyIds();
  }

  /**
   * Check if strategy is registered
   */
  hasStrategy(strategyId: number): boolean {
    return this.parser.hasStrategy(strategyId);
  }

  /**
   * Get shape count
   */
  getShapeCount(): number {
    return this.renderer.getShapeCount();
  }

  /**
   * Update options
   */
  setOptions(options: Partial<NXCOptions>): void {
    if (options.theme !== undefined) {
      this.options.theme = options.theme;
    }
    if (options.showEntryMarker !== undefined) {
      this.options.showEntryMarker = options.showEntryMarker;
    }
    if (options.lockShapes !== undefined) {
      this.options.lockShapes = options.lockShapes;
    }
    if (options.disableSelection !== undefined) {
      this.options.disableSelection = options.disableSelection;
    }
    if (options.strategies) {
      this.registerStrategies(options.strategies);
    }
  }

  /**
   * Destroy and cleanup
   */
  destroy(): void {
    this.renderer.detach();
    this.widget = null;
  }
}

// Export as default alias for UMD compatibility
export default ShapeManager;
