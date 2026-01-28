# nxc-chart-shapes

TradingView chart shapes library for NexCryptoTrade. Draw trading signals on TradingView charts with ease.

## Project Structure

```
nxc-chart-shapes/
├── src/                    # TypeScript source code
├── dist/                   # Built outputs
│   ├── esm/               # ES Modules
│   ├── cjs/               # CommonJS
│   ├── umd/               # Browser bundle
│   └── types/             # TypeScript declarations
├── vendor/
│   └── tradingview/
│       └── charting_library/  # TradingView Charting Library (included)
├── sample/                 # Sample application
├── DOCS/                   # Documentation (Persian)
└── package.json
```

## Installation

```bash
npm install nxc-chart-shapes
```

## Usage

### React/Next.js

```tsx
import { NXCChartShapes } from 'nxc-chart-shapes';

function TradingChart({ signals }) {
  const chartRef = useRef(null);
  const shapesRef = useRef<NXCChartShapes | null>(null);

  useEffect(() => {
    const widget = new TradingView.widget({
      container: chartRef.current,
      symbol: 'BTCUSDT',
      interval: '15',
      datafeed: myDatafeed,
    });

    widget.onChartReady(() => {
      shapesRef.current = new NXCChartShapes({
        theme: 'dark',
        showEntryMarker: true,
        strategies: {
          315: {
            id: 315,
            name: 'Trend Line',
            shapeType: 'trend_line',
            pointCount: 2,
            colors: { buy: '#4caf50', sell: '#f44336' }
          }
        }
      });
      shapesRef.current.attach(widget);
    });

    return () => shapesRef.current?.destroy();
  }, []);

  useEffect(() => {
    if (shapesRef.current && signals.length) {
      shapesRef.current.clear();
      shapesRef.current.draw(signals);
    }
  }, [signals]);

  return <div ref={chartRef} />;
}
```

### WebView (UMD)

```html
<!-- TradingView Charting Library (included in vendor/) -->
<script src="vendor/tradingview/charting_library/charting_library.standalone.js"></script>

<!-- NXC Chart Shapes -->
<script src="dist/umd/nxc-chart-shapes.js"></script>

<script>
  const shapes = new NXCChartShapes.default({
    theme: 'dark',
    strategies: {
      315: {
        id: 315,
        name: 'Trend Line',
        shapeType: 'trend_line',
        pointCount: 2,
        colors: { buy: '#4caf50', sell: '#f44336' }
      }
    }
  });

  shapes.attach(window.tvWidget);
  shapes.draw(signals);
</script>
```

## API Signal Format

```typescript
interface APISignal {
  signal_id: string;
  exchange_id: number;
  symbol: string;
  timeframe_min: number;
  strategy_id: number;
  signal_type: "S" | "B";
  pivot_type: number | null;
  zone_range: number | null;
  candle_close_unix: number;
  close_price: string;
  payload: {
    p1p?: string | number;
    p1t?: number;
    p2p?: string | number;
    p2t?: number;
    // ...
    entryPoint: number;
  };
  created_at: string;
}
```

## Supported Shape Types

| shapeType | Description | Min Points |
|-----------|-------------|------------|
| `trend_line` | Trend line | 2 |
| `horizontal_line` | Horizontal line | 1 |
| `vertical_line` | Vertical line | 1 |
| `parallel_channel` | Parallel channel | 3 |
| `rectangle` | Rectangle/zone | 2 |
| `arrow` | Arrow marker | 1 |
| `fib_retracement` | Fibonacci retracement | 2 |
| `fib_extension` | Fibonacci extension | 3 |
| `triangle` | Triangle | 3 |
| `abcd_pattern` | ABCD pattern | 4 |
| `xabcd_pattern` | XABCD pattern | 5 |

## API Reference

### NXCChartShapes

```typescript
class NXCChartShapes {
  constructor(options?: NXCOptions);
  attach(widget: TradingViewWidget): Promise<void>;
  draw(signals: APISignal | APISignal[]): string[];
  clear(): void;
  removeSignal(signalId: string): number;
  setTheme(theme: 'light' | 'dark'): void;
  registerStrategy(id: number, config: StrategyConfig): void;
  destroy(): void;
}
```

### NXCOptions

```typescript
interface NXCOptions {
  theme?: 'light' | 'dark';
  showEntryMarker?: boolean;
  strategies?: Record<number, StrategyConfig>;
  lockShapes?: boolean;
  disableSelection?: boolean;
}
```

### StrategyConfig

```typescript
interface StrategyConfig {
  id: number;
  name: string;
  shapeType: ShapeType;
  pointCount: number;
  colors: { buy: string; sell: string };
  options?: Record<string, unknown>;
}
```

## Sample App

Run the sample application:

```bash
# Build the library first
npm run build

# Serve the project (any static server)
npx serve .

# Open http://localhost:3000/sample/
```

## Documentation

Full documentation available in `DOCS/` folder (Persian):
- Architecture and design
- Strategy ID system
- TradingView integration
- Binance data flow
- API reference
- React and WebView usage guides

## License

MIT
