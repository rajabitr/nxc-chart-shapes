# دریافت داده از Binance

## نقش Binance در سیستم

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          سیستم کامل                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────┐         ┌──────────────┐         ┌──────────────┐    │
│   │   Binance    │         │  TradingView │         │   NXC API    │    │
│   │    API       │         │    Widget    │         │   Signals    │    │
│   └──────┬───────┘         └──────┬───────┘         └──────┬───────┘    │
│          │                        │                        │            │
│          │ داده کندل              │                        │ سیگنال‌ها  │
│          │ (OHLCV)                │                        │            │
│          │                        │                        │            │
│          ▼                        ▼                        ▼            │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │                      TradingView Widget                       │     │
│   │                                                               │     │
│   │   ┌─────────────────────────────────────────────────────┐    │     │
│   │   │                    Datafeed                          │    │     │
│   │   │  (دریافت داده از Binance)                           │    │     │
│   │   └─────────────────────────────────────────────────────┘    │     │
│   │                              │                                │     │
│   │                              ▼                                │     │
│   │   ┌─────────────────────────────────────────────────────┐    │     │
│   │   │                 کندل‌ها روی نمودار                    │    │     │
│   │   └─────────────────────────────────────────────────────┘    │     │
│   │                              │                                │     │
│   │                              │                                │     │
│   │   ┌─────────────────────────────────────────────────────┐    │     │
│   │   │              nxc-chart-shapes                        │    │     │
│   │   │         (شکل‌های سیگنال روی نمودار)                  │    │     │
│   │   └─────────────────────────────────────────────────────┘    │     │
│   │                                                               │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Datafeed چیست؟

Datafeed یک interface است که TradingView از آن برای دریافت داده استفاده می‌کند. این کتابخانه (nxc-chart-shapes) مستقیماً با Binance کار نمی‌کند - Datafeed این کار را انجام می‌دهد.

### ساختار Datafeed

```javascript
const datafeed = {
  // اطلاعات اولیه
  onReady: (callback) => {
    callback({
      supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D', '1W'],
      supports_time: true
    });
  },

  // پیدا کردن نماد
  resolveSymbol: (symbolName, onResolve, onError) => {
    onResolve({
      name: symbolName,
      ticker: symbolName,
      type: 'crypto',
      session: '24x7',
      // ...
    });
  },

  // دریافت داده کندل از Binance
  getBars: async (symbolInfo, resolution, periodParams, onResult, onError) => {
    const { from, to } = periodParams;

    // تبدیل resolution به فرمت Binance
    const interval = resolutionToBinanceInterval(resolution);

    // دریافت از Binance API
    const url = `https://api.binance.com/api/v3/klines?` +
                `symbol=${symbolInfo.name}&` +
                `interval=${interval}&` +
                `startTime=${from * 1000}&` +
                `endTime=${to * 1000}&` +
                `limit=1000`;

    const response = await fetch(url);
    const data = await response.json();

    // تبدیل به فرمت TradingView
    const bars = data.map(k => ({
      time: k[0],           // زمان باز شدن (میلی‌ثانیه)
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5])
    }));

    onResult(bars);
  },

  // اشتراک realtime
  subscribeBars: (symbolInfo, resolution, onTick, listenerGuid) => {
    // WebSocket به Binance
  },

  unsubscribeBars: (listenerGuid) => {
    // لغو اشتراک
  }
};
```

## API های Binance

### 1. Klines API (داده کندل)

```
GET https://api.binance.com/api/v3/klines

پارامترها:
- symbol: نماد (مثلاً BTCUSDT)
- interval: بازه زمانی (1m, 5m, 15m, 1h, 4h, 1d, 1w)
- startTime: زمان شروع (میلی‌ثانیه)
- endTime: زمان پایان (میلی‌ثانیه)
- limit: تعداد (پیش‌فرض 500، حداکثر 1000)
```

### نمونه پاسخ

```json
[
  [
    1769468700000,      // زمان باز شدن
    "87969.70000000",   // قیمت باز
    "88050.00000000",   // بالاترین
    "87900.00000000",   // پایین‌ترین
    "88013.50000000",   // قیمت بسته
    "1234.56700000",    // حجم
    1769468999999,      // زمان بسته شدن
    "108654321.12",     // حجم به USDT
    5432,               // تعداد معاملات
    "617.28350000",     // حجم خرید
    "54327160.56",      // حجم خرید به USDT
    "0"                 // نادیده
  ]
]
```

### 2. تبدیل Resolution

```javascript
function resolutionToBinanceInterval(resolution) {
  const map = {
    '1': '1m',
    '3': '3m',
    '5': '5m',
    '15': '15m',
    '30': '30m',
    '60': '1h',
    '120': '2h',
    '240': '4h',
    '360': '6h',
    '480': '8h',
    '720': '12h',
    'D': '1d',
    '1D': '1d',
    'W': '1w',
    '1W': '1w'
  };
  return map[resolution] || '1h';
}
```

## Binance WebSocket (Realtime)

### اشتراک در کندل‌های جدید

```javascript
const ws = new WebSocket('wss://stream.binance.com:9443/ws');

ws.onopen = () => {
  ws.send(JSON.stringify({
    method: 'SUBSCRIBE',
    params: ['btcusdt@kline_5m'],
    id: 1
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.e === 'kline') {
    const bar = {
      time: data.k.t,
      open: parseFloat(data.k.o),
      high: parseFloat(data.k.h),
      low: parseFloat(data.k.l),
      close: parseFloat(data.k.c),
      volume: parseFloat(data.k.v)
    };

    // ارسال به TradingView
    onTick(bar);
  }
};
```

## ارتباط زمان سیگنال با کندل Binance

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    همگام‌سازی زمان                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  سیگنال API:                                                             │
│  {                                                                       │
│    candle_close_unix: 1769505299,  ◄── زمان بسته شدن کندل              │
│    payload: {                                                            │
│      p1t: 1769468699.999,          ◄── زمان نقطه اول                    │
│      p2t: 1769505299.999,          ◄── زمان نقطه دوم                    │
│      entryPoint: 1769505299.999    ◄── زمان ورود                        │
│    }                                                                     │
│  }                                                                       │
│                                                                          │
│  کندل Binance:                                                           │
│  {                                                                       │
│    openTime: 1769505000000,        ◄── شروع کندل 5 دقیقه‌ای            │
│    closeTime: 1769505299999        ◄── پایان کندل 5 دقیقه‌ای           │
│  }                                                                       │
│                                                                          │
│  نکته: زمان‌های سیگنال باید روی کندل‌های موجود قرار بگیرند               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Timeframe Mapping

| timeframe_min | TradingView | Binance |
|---------------|-------------|---------|
| 1 | 1 | 1m |
| 3 | 3 | 3m |
| 5 | 5 | 5m |
| 15 | 15 | 15m |
| 30 | 30 | 30m |
| 60 | 60 | 1h |
| 120 | 120 | 2h |
| 240 | 240 | 4h |
| 360 | 360 | 6h |
| 480 | 480 | 8h |
| 720 | 720 | 12h |
| 1440 | D | 1d |
| 10080 | W | 1w |

## نکته مهم: جداسازی مسئولیت‌ها

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   nxc-chart-shapes فقط شکل رسم می‌کند!                                  │
│                                                                          │
│   این کتابخانه:                                                          │
│   ✅ سیگنال می‌گیرد و شکل رسم می‌کند                                    │
│   ❌ داده کندل از Binance نمی‌گیرد (کار Datafeed است)                   │
│   ❌ WebSocket مدیریت نمی‌کند (کار Datafeed است)                         │
│                                                                          │
│   Datafeed:                                                              │
│   ✅ داده کندل از Binance می‌گیرد                                        │
│   ✅ WebSocket مدیریت می‌کند                                             │
│   ❌ سیگنال و شکل نمی‌شناسد                                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## نمونه کامل با Binance Datafeed

```javascript
// Datafeed ساده برای Binance
const binanceDatafeed = {
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

  getBars: async (symbolInfo, resolution, { from, to }, onResult) => {
    const interval = {
      '1': '1m', '5': '5m', '15': '15m', '30': '30m',
      '60': '1h', '240': '4h', 'D': '1d', 'W': '1w'
    }[resolution] || '1h';

    const res = await fetch(
      `https://api.binance.com/api/v3/klines?` +
      `symbol=${symbolInfo.name}&interval=${interval}&` +
      `startTime=${from * 1000}&endTime=${to * 1000}&limit=1000`
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
  },

  subscribeBars: () => {},
  unsubscribeBars: () => {}
};

// استفاده
const widget = new TradingView.widget({
  container: 'chart',
  symbol: 'BTCUSDT',
  interval: '5',
  datafeed: binanceDatafeed  // ◄── اینجا Datafeed تعریف می‌شود
});

// سپس nxc-chart-shapes
const shapes = new NXCChartShapes({ strategies: STRATEGIES });
await shapes.attach(widget);
shapes.draw(signals);
```
