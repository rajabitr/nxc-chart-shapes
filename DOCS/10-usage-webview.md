# استفاده در WebView (موبایل)

## نمای کلی

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Mobile App (iOS/Android)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │                          WebView                                  │  │
│   │   ┌────────────────────────────────────────────────────────────┐ │  │
│   │   │                                                             │ │  │
│   │   │                    HTML + JavaScript                        │ │  │
│   │   │                                                             │ │  │
│   │   │   ┌─────────────────┐    ┌─────────────────┐               │ │  │
│   │   │   │   TradingView   │    │ nxc-chart-shapes│               │ │  │
│   │   │   │     Widget      │◄───│     (UMD)       │               │ │  │
│   │   │   └─────────────────┘    └─────────────────┘               │ │  │
│   │   │                                                             │ │  │
│   │   └────────────────────────────────────────────────────────────┘ │  │
│   │              ▲                                                    │  │
│   │              │                                                    │  │
│   │   window.drawSignals(json)                                        │  │
│   │                                                                   │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│              ▲                                                           │
│              │ JavaScript Bridge                                        │
│              │                                                           │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │                    Native App Code                                │  │
│   │                                                                   │  │
│   │   Signal Data (از API یا Cache)                                   │  │
│   │                                                                   │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## فایل HTML برای WebView

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>NXC Chart</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; overflow: hidden; }
    #chart { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="chart"></div>

  <!-- TradingView Library -->
  <script src="charting_library/charting_library.standalone.js"></script>

  <!-- NXC Chart Shapes (UMD Bundle) -->
  <script src="nxc-chart-shapes.umd.js"></script>

  <script>
    // متغیرهای global
    let tvWidget = null;
    let shapesManager = null;

    // نکته: نیازی به تعریف STRATEGIES نیست!
    // کتابخانه 500+ استراتژی را built-in دارد

    // Datafeed ساده
    const datafeed = {
      onReady: (cb) => setTimeout(() => cb({
        supported_resolutions: ['1', '5', '15', '30', '60', '240', 'D', 'W']
      }), 0),

      resolveSymbol: (name, resolve) => setTimeout(() => resolve({
        name,
        ticker: name,
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        minmov: 1,
        pricescale: 100,
        has_intraday: true,
        supported_resolutions: ['1', '5', '15', '30', '60', '240', 'D', 'W']
      }), 0),

      getBars: async (symbolInfo, resolution, params, onResult) => {
        const interval = {
          '1': '1m', '5': '5m', '15': '15m', '30': '30m',
          '60': '1h', '240': '4h', 'D': '1d', 'W': '1w'
        }[resolution] || '1h';

        try {
          const res = await fetch(
            `https://api.binance.com/api/v3/klines?` +
            `symbol=${symbolInfo.name}&interval=${interval}&` +
            `startTime=${params.from * 1000}&endTime=${params.to * 1000}&limit=1000`
          );
          const data = await res.json();

          onResult(data.map(k => ({
            time: k[0],
            open: +k[1],
            high: +k[2],
            low: +k[3],
            close: +k[4],
            volume: +k[5]
          })));
        } catch (e) {
          onResult([], { noData: true });
        }
      },

      subscribeBars: () => {},
      unsubscribeBars: () => {}
    };

    // Initialize
    function initChart(symbol = 'BTCUSDT', interval = '15') {
      tvWidget = new TradingView.widget({
        container: 'chart',
        symbol,
        interval,
        datafeed,
        library_path: 'charting_library/',
        locale: 'en',
        theme: 'Dark',
        autosize: true,
        disabled_features: [
          'use_localstorage_for_settings',
          'header_symbol_search',
          'header_compare',
          'header_undo_redo',
          'header_screenshot',
          'header_settings'
        ]
      });

      tvWidget.onChartReady(async () => {
        // Strategies are built-in - no need to define!
        shapesManager = new NXCChartShapes.default({
          theme: 'dark',
          showEntryMarker: true
        });

        await shapesManager.attach(tvWidget);

        // اطلاع به native app
        if (window.NativeApp) {
          window.NativeApp.onChartReady();
        }
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // توابعی که از Native App صدا زده می‌شوند
    // ═══════════════════════════════════════════════════════════════

    /**
     * رسم سیگنال‌ها
     * @param {string} jsonSignals - آرایه JSON از سیگنال‌ها
     */
    window.drawSignals = async function(jsonSignals) {
      if (!shapesManager || !shapesManager.isReady()) {
        console.error('Chart not ready');
        return false;
      }

      try {
        const signals = JSON.parse(jsonSignals);
        shapesManager.clear();
        // draw() is async for indicators/divergence
        const ids = await shapesManager.draw(signals);
        return ids.length;
      } catch (e) {
        console.error('Error drawing signals:', e);
        return false;
      }
    };

    /**
     * پاک کردن شکل‌ها
     */
    window.clearShapes = function() {
      if (shapesManager) {
        shapesManager.clear();
        return true;
      }
      return false;
    };

    /**
     * تغییر نماد
     */
    window.changeSymbol = function(symbol) {
      if (tvWidget) {
        tvWidget.activeChart().setSymbol(symbol);
        return true;
      }
      return false;
    };

    /**
     * تغییر timeframe
     */
    window.changeInterval = function(interval) {
      if (tvWidget) {
        tvWidget.activeChart().setResolution(interval);
        return true;
      }
      return false;
    };

    /**
     * ثبت استراتژی جدید
     */
    window.registerStrategy = function(jsonStrategy) {
      try {
        const strategy = JSON.parse(jsonStrategy);
        if (shapesManager) {
          shapesManager.registerStrategy(strategy.id, strategy);
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    };

    // شروع با پارامترهای URL
    const urlParams = new URLSearchParams(window.location.search);
    const symbol = urlParams.get('symbol') || 'BTCUSDT';
    const interval = urlParams.get('interval') || '15';

    initChart(symbol, interval);
  </script>
</body>
</html>
```

## استفاده در iOS (Swift)

```swift
import WebKit

class ChartViewController: UIViewController, WKScriptMessageHandler {

    var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        // Setup WebView
        let config = WKWebViewConfiguration()
        config.userContentController.add(self, name: "NativeApp")

        webView = WKWebView(frame: view.bounds, configuration: config)
        view.addSubview(webView)

        // Load chart
        let url = Bundle.main.url(forResource: "chart", withExtension: "html")!
        webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
    }

    // Receive message from JavaScript
    func userContentController(_ controller: WKUserContentController,
                               didReceive message: WKScriptMessage) {
        if message.name == "NativeApp" {
            if let body = message.body as? String, body == "onChartReady" {
                // Chart is ready, load signals
                loadSignals()
            }
        }
    }

    func loadSignals() {
        // Fetch signals from API
        let signalJson = """
        [{
            "signal_id": "abc123",
            "strategy_id": 315,
            "signal_type": "S",
            "symbol": "BTCUSDT",
            "payload": {
                "p1p": "88013.5",
                "p1t": 1769468699.999,
                "p2p": "87976.5",
                "p2t": 1769505299.999,
                "entryPoint": 1769505299.999
            }
        }]
        """

        drawSignals(signalJson)
    }

    func drawSignals(_ jsonSignals: String) {
        let js = "drawSignals('\(jsonSignals.replacingOccurrences(of: "'", with: "\\'"))')"
        webView.evaluateJavaScript(js) { result, error in
            if let error = error {
                print("Error: \(error)")
            } else {
                print("Drew shapes: \(result ?? 0)")
            }
        }
    }

    func clearShapes() {
        webView.evaluateJavaScript("clearShapes()") { _, _ in }
    }

    func changeSymbol(_ symbol: String) {
        webView.evaluateJavaScript("changeSymbol('\(symbol)')") { _, _ in }
    }
}
```

## استفاده در Android (Kotlin)

```kotlin
import android.webkit.*

class ChartActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_chart)

        webView = findViewById(R.id.webView)
        setupWebView()
        loadChart()
    }

    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
        }

        // JavaScript Interface
        webView.addJavascriptInterface(NativeInterface(), "NativeApp")

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                // Page loaded
            }
        }
    }

    private fun loadChart() {
        webView.loadUrl("file:///android_asset/chart.html?symbol=BTCUSDT&interval=15")
    }

    fun drawSignals(jsonSignals: String) {
        val escapedJson = jsonSignals.replace("'", "\\'")
        webView.evaluateJavascript("drawSignals('$escapedJson')") { result ->
            Log.d("Chart", "Drew shapes: $result")
        }
    }

    fun clearShapes() {
        webView.evaluateJavascript("clearShapes()") { }
    }

    fun changeSymbol(symbol: String) {
        webView.evaluateJavascript("changeSymbol('$symbol')") { }
    }

    // JavaScript Interface
    inner class NativeInterface {
        @JavascriptInterface
        fun onChartReady() {
            runOnUiThread {
                // Chart is ready, load signals
                loadSignals()
            }
        }
    }

    private fun loadSignals() {
        // Fetch from API and draw
        val signals = """[{"signal_id":"abc",...}]"""
        drawSignals(signals)
    }
}
```

## React Native با WebView

```tsx
import React, { useRef, useCallback } from 'react';
import { WebView } from 'react-native-webview';

interface ChartWebViewProps {
  symbol: string;
  signals: any[];
}

export function ChartWebView({ symbol, signals }: ChartWebViewProps) {
  const webViewRef = useRef<WebView>(null);

  const handleMessage = useCallback((event: any) => {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.type === 'chartReady') {
      // Draw signals when chart is ready
      drawSignals(signals);
    }
  }, [signals]);

  const drawSignals = useCallback((signals: any[]) => {
    const js = `drawSignals('${JSON.stringify(signals).replace(/'/g, "\\'")}')`;
    webViewRef.current?.injectJavaScript(js);
  }, []);

  const clearShapes = useCallback(() => {
    webViewRef.current?.injectJavaScript('clearShapes()');
  }, []);

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: `file:///chart.html?symbol=${symbol}` }}
      onMessage={handleMessage}
      javaScriptEnabled
      domStorageEnabled
      originWhitelist={['*']}
    />
  );
}
```

## نکات مهم برای WebView

### 1. Performance

```javascript
// غیرفعال کردن features غیرضروری
disabled_features: [
  'use_localstorage_for_settings',
  'header_symbol_search',
  'header_compare',
  'header_undo_redo',
  'header_screenshot',
  'header_settings',
  'header_fullscreen_button',
  'display_market_status'
]
```

### 2. Touch Events

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### 3. Error Handling

```javascript
window.onerror = function(message, source, lineno, colno, error) {
  if (window.NativeApp && window.NativeApp.onError) {
    window.NativeApp.onError(JSON.stringify({
      message,
      source,
      lineno,
      error: error?.toString()
    }));
  }
};
```

### 4. Memory Management

```javascript
// پاک کردن هنگام خروج
window.cleanup = function() {
  if (shapesManager) {
    shapesManager.destroy();
    shapesManager = null;
  }
  if (tvWidget) {
    tvWidget.remove();
    tvWidget = null;
  }
};
```

## ساختار فایل‌ها در App

```
assets/ (Android) یا Bundle (iOS)
├── chart.html
├── charting_library/
│   ├── charting_library.standalone.js
│   └── bundles/
│       └── ...
└── nxc-chart-shapes.umd.js
```
