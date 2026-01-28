# توضیح Sample App

## محل فایل

```
nxc-chart-shapes/
└── sample/
    └── index.html    ◄── فایل نمونه
```

## نحوه اجرا

1. ابتدا کتابخانه را build کنید:
```bash
cd nxc-chart-shapes
npm run build
```

2. فایل `sample/index.html` را در مرورگر باز کنید

## ساختار Sample App

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Header                                         │
│  ┌─────────────────────────────────────────────────┐  ┌──────────────┐  │
│  │  Signal IDs: [____________________________]      │  │ Fetch & Draw │  │
│  └─────────────────────────────────────────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────┐  ┌────────────────────────┐ │
│  │                                        │  │   Loaded Signals       │ │
│  │                                        │  │                        │ │
│  │          TradingView Chart             │  │  ┌──────────────────┐  │ │
│  │                                        │  │  │ BTCUSDT SELL     │  │ │
│  │                                        │  │  │ Strategy: 315    │  │ │
│  │                                        │  │  │ Timeframe: 5m    │  │ │
│  │                                        │  │  └──────────────────┘  │ │
│  │                                        │  │                        │ │
│  └────────────────────────────────────────┘  └────────────────────────┘ │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                           Log Panel                                      │
│  [12:30:15] Initializing TradingView widget...                          │
│  [12:30:16] TradingView chart ready                                     │
│  [12:30:16] NXC Chart Shapes attached                                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## بخش‌های کد

### 1. تنظیمات API

```javascript
// آدرس API
const API_BASE = 'https://api.nexcrypto.trade/v1';

// کلید API
const API_KEY = 'MOaNJZ3ZitI1ZSOEf0BATXH1Q0sxP5lnbReA_LZRFbE';
```

### 2. Strategy ها (Built-in)

**نیازی به تعریف دستی نیست!** کتابخانه 500+ strategy را built-in دارد:

```javascript
// نیازی به این کد نیست - همه strategy ها از قبل تعریف شده‌اند:
// - Ichimoku: 1-30, 496-497
// - SMA/WMA/EMA: 31-120
// - MA Cross: 121-180
// - RSI Divergence: 215-220, 277-278
// - MACD Divergence: 289-292
// - Trend Lines: 332-339
// - Channels: 342-361
// - Patterns: 364-495
// و بسیاری دیگر...

// فقط اگر بخواهید strategy سفارشی اضافه کنید:
const CUSTOM_STRATEGIES = {
  999: {
    id: 999,
    name: 'My Custom',
    shapeType: 'rectangle',
    pointCount: 2,
    colors: { buy: '#00ff00', sell: '#ff00ff' }
  }
};
```

### 3. Datafeed برای Binance

```javascript
const datafeed = {
  onReady: (callback) => {
    setTimeout(() => callback({
      supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D', '1W']
    }), 0);
  },

  resolveSymbol: (symbolName, onResolve) => {
    setTimeout(() => onResolve({
      name: symbolName,
      ticker: symbolName,
      type: 'crypto',
      session: '24x7',
      // ...
    }), 0);
  },

  getBars: async (symbolInfo, resolution, periodParams, onResult) => {
    // دریافت از Binance
    const url = `https://api.binance.com/api/v3/klines?...`;
    const response = await fetch(url);
    const data = await response.json();

    const bars = data.map(k => ({
      time: k[0],
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5])
    }));

    onResult(bars);
  },

  subscribeBars: () => {},
  unsubscribeBars: () => {}
};
```

### 4. Initialize Chart

```javascript
function initChart() {
  // ساخت TradingView Widget
  tvWidget = new TradingView.widget({
    container: 'chartContainer',
    symbol: 'BTCUSDT',
    interval: '5',
    datafeed: datafeed,
    library_path: '../../tradingview/charting_library/',
    theme: 'Dark',
    autosize: true
  });

  tvWidget.onChartReady(async () => {
    // ساخت NXCChartShapes (بدون نیاز به تعریف strategies)
    shapesManager = new NXCChartShapes.default({
      theme: 'dark',
      showEntryMarker: true
      // strategies: CUSTOM_STRATEGIES  // فقط اگر strategy سفارشی دارید
    });

    // اتصال به widget (async)
    await shapesManager.attach(tvWidget);
  });
}
```

### 5. Fetch Signal از API

```javascript
async function fetchSignal(signalId) {
  const response = await fetch(`${API_BASE}/signals/${signalId}`, {
    headers: {
      'Accept': 'application/json',
      'X-API-Key': API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }

  return response.json();
}
```

### 6. Fetch & Draw

```javascript
async function fetchAndDraw() {
  // خواندن ID ها از input
  const input = document.getElementById('signalIds').value.trim();
  const ids = input.split(',').map(id => id.trim());

  // fetch هر سیگنال
  const signals = [];
  for (const id of ids) {
    const signal = await fetchSignal(id);
    signals.push(signal);
  }

  // پاک کردن شکل‌های قبلی
  shapesManager.clear();

  // رسم سیگنال‌ها (async - برای اندیکاتورها و divergence ها)
  const drawnIds = await shapesManager.draw(signals);
  console.log(`Drew ${drawnIds.length} shapes`);
}
```

**نکته مهم:** متد `draw()` الان async است چون:
- اندیکاتورها (RSI, MACD, MA) باید اول ساخته شوند
- بعد شکل‌هایی که روی پنل اندیکاتور هستند رسم شوند (مثل خطوط divergence)

### 7. Clear Shapes

```javascript
function clearShapes() {
  shapesManager.clear();
  loadedSignals = [];
  renderSignalList();
}
```

## جریان کار

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Flow Diagram                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   1. Page Load                                                           │
│      │                                                                   │
│      ▼                                                                   │
│   2. initChart()                                                         │
│      │                                                                   │
│      ├──▶ TradingView.widget() ──▶ داده از Binance ──▶ نمودار           │
│      │                                                                   │
│      └──▶ NXCChartShapes.attach() ──▶ آماده برای رسم                    │
│                                                                          │
│   3. User clicks "Fetch & Draw"                                         │
│      │                                                                   │
│      ▼                                                                   │
│   4. fetchAndDraw()                                                      │
│      │                                                                   │
│      ├──▶ fetch(API_URL) ──▶ دریافت سیگنال                              │
│      │                                                                   │
│      └──▶ shapesManager.draw() ──▶ رسم شکل روی نمودار                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## نمونه پاسخ API

### سیگنال ساده (Trend Line)

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

### سیگنال RSI Divergence

```json
{
  "signal_id": "abc123...",
  "strategy_id": 215,
  "signal_type": "B",
  "close_price": "87500.00",
  "payload": {
    "p1p": "88000",
    "p1t": 1769400000,
    "p2p": "87500",
    "p2t": 1769450000,
    "p3p": "48.79",
    "p3t": 1769400000,
    "p4p": "47.96",
    "p4t": 1769450000,
    "entryPoint": 1769450000
  }
}
```

**نتیجه:** 4 شکل رسم می‌شود:
1. RSI Indicator (پنل جداگانه)
2. Trend Line روی چارت قیمت (p1 → p2)
3. Trend Line روی RSI pane (p3 → p4)
4. Entry Marker

### سیگنال MA Cross

```json
{
  "signal_id": "xyz789...",
  "strategy_id": 137,
  "signal_type": "B",
  "payload": {
    "entryPoint": 1769450000
  }
}
```

**نتیجه:** 2 اندیکاتور رسم می‌شود:
- SMA 50
- SMA 200

## نتیجه رسم

با این سیگنال:
- `strategy_id: 315` → Trend Line
- `signal_type: "S"` → قرمز (Sell)
- 2 نقطه: p1 و p2

شکل رسم شده:
```
     (88013.5, t1)
      ○─────────────────○ (87976.5, t2)
       \                 │
        \                ▼ Entry Marker
         خط روند قرمز
```

## تست با Signal ID های دیگر

می‌توانید چند Signal ID را با کاما جدا کنید:

```
7e53cc19-f0dd-530f-96ae-51c941544e14, abc123..., xyz789...
```

## Debug کردن

Log Panel پایین صفحه اطلاعات مفیدی نشان می‌دهد:

```
[09:21:30] Initializing TradingView widget...
[09:21:31] TradingView chart ready
[09:21:31] NXC Chart Shapes attached
[09:22:15] Fetching 1 signal(s)...
[09:22:16] Fetched signal: BTCUSDT (S)
[09:22:16] Drew 2 shape(s) on chart
```

## سفارشی‌سازی

### اضافه کردن Strategy سفارشی (اختیاری)

فقط اگر strategy خاصی در built-in registry نیست:

```javascript
shapesManager = new NXCChartShapes.default({
  theme: 'dark',
  strategies: {
    999: {
      id: 999,
      name: 'My Custom',
      shapeType: 'rectangle',
      pointCount: 2,
      colors: { buy: '#00ff00', sell: '#ff00ff' }
    }
  }
});
```

### Override کردن رنگ یک Strategy موجود

```javascript
shapesManager = new NXCChartShapes.default({
  strategies: {
    315: {  // Override built-in strategy 315
      id: 315,
      name: 'Trend Line',
      shapeType: 'trend_line',
      pointCount: 2,
      colors: {
        buy: '#00e676',   // سبز روشن
        sell: '#ff1744'   // قرمز روشن
      }
    }
  }
});
```

### غیرفعال کردن Entry Marker

```javascript
shapesManager = new NXCChartShapes.default({
  theme: 'dark',
  showEntryMarker: false  // ◄── غیرفعال
});
```

### انواع سیگنال‌های پشتیبانی شده

| نوع | Strategy IDs | توضیح |
|-----|--------------|-------|
| Ichimoku | 1-30, 496-497 | ابر ایچیموکو |
| SMA | 31-60 | میانگین متحرک ساده |
| WMA | 61-90 | میانگین متحرک وزنی |
| EMA | 91-120 | میانگین متحرک نمایی |
| MA Cross | 121-180 | تقاطع میانگین‌ها |
| RSI Divergence | 215-220, 277-278 | واگرایی RSI |
| MACD Divergence | 289-292 | واگرایی MACD |
| Trend Line | 332-339 | خط روند |
| Channel | 342-361 | کانال موازی |
| Triangle | 364-407 | الگوی مثلث |
| ABCD | 464-465 | الگوی ABCD |
| XABCD | 466-487 | الگوی هارمونیک |
