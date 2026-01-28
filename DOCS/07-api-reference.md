# مرجع API

## کلاس اصلی: NXCChartShapes

```typescript
import { NXCChartShapes } from 'nxc-chart-shapes';

const shapes = new NXCChartShapes(options?: NXCOptions);
```

### Options

```typescript
interface NXCOptions {
  // تم رنگی
  theme?: 'light' | 'dark';              // پیش‌فرض: 'dark'

  // نمایش نشانگر ورود
  showEntryMarker?: boolean;             // پیش‌فرض: true

  // پیکربندی استراتژی‌ها
  strategies?: Record<number, StrategyConfig>;

  // قفل شکل‌ها
  lockShapes?: boolean;                  // پیش‌فرض: false

  // غیرفعال کردن انتخاب
  disableSelection?: boolean;            // پیش‌فرض: true
}
```

### متدها

#### `attach(widget)`

اتصال به TradingView Widget.

```typescript
await shapes.attach(widget: TradingViewWidget): Promise<void>
```

```javascript
// مثال
const widget = new TradingView.widget({ ... });
await shapes.attach(widget);
```

---

#### `isReady()`

بررسی آماده بودن.

```typescript
shapes.isReady(): boolean
```

```javascript
if (shapes.isReady()) {
  shapes.draw(signals);
}
```

---

#### `draw(signals)`

رسم سیگنال‌ها روی نمودار.

```typescript
shapes.draw(signals: APISignal | APISignal[]): string[]
```

```javascript
// یک سیگنال
const ids = shapes.draw(signal);

// چند سیگنال
const ids = shapes.draw([signal1, signal2, signal3]);

// خروجی: آرایه‌ای از ID های شکل‌های رسم شده
// ['signal_abc123', 'signal_abc123_entry', ...]
```

---

#### `clear()`

پاک کردن همه شکل‌های رسم شده توسط کتابخانه.

```typescript
shapes.clear(): void
```

---

#### `clearAll()`

پاک کردن همه شکل‌ها (شامل شکل‌های دستی).

```typescript
shapes.clearAll(): void
```

---

#### `removeSignal(signalId)`

حذف شکل‌های یک سیگنال خاص.

```typescript
shapes.removeSignal(signalId: string): number  // تعداد حذف شده
```

```javascript
const removed = shapes.removeSignal('7e53cc19-f0dd-530f-96ae-51c941544e14');
console.log(`${removed} shapes removed`);
```

---

#### `setTheme(theme)`

تغییر تم.

```typescript
shapes.setTheme(theme: 'light' | 'dark'): void
```

---

#### `registerStrategy(id, config)`

ثبت یک استراتژی جدید.

```typescript
shapes.registerStrategy(id: number, config: StrategyConfig): void
```

```javascript
shapes.registerStrategy(999, {
  id: 999,
  name: 'My Strategy',
  shapeType: 'trend_line',
  pointCount: 2,
  colors: { buy: '#00ff00', sell: '#ff0000' }
});
```

---

#### `registerStrategies(strategies)`

ثبت چند استراتژی همزمان.

```typescript
shapes.registerStrategies(strategies: Record<number, StrategyConfig>): void
```

---

#### `getRegisteredStrategies()`

لیست ID های استراتژی‌های ثبت شده.

```typescript
shapes.getRegisteredStrategies(): number[]
```

---

#### `hasStrategy(strategyId)`

بررسی وجود استراتژی.

```typescript
shapes.hasStrategy(strategyId: number): boolean
```

---

#### `getShapeCount()`

تعداد شکل‌های رسم شده.

```typescript
shapes.getShapeCount(): number
```

---

#### `setOptions(options)`

بروزرسانی تنظیمات.

```typescript
shapes.setOptions(options: Partial<NXCOptions>): void
```

```javascript
shapes.setOptions({
  showEntryMarker: false,
  theme: 'light'
});
```

---

#### `destroy()`

نابود کردن و پاکسازی.

```typescript
shapes.destroy(): void
```

---

## Types

### APISignal

```typescript
interface APISignal {
  signal_id: string;
  exchange_id: number;
  symbol: string;
  timeframe_min: number;
  strategy_id: number;
  signal_type: 'S' | 'B';        // Sell یا Buy
  pivot_type: number | null;
  zone_range: number | null;
  candle_close_unix: number;
  close_price: string;
  payload: SignalPayload;
  created_at: string;
}
```

### SignalPayload

```typescript
interface SignalPayload {
  [key: string]: string | number | undefined;
  entryPoint: number;            // الزامی
  p1p?: string | number;         // قیمت نقطه 1
  p1t?: number;                  // زمان نقطه 1
  p2p?: string | number;
  p2t?: number;
  p3p?: string | number;
  p3t?: number;
  // ... تا هر چند نقطه که نیاز باشد
}
```

### StrategyConfig

```typescript
interface StrategyConfig {
  id: number;
  name: string;
  shapeType: ShapeType;
  pointCount: number;
  colors: {
    buy: string;
    sell: string;
  };
  options?: Record<string, unknown>;
}
```

### ShapeType

```typescript
type ShapeType =
  | 'trend_line'
  | 'horizontal_line'
  | 'vertical_line'
  | 'parallel_channel'
  | 'rectangle'
  | 'arrow'
  | 'icon'
  | 'fib_retracement'
  | 'fib_extension'
  | 'fib_trend_ext'
  | 'triangle'
  | 'abcd_pattern'
  | 'xabcd_pattern'
  | 'head_and_shoulders'
  | 'three_drives'
  | 'extended_line';
```

### ChartPoint

```typescript
interface ChartPoint {
  time: number;   // میلی‌ثانیه
  price: number;
}
```

### ShapeResult

```typescript
interface ShapeResult {
  type: string;
  points: ChartPoint[];
  overrides: Record<string, unknown>;
  entryMarker?: ChartPoint;
  signalId?: string;
}
```

---

## توابع کمکی

### Color Utilities

```typescript
import {
  getThemeColors,
  getSignalColor,
  getEntryMarkerColor,
  withOpacity
} from 'nxc-chart-shapes';

// رنگ‌های تم
const colors = getThemeColors('dark');
// { buy: '#4caf50', sell: '#f44336' }

// رنگ بر اساس نوع سیگنال
const color = getSignalColor('B', colors);
// '#4caf50'

// رنگ با شفافیت
const transparent = withOpacity('#4caf50', 0.2);
// 'rgba(76, 175, 80, 0.2)'
```

### Point Utilities

```typescript
import {
  extractPoints,
  extractEntryMarker,
  validatePointCount
} from 'nxc-chart-shapes';

// استخراج نقاط
const points = extractPoints(signal.payload);
// [{ time: ..., price: ... }, ...]

// استخراج entry marker
const entry = extractEntryMarker(signal.payload, signal.close_price);
// { time: ..., price: ... }

// اعتبارسنجی
const valid = validatePointCount(points, 2);
// true/false
```

### Time Utilities

```typescript
import {
  unixToMs,
  msToUnix,
  timeframeMinToInterval,
  intervalToTimeframeMin
} from 'nxc-chart-shapes';

// تبدیل زمان
unixToMs(1769505299);        // 1769505299000
msToUnix(1769505299000);     // 1769505299

// تبدیل timeframe
timeframeMinToInterval(60);  // '60'
timeframeMinToInterval(1440); // 'D'

intervalToTimeframeMin('D'); // 1440
intervalToTimeframeMin('W'); // 10080
```

---

## Factory Function

### createChart

ساخت Widget و ShapeManager با هم.

```typescript
import { createChart } from 'nxc-chart-shapes';

const { widget, shapes } = await createChart({
  container: 'chart-container',
  symbol: 'BTCUSDT',
  interval: '15',
  datafeed: myDatafeed,
  theme: 'dark',
  strategies: { ... }
});
```

### isTradingViewLoaded

بررسی لود شدن TradingView.

```typescript
import { isTradingViewLoaded } from 'nxc-chart-shapes';

if (isTradingViewLoaded()) {
  // می‌توان widget ساخت
}
```

### waitForTradingView

صبر برای لود شدن.

```typescript
import { waitForTradingView } from 'nxc-chart-shapes';

await waitForTradingView(10000); // timeout 10 ثانیه
// حالا TradingView لود شده
```

---

## Events و Callbacks

این کتابخانه event ندارد، اما می‌توانید از event های TradingView استفاده کنید:

```javascript
widget.onChartReady(() => {
  console.log('Chart ready');
});

widget.activeChart().onSymbolChanged().subscribe(null, () => {
  console.log('Symbol changed');
  shapes.clear();  // پاک کردن شکل‌های قبلی
});

widget.activeChart().onIntervalChanged().subscribe(null, () => {
  console.log('Interval changed');
  shapes.clear();
});
```

---

## نمونه کامل

```typescript
import { NXCChartShapes, type APISignal } from 'nxc-chart-shapes';

// تنظیم استراتژی‌ها
const STRATEGIES = {
  315: {
    id: 315,
    name: 'Trend Line',
    shapeType: 'trend_line' as const,
    pointCount: 2,
    colors: { buy: '#4caf50', sell: '#f44336' }
  }
};

// ساخت instance
const shapes = new NXCChartShapes({
  theme: 'dark',
  showEntryMarker: true,
  strategies: STRATEGIES
});

// اتصال به widget
const widget = new TradingView.widget({ ... });
await shapes.attach(widget);

// fetch سیگنال
const response = await fetch('https://api.nexcrypto.trade/v1/signals/...');
const signal: APISignal = await response.json();

// رسم
const shapeIds = shapes.draw(signal);
console.log('Drew shapes:', shapeIds);

// بعداً: حذف
shapes.removeSignal(signal.signal_id);

// یا پاک کردن همه
shapes.clear();

// در پایان
shapes.destroy();
```
