# نمای کلی کتابخانه nxc-chart-shapes

## هدف این کتابخانه چیست؟

کتابخانه `nxc-chart-shapes` یک لایه انتزاعی (Abstraction Layer) بین داده‌های سیگنال NexCryptoTrade و کتابخانه نمودار TradingView است.

```
┌─────────────────────────────────────────────────────────────────┐
│                     NexCryptoTrade Platform                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐    ┌──────────────────┐    ┌──────────────┐  │
│   │   API        │    │  nxc-chart-shapes │    │  TradingView │  │
│   │   Signals    │───▶│     Library       │───▶│    Chart     │  │
│   │              │    │                   │    │              │  │
│   └──────────────┘    └──────────────────┘    └──────────────┘  │
│                                                                  │
│   فرمت JSON            تبدیل و رندر           شکل روی نمودار    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## مشکلی که حل می‌کند

### بدون این کتابخانه:
- باید برای هر شکل کد جداگانه بنویسید
- باید فرمت نقاط API را دستی پردازش کنید
- باید رنگ‌ها و استایل‌ها را هر بار تنظیم کنید
- کد تکراری زیادی خواهید داشت

### با این کتابخانه:
```javascript
// فقط همین! (500+ strategies built-in هستند)
const shapes = new NXCChartShapes({ theme: 'dark' });
await shapes.attach(widget);
await shapes.draw(signals);
```

## اجزای اصلی

### 1. ShapeManager (مدیر اصلی)
```
ShapeManager
    │
    ├── SignalParser ──▶ تبدیل سیگنال API به داده شکل
    │
    └── ShapeRenderer ──▶ رسم شکل روی TradingView
```

### 2. Strategies (استراتژی‌ها)
هر نوع شکل یک استراتژی دارد که می‌داند:
- چند نقطه نیاز دارد
- چطور نقاط را تبدیل کند
- چه تنظیماتی به TradingView بدهد

### 3. Types (انواع داده)
تعریف دقیق ساختار داده‌ها برای TypeScript

### 4. Utils (ابزارها)
توابع کمکی برای کار با رنگ، زمان و نقاط

## فرمت ورودی (API Signal)

```json
{
  "signal_id": "7e53cc19-f0dd-530f-96ae-51c941544e14",
  "exchange_id": 1,
  "symbol": "BTCUSDT",
  "timeframe_min": 5,
  "strategy_id": 315,
  "signal_type": "S",
  "pivot_type": 3,
  "zone_range": null,
  "candle_close_unix": 1769505299,
  "close_price": "87969.70000000",
  "payload": {
    "p1p": "88013.5",
    "p1t": 1769468699.999,
    "p2p": "87976.5",
    "p2t": 1769505299.999,
    "entryPoint": 1769505299.999
  },
  "created_at": "2026-01-27T09:21:29.502959Z"
}
```

## فرمت خروجی (Shape Result)

```javascript
{
  type: "trend_line",
  points: [
    { time: 1769468699999, price: 88013.5 },
    { time: 1769505299999, price: 87976.5 }
  ],
  overrides: {
    linecolor: "#f44336",
    linewidth: 2,
    linestyle: 0
  },
  entryMarker: { time: 1769505299999, price: 87969.70 },
  signalId: "7e53cc19-f0dd-530f-96ae-51c941544e14"
}
```

## پلتفرم‌های پشتیبانی شده

| پلتفرم | فرمت | نحوه استفاده |
|--------|------|--------------|
| React/Next.js | ESM | `import { NXCChartShapes } from 'nxc-chart-shapes'` |
| Node.js | CJS | `const { NXCChartShapes } = require('nxc-chart-shapes')` |
| Browser/WebView | UMD | `<script src="nxc-chart-shapes.umd.js">` |
| TypeScript | d.ts | انواع داده خودکار |

## نسخه‌ها و وابستگی‌ها

```json
{
  "نسخه کتابخانه": "1.0.0",
  "TypeScript": "^5.3.3",
  "TradingView": "v22.032 یا بالاتر"
}
```

## فایل‌های خروجی Build

```
dist/
├── esm/           # ES Modules برای bundler های مدرن
├── cjs/           # CommonJS برای Node.js
├── umd/           # Universal Module برای مرورگر
│   ├── nxc-chart-shapes.js      # 48KB
│   └── nxc-chart-shapes.min.js  # 17KB (فشرده)
└── types/         # TypeScript declarations
```
