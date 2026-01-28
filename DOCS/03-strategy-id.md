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

### 1. انعطاف‌پذیری
کاربر کتابخانه خودش mapping را تعریف می‌کند:

```javascript
// هر پروژه می‌تواند mapping متفاوتی داشته باشد
const STRATEGIES = {
  315: { name: 'Trend Line', shapeType: 'trend_line', ... },
  293: { name: 'Channel', shapeType: 'parallel_channel', ... },
  // ...
};
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

## جدول Strategy ID ها (نمونه)

| strategy_id | نام | shapeType | توضیح |
|-------------|-----|-----------|-------|
| 315 | Trend Line | `trend_line` | خط روند ساده |
| 312 | Trend Line Alt | `trend_line` | خط روند با رنگ متفاوت |
| 293 | Channel Pattern | `parallel_channel` | کانال موازی |
| 320 | Support/Resistance | `rectangle` | زون حمایت/مقاومت |
| 330 | Fibonacci | `fib_retracement` | فیبوناچی اصلاحی |
| 340 | ABCD Pattern | `abcd_pattern` | الگوی ABCD |
| 350 | XABCD Pattern | `xabcd_pattern` | الگوی XABCD (هارمونیک) |
| 514 | Entry Signal | `arrow` | فلش نقطه ورود |

## نحوه تعریف Strategy جدید

### 1. تعریف Config در کد کاربر

```javascript
const shapes = new NXCChartShapes({
  strategies: {
    // Strategy ID جدید
    999: {
      id: 999,
      name: 'My Custom Line',
      shapeType: 'trend_line',
      pointCount: 2,
      colors: {
        buy: '#00ff00',   // سبز برای خرید
        sell: '#ff0000'   // قرمز برای فروش
      },
      options: {
        extendRight: true,
        showLabels: true
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
