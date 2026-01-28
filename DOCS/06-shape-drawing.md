# نحوه رسم شکل‌ها

## مراحل رسم یک شکل

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     مراحل رسم شکل                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  مرحله 1: استخراج نقاط                                                   │
│  ─────────────────────────────────                                       │
│                                                                          │
│  payload: {                        نقاط استخراج شده:                    │
│    p1p: "88013.5",     ──────▶     [                                    │
│    p1t: 1769468699.999              { price: 88013.5, time: ...000 },   │
│    p2p: "87976.5",                  { price: 87976.5, time: ...000 }    │
│    p2t: 1769505299.999             ]                                     │
│  }                                                                       │
│                                                                          │
│  مرحله 2: تعیین نوع شکل                                                  │
│  ─────────────────────────────────                                       │
│                                                                          │
│  strategy_id: 315    ──────▶    shapeType: "trend_line"                 │
│                                                                          │
│  مرحله 3: محاسبه رنگ                                                     │
│  ─────────────────────────────────                                       │
│                                                                          │
│  signal_type: "S"    ──────▶    color: "#f44336" (قرمز)                 │
│  signal_type: "B"    ──────▶    color: "#4caf50" (سبز)                  │
│                                                                          │
│  مرحله 4: ساخت Overrides                                                 │
│  ─────────────────────────────────                                       │
│                                                                          │
│  {                                                                       │
│    linecolor: "#f44336",                                                │
│    linewidth: 2,                                                         │
│    linestyle: 0,                                                         │
│    showPriceLabels: true                                                │
│  }                                                                       │
│                                                                          │
│  مرحله 5: فراخوانی TradingView API                                       │
│  ─────────────────────────────────                                       │
│                                                                          │
│  chart.createMultipointShape(                                           │
│    [{ time: 1769468699, price: 88013.5 }, ...],                        │
│    { shape: "trend_line", overrides: {...} }                            │
│  )                                                                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## استخراج نقاط از Payload

### کد استخراج

```typescript
// src/utils/points.ts

export function extractPoints(payload: SignalPayload): ChartPoint[] {
  const points: ChartPoint[] = [];
  let i = 1;

  while (true) {
    const priceKey = `p${i}p`;  // p1p, p2p, p3p, ...
    const timeKey = `p${i}t`;   // p1t, p2t, p3t, ...

    const priceValue = payload[priceKey];
    const timeValue = payload[timeKey];

    // اگر نقطه وجود نداشت، خارج شو
    if (priceValue === undefined || timeValue === undefined) {
      break;
    }

    // تبدیل قیمت (ممکن است string باشد)
    const price = typeof priceValue === 'string'
      ? parseFloat(priceValue)
      : priceValue;

    // تبدیل زمان به میلی‌ثانیه
    const time = typeof timeValue === 'number'
      ? timeValue * 1000
      : parseInt(String(timeValue), 10) * 1000;

    points.push({ price, time });
    i++;
  }

  return points;
}
```

### مثال

```javascript
// ورودی
payload = {
  p1p: "88013.5",
  p1t: 1769468699.999,
  p2p: "87976.5",
  p2t: 1769505299.999,
  entryPoint: 1769505299.999
}

// خروجی
[
  { price: 88013.5, time: 1769468699999 },
  { price: 87976.5, time: 1769505299999 }
]
```

## انواع شکل و نقاط مورد نیاز

### 1. خط روند (Trend Line)

```
نقاط: 2

       p1 (88013.5, t1)
        ○─────────────────────────○ p2 (87976.5, t2)
                     \
                      \
                       خط روند
```

### 2. کانال موازی (Parallel Channel)

```
نقاط: 3 یا 4

     p1 ○─────────────────────────○ p2    خط بالا
          \                       \
           \                       \
            \                       \
         p3 ○─────────────────────────○ (p4)  خط پایین
```

### 3. مستطیل (Rectangle)

```
نقاط: 2 (گوشه‌های مقابل)

     p1 (قیمت بالا، زمان شروع)
      ┌────────────────────────────┐
      │                            │
      │      منطقه حمایت/مقاومت    │
      │                            │
      └────────────────────────────┘
                                    p2 (قیمت پایین، زمان پایان)
```

### 4. فیبوناچی (Fibonacci Retracement)

```
نقاط: 2

     p1 (اوج)
      ○ ─────────────────── 0%
      │
      │ ─────────────────── 23.6%
      │
      │ ─────────────────── 38.2%
      │
      │ ─────────────────── 50%
      │
      │ ─────────────────── 61.8%
      │
      ○ ─────────────────── 100%
     p2 (کف)
```

### 5. الگوی ABCD

```
نقاط: 4

         B ○
          /│\
         / │ \
        /  │  \
       /   │   \
    A ○    │    ○ C
           │
           │
           ○ D
```

### 6. الگوی XABCD

```
نقاط: 5

              B ○
             / \
            /   \
           /     \
        A ○       ○ C
         │\       /
         │ \     /
         │  \   /
       X ○   \ /
              ○ D
```

## Strategy ها چگونه کار می‌کنند

### BaseStrategy

```typescript
// src/strategies/BaseStrategy.ts

export abstract class BaseStrategy implements IStrategy {
  // هر Strategy باید این‌ها را پیاده‌سازی کند
  abstract getShapeType(): string;
  abstract getMinPoints(): number;

  // متد اصلی parse
  parse(signal: APISignal, config: StrategyConfig): ShapeResult | null {
    // 1. استخراج نقاط
    const points = extractPoints(signal.payload);

    // 2. اعتبارسنجی
    if (points.length < this.getMinPoints()) {
      console.warn(`Not enough points`);
      return null;
    }

    // 3. ساخت overrides
    const overrides = this.getOverrides(signal, config);

    // 4. برگرداندن نتیجه
    return {
      type: this.getShapeType(),
      points: this.transformPoints(points, signal, config),
      overrides,
      signalId: signal.signal_id
    };
  }

  // محاسبه رنگ و تنظیمات
  getOverrides(signal: APISignal, config: StrategyConfig): Record<string, unknown> {
    const color = signal.signal_type === 'B'
      ? config.colors.buy
      : config.colors.sell;

    return {
      linecolor: color,
      linewidth: 2,
      linestyle: 0
    };
  }
}
```

### TrendLineStrategy

```typescript
// src/strategies/TrendLineStrategy.ts

export class TrendLineStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'trend_line';
  }

  getMinPoints(): number {
    return 2;
  }

  protected getShapeSpecificOverrides(signal, config) {
    const color = getSignalColor(signal.signal_type, config.colors);

    return {
      linecolor: color,
      linewidth: 2,
      linestyle: 0,
      extendLeft: false,
      extendRight: false,
      showPriceLabels: true
    };
  }
}
```

### ChannelStrategy

```typescript
// src/strategies/ChannelStrategy.ts

export class ChannelStrategy extends BaseStrategy {
  getShapeType(): string {
    return 'parallel_channel';
  }

  getMinPoints(): number {
    return 3;
  }

  protected transformPoints(points, signal, config) {
    // کانال به 3 یا 4 نقطه نیاز دارد
    return points.slice(0, 4);
  }

  protected getShapeSpecificOverrides(signal, config) {
    const color = getSignalColor(signal.signal_type, config.colors);

    return {
      linecolor: color,
      linewidth: 2,
      fillBackground: true,
      backgroundColor: withOpacity(color, 0.1),
      showMidline: true
    };
  }
}
```

## رسم Entry Marker

برای هر سیگنال یک نشانگر ورود (Entry Marker) هم رسم می‌شود:

```typescript
// src/strategies/EntryPointStrategy.ts

export function createEntryMarkerShape(signal, entryMarker) {
  const color = getEntryMarkerColor(signal.signal_type);
  const isBuy = signal.signal_type === 'B';

  return {
    type: 'arrow',
    points: [entryMarker],
    overrides: {
      color: color,
      arrowColor: color,
      direction: isBuy ? 'up' : 'down',
      text: 'Entry'
    }
  };
}
```

```
نمایش روی نمودار:

                                    ▲ Entry (سبز برای خرید)
                                    │
     ○──────────────────────────────○
     p1                             p2


                                    │
                                    ▼ Entry (قرمز برای فروش)
     ○──────────────────────────────○
     p1                             p2
```

## ذخیره و حذف شکل‌ها

### ذخیره Reference

```typescript
// src/core/ShapeRenderer.ts

private shapes: Map<string, StoredShape> = new Map();

draw(shapeResult: ShapeResult): string | null {
  // ... رسم شکل ...

  const shapeId = chart.createMultipointShape(...);

  // ذخیره برای حذف بعدی
  this.shapes.set(uniqueId, {
    id: uniqueId,
    shapeId: shapeId,  // ID از TradingView
    signalId: shapeResult.signalId,
    type: shapeResult.type
  });

  return uniqueId;
}
```

### حذف شکل

```typescript
remove(id: string): boolean {
  const stored = this.shapes.get(id);
  if (!stored) return false;

  // حذف از TradingView
  this.chart.removeEntity(stored.shapeId);

  // حذف از حافظه
  this.shapes.delete(id);

  return true;
}
```

### حذف همه شکل‌های یک سیگنال

```typescript
removeBySignalId(signalId: string): number {
  let removed = 0;

  for (const [id, stored] of this.shapes) {
    // شکل اصلی و entry marker را پیدا کن
    if (stored.signalId === signalId ||
        stored.signalId.startsWith(`${signalId}_`)) {
      this.remove(id);
      removed++;
    }
  }

  return removed;
}
```

## خطایابی رسم شکل

### 1. شکل دیده نمی‌شود

```javascript
// بررسی زمان
console.log('Signal time:', signal.payload.p1t);
console.log('Chart visible range:', chart.getVisibleRange());

// اگر زمان خارج از محدوده است، چارت را جابجا کنید
```

### 2. شکل اشتباه رسم می‌شود

```javascript
// بررسی strategy_id
console.log('Strategy ID:', signal.strategy_id);
console.log('Strategy Config:', strategies[signal.strategy_id]);

// آیا strategy تعریف شده؟
```

### 3. رنگ اشتباه است

```javascript
// بررسی signal_type
console.log('Signal Type:', signal.signal_type);
console.log('Expected color:', signal.signal_type === 'B' ? 'green' : 'red');
```
