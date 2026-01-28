# مستندات کتابخانه nxc-chart-shapes

## فهرست مطالب

### شروع سریع

| سند | توضیح |
|-----|-------|
| [01-overview.md](./01-overview.md) | نمای کلی کتابخانه، هدف و ساختار |
| [07-api-reference.md](./07-api-reference.md) | مرجع کامل API |

### معماری و طراحی

| سند | توضیح |
|-----|-------|
| [02-architecture.md](./02-architecture.md) | معماری کتابخانه، لایه‌ها و جریان داده |
| [03-strategy-id.md](./03-strategy-id.md) | نقش strategy_id و نحوه کار سیستم استراتژی |
| [06-shape-drawing.md](./06-shape-drawing.md) | نحوه رسم شکل‌ها، استخراج نقاط، انواع شکل |

### یکپارچگی

| سند | توضیح |
|-----|-------|
| [04-tradingview-integration.md](./04-tradingview-integration.md) | یکپارچگی با TradingView، انواع شکل، Overrides |
| [05-binance-data.md](./05-binance-data.md) | دریافت داده از Binance، Datafeed |

### نمونه‌ها و استفاده

| سند | توضیح |
|-----|-------|
| [08-sample-app.md](./08-sample-app.md) | توضیح Sample App |
| [09-usage-react.md](./09-usage-react.md) | استفاده در React / Next.js |
| [10-usage-webview.md](./10-usage-webview.md) | استفاده در WebView (iOS/Android) |

### عیب‌یابی

| سند | توضیح |
|-----|-------|
| [11-troubleshooting.md](./11-troubleshooting.md) | مشکلات رایج و راه‌حل‌ها |

---

## خلاصه سریع

### نصب

```bash
npm install nxc-chart-shapes
```

### استفاده ساده

```javascript
import { NXCChartShapes } from 'nxc-chart-shapes';

// ساخت و اتصال (500+ strategies built-in هستند!)
const shapes = new NXCChartShapes({
  theme: 'dark',
  showEntryMarker: true
});

await shapes.attach(widget);

// رسم سیگنال‌ها (async)
await shapes.draw(signals);

// پاک کردن
shapes.clear();
```

### فرمت سیگنال

```javascript
{
  signal_id: "abc123",
  strategy_id: 315,          // نوع شکل
  signal_type: "S",          // S=Sell (قرمز), B=Buy (سبز)
  symbol: "BTCUSDT",
  payload: {
    p1p: "88013.5",          // قیمت نقطه 1
    p1t: 1769468699.999,     // زمان نقطه 1
    p2p: "87976.5",          // قیمت نقطه 2
    p2t: 1769505299.999,     // زمان نقطه 2
    entryPoint: 1769505299.999
  }
}
```

---

## نمودار جریان داده

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  API Signal │────▶│ nxc-chart-shapes │────▶│ TradingView     │
│             │     │                  │     │ Chart           │
│ strategy_id │     │ Strategy Registry│     │                 │
│ payload     │     │ SignalParser     │     │ createShape()   │
│ signal_type │     │ ShapeRenderer    │     │                 │
└─────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Build Commands

```bash
# نصب وابستگی‌ها
npm install

# Build همه خروجی‌ها
npm run build

# فقط ESM
npm run build:esm

# فقط UMD برای مرورگر
npm run build:umd
```

---

## ساختار فایل‌ها

```
nxc-chart-shapes/
├── src/
│   ├── index.ts              # Public exports
│   ├── core/                 # کلاس‌های اصلی
│   │   ├── ShapeManager.ts
│   │   ├── SignalParser.ts
│   │   └── ShapeRenderer.ts
│   ├── strategies/           # پیاده‌سازی شکل‌ها
│   │   ├── TrendLineStrategy.ts
│   │   ├── ChannelStrategy.ts
│   │   └── ...
│   ├── types/                # انواع TypeScript
│   └── utils/                # توابع کمکی
├── dist/
│   ├── esm/                  # ES Modules
│   ├── cjs/                  # CommonJS
│   ├── umd/                  # Browser bundle
│   └── types/                # Type declarations
├── sample/                   # نمونه برنامه
└── DOCS/                     # مستندات
```

---

## لینک‌های مفید

- [TradingView Charting Library Documentation](https://www.tradingview.com/charting-library-docs/)
- [Binance API Documentation](https://binance-docs.github.io/apidocs/)
- [NexCryptoTrade API](https://api.nexcrypto.trade/docs)
