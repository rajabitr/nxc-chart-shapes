import type {
  CreateChartOptions,
  CreateChartResult,
  TradingViewWidget,
  TradingViewWidgetOptions,
} from '../types';
import { ShapeManager } from './ShapeManager';

// Declare global TradingView namespace
declare global {
  interface Window {
    TradingView?: {
      widget: new (options: TradingViewWidgetOptions) => TradingViewWidget;
    };
  }
}

/**
 * Create a TradingView chart with shapes library attached
 *
 * @param options Combined widget and shapes options
 * @returns Promise resolving to widget and shapes manager
 *
 * @example
 * ```typescript
 * const { widget, shapes } = await createChart({
 *   container: 'chart-container',
 *   symbol: 'BTCUSDT',
 *   interval: '15',
 *   datafeed: myDatafeed,
 *   strategies: { 315: { ... } }
 * });
 *
 * shapes.draw(signals);
 * ```
 */
export async function createChart(options: CreateChartOptions): Promise<CreateChartResult> {
  const {
    // Extract shape options
    theme,
    showEntryMarker,
    strategies,
    lockShapes,
    disableSelection,
    // The rest are widget options
    container,
    symbol,
    interval,
    datafeed,
    libraryPath,
    locale,
    timezone,
    autosize,
    fullscreen,
    disabledFeatures,
    enabledFeatures,
    overrides,
    customCssUrl,
  } = options;

  // Check if TradingView is available
  if (!window.TradingView) {
    throw new Error(
      '[NXCChartShapes] TradingView library not found. Make sure charting_library is loaded.'
    );
  }

  // Create TradingView widget
  const widgetOptions: TradingViewWidgetOptions = {
    container,
    symbol,
    interval,
    datafeed,
    library_path: libraryPath,
    locale: locale ?? 'en',
    timezone: timezone ?? 'Etc/UTC',
    theme: theme === 'dark' ? 'Dark' : 'Light',
    autosize: autosize ?? true,
    fullscreen: fullscreen ?? false,
    disabled_features: disabledFeatures ?? [
      'use_localstorage_for_settings',
      'header_symbol_search',
    ],
    enabled_features: enabledFeatures ?? [],
    overrides: overrides ?? {},
    custom_css_url: customCssUrl,
  };

  const widget = new window.TradingView.widget(widgetOptions);

  // Create shape manager
  const shapes = new ShapeManager({
    theme,
    showEntryMarker,
    strategies,
    lockShapes,
    disableSelection,
  });

  // Attach shapes to widget
  await shapes.attach(widget);

  return { widget, shapes };
}

/**
 * Check if TradingView library is loaded
 */
export function isTradingViewLoaded(): boolean {
  return typeof window !== 'undefined' && !!window.TradingView;
}

/**
 * Wait for TradingView library to load
 */
export function waitForTradingView(timeout = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isTradingViewLoaded()) {
      resolve();
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isTradingViewLoaded()) {
        clearInterval(checkInterval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error('[NXCChartShapes] Timeout waiting for TradingView library'));
      }
    }, 100);
  });
}
