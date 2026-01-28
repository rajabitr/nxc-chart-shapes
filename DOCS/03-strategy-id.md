# نقش strategy_id در سیستم

## strategy_id چیست؟

`strategy_id` یک عدد یکتا است که نوع سیگنال/شکل را مشخص می‌کند. این عدد از API سیگنال‌ها می‌آید و تعیین می‌کند که چه نوع شکلی باید روی نمودار رسم شود.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         API Signal                                   │
│                                                                      │
│  {                                                                   │
│    "signal_id": "abc123",                                           │
│    "strategy_id": 315,  ◄─── این عدد نوع شکل را تعیین می‌کند       │
│    "payload": { ... }                                                │
│  }                                                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Strategy Registry                               │
│                                                                      │
│  {                                                                   │
│    315: {                      ◄─── strategy_id به عنوان key        │
│      name: "Trend Line",                                             │
│      shapeType: "trend_line",  ◄─── نوع شکل TradingView             │
│      pointCount: 2,            ◄─── تعداد نقاط مورد نیاز            │
│      colors: { buy: "...", sell: "..." }                            │
│    }                                                                 │
│  }                                                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## چرا از strategy_id استفاده می‌کنیم؟

### 1. Built-in Registry
کتابخانه **500+ استراتژی** را به صورت built-in دارد. نیازی به تعریف دستی نیست:

```javascript
// نیازی به این کد نیست!
// همه استراتژی‌ها از قبل تعریف شده‌اند

const shapes = new NXCChartShapes({
  theme: 'dark'
  // strategies نیازی نیست
});

// سیگنال با strategy_id: 315 → خودکار trend_line رسم می‌شود
// سیگنال با strategy_id: 215 → خودکار RSI Divergence رسم می‌شود
```

### 2. جداسازی منطق
API فقط یک عدد می‌فرستد، کتابخانه تصمیم می‌گیرد چه کاری انجام دهد:

```javascript
// API می‌فرستد:
{ strategy_id: 315, ... }

// کتابخانه تبدیل می‌کند به:
{ shapeType: 'trend_line', ... }
```

### 3. قابلیت توسعه
می‌توان strategy های جدید اضافه کرد بدون تغییر کد کتابخانه:

```javascript
shapes.registerStrategy(999, {
  id: 999,
  name: 'Custom Shape',
  shapeType: 'rectangle',
  pointCount: 2,
  colors: { buy: '#00ff00', sell: '#ff0000' }
});
```

## نحوه کار سیستم Strategy

### مرحله 1: دریافت سیگنال
```javascript
const signal = {
  signal_id: "7e53cc19-f0dd-530f-96ae-51c941544e14",
  strategy_id: 315,
  signal_type: "S",
  payload: {
    p1p: "88013.5",
    p1t: 1769468699.999,
    p2p: "87976.5",
    p2t: 1769505299.999,
    entryPoint: 1769505299.999
  }
};
```

### مرحله 2: جستجوی Strategy Config
```javascript
// SignalParser.parse()
const config = this.strategies[signal.strategy_id];
// config = { id: 315, name: 'Trend Line', shapeType: 'trend_line', pointCount: 2, ... }
```

### مرحله 3: انتخاب Strategy Implementation
```javascript
// بر اساس shapeType
const strategy = getStrategy(config.shapeType);
// strategy = new TrendLineStrategy()
```

### مرحله 4: پردازش سیگنال
```javascript
// strategy.parse(signal, config)
const result = {
  type: "trend_line",
  points: [
    { time: 1769468699999, price: 88013.5 },
    { time: 1769505299999, price: 87976.5 }
  ],
  overrides: {
    linecolor: "#f44336",  // قرمز چون signal_type = "S" (Sell)
    linewidth: 2
  }
};
```

## جدول Strategy ID ها (کامل)

### اندیکاتورها

| Range | نام | shapeType | توضیح |
|-------|-----|-----------|-------|
| 1-30, 496-497 | Ichimoku | `indicator_IchimokuCloud` | ابر ایچیموکو |
| 31-34, 51-52 | SMA 10 | `indicator_MASimple` | میانگین متحرک ساده 10 |
| 35-38, 53-54 | SMA 20 | `indicator_MASimple` | میانگین متحرک ساده 20 |
| 39-42, 55-56 | SMA 50 | `indicator_MASimple` | میانگین متحرک ساده 50 |
| 43-46, 57-58 | SMA 100 | `indicator_MASimple` | میانگین متحرک ساده 100 |
| 47-50, 59-60 | SMA 200 | `indicator_MASimple` | میانگین متحرک ساده 200 |
| 61-90 | WMA | `indicator_MAWeighted` | میانگین متحرک وزنی |
| 91-120 | EMA | `indicator_MAExponential` | میانگین متحرک نمایی |

### MA Cross (دو میانگین متحرک)

| Range | نام | shapeType | توضیح |
|-------|-----|-----------|-------|
| 121-140 | SMA Cross | `ma_cross` | تقاطع SMA ها |
| 141-160 | WMA Cross | `ma_cross` | تقاطع WMA ها |
| 161-180 | EMA Cross | `ma_cross` | تقاطع EMA ها |

### RSI و MACD

| Range | نام | shapeType | توضیح |
|-------|-----|-----------|-------|
| 215-220, 277-278 | RSI Divergence | `rsi_divergence` | واگرایی RSI (4 شکل) |
| 269-276, 575-576 | RSI Signal | `rsi_signal` | سیگنال RSI |
| 249-256 | MACD | `indicator_MACD` | اندیکاتور MACD |
| 289-292 | MACD Divergence | `macd_divergence` | واگرایی MACD (4 شکل) |

### شکل‌ها و الگوها

| Range | نام | shapeType | توضیح |
|-------|-----|-----------|-------|
| 181-214 | Signal Only | `vertical_line` | فقط entry marker |
| 295-296 | Zone | `rectangle` | زون با z1/z2 |
| 301-302 | Three Drives | `three_drives` | الگوی سه درایو |
| 303-306 | 3 Divers | `3divers_pattern` | الگوی 3 Divers |
| 310-319 | Rectangle | `rectangle` | مستطیل/زون |
| 332-339 | Trend Line | `trend_line` | خط روند |
| 342-361 | Channel | `parallel_channel` | کانال موازی |
| 364-407 | Triangle | `triangle` | الگوی مثلث |
| 408-433 | Fibonacci | `fib_retracement` | فیبوناچی با فلش |
| 464-465 | ABCD | `abcd_pattern` | الگوی ABCD |
| 466-487 | XABCD | `xabcd_pattern` | الگوی XABCD |
| 505-506 | Head & Shoulders | `head_and_shoulders` | سر و شانه |

## نحوه تعریف Strategy جدید (اختیاری)

**نکته:** بیش از 500 استراتژی built-in هستند. فقط اگر strategy خاصی نیاز دارید که در registry نیست:

### 1. Override یا اضافه کردن در Constructor

```javascript
const shapes = new NXCChartShapes({
  strategies: {
    // Strategy ID جدید یا override موجود
    999: {
      id: 999,
      name: 'My Custom Line',
      shapeType: 'trend_line',
      pointCount: 2,
      colors: {
        buy: '#00ff00',   // سبز برای خرید
        sell: '#ff0000'   // قرمز برای فروش
      }
    }
  }
});
```

### 2. یا اضافه کردن Runtime

```javascript
shapes.registerStrategy(999, {
  id: 999,
  name: 'My Custom Line',
  shapeType: 'trend_line',
  pointCount: 2,
  colors: { buy: '#00ff00', sell: '#ff0000' }
});
```

### 3. Auto-Detection Fallback

اگر strategy_id در registry نباشد، کتابخانه بر اساس تعداد نقاط تشخیص می‌دهد:

| تعداد نقاط | شکل پیش‌فرض |
|------------|-------------|
| 0-1 | `vertical_line` |
| 2 | `trend_line` |
| 3 | `parallel_channel` |
| 4 | `abcd_pattern` |
| 5+ | `xabcd_pattern` |

## ارتباط strategy_id با سایر فیلدها

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              API Signal                                   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  strategy_id ──────┬──────────────────────────────────────────────────▶  │
│                    │                                                      │
│                    │  تعیین می‌کند:                                       │
│                    │  - نوع شکل (trend_line, rectangle, ...)            │
│                    │  - تعداد نقاط مورد نیاز                              │
│                    │  - رنگ‌های پایه                                      │
│                    │                                                      │
│  signal_type ──────┼──────────────────────────────────────────────────▶  │
│  ("B" / "S")       │                                                      │
│                    │  تعیین می‌کند:                                       │
│                    │  - رنگ نهایی (buy یا sell)                          │
│                    │  - جهت فلش (بالا/پایین)                              │
│                    │                                                      │
│  payload ──────────┼──────────────────────────────────────────────────▶  │
│  (p1p, p1t, ...)   │                                                      │
│                    │  تعیین می‌کند:                                       │
│                    │  - مختصات نقاط                                       │
│                    │  - زمان و قیمت هر نقطه                               │
│                    │                                                      │
│  timeframe_min ────┼──────────────────────────────────────────────────▶  │
│                    │                                                      │
│                    │  استفاده می‌شود برای:                                │
│                    │  - تغییر timeframe نمودار                            │
│                    │  - فیلتر سیگنال‌ها                                   │
│                    │                                                      │
└──────────────────────────────────────────────────────────────────────────┘
```

## چگونه strategy جدید در Backend اضافه کنیم؟

### 1. در Backend (API)
یک strategy_id جدید تعریف کنید (مثلاً 999)

### 2. در Frontend (این کتابخانه)
Mapping مربوطه را اضافه کنید:

```javascript
shapes.registerStrategy(999, {
  id: 999,
  name: 'New Strategy',
  shapeType: 'trend_line',  // یا هر shapeType پشتیبانی شده
  pointCount: 2,
  colors: { buy: '#...', sell: '#...' }
});
```

### 3. اگر shapeType جدید نیاز است
یک Strategy class جدید بسازید:

```typescript
// src/strategies/MyNewStrategy.ts
export class MyNewStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'my_new_shape';
  }

  getMinPoints(): number {
    return 3;
  }

  protected getShapeSpecificOverrides(signal, config) {
    return {
      // تنظیمات خاص این شکل
    };
  }
}
```
