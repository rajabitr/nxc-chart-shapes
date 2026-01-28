# یکپارچگی با TradingView

## کتابخانه TradingView چیست؟

TradingView Charting Library یک کتابخانه JavaScript است که امکان نمایش نمودارهای مالی حرفه‌ای را فراهم می‌کند. این کتابخانه:
- اختصاصی است و نیاز به لایسنس دارد
- ابزارهای رسم شکل دارد
- قابلیت افزودن اندیکاتور دارد
- API برای کنترل برنامه‌نویسی دارد

## ساختار TradingView

```
TradingView Widget
│
├── onChartReady() ──────▶ زمانی که نمودار آماده شد
│
├── activeChart() ───────▶ دسترسی به نمودار فعال
│   │
│   ├── createMultipointShape() ──▶ ساخت شکل چند نقطه‌ای
│   │
│   ├── createShape() ────────────▶ ساخت شکل تک نقطه‌ای
│   │
│   ├── removeEntity() ───────────▶ حذف یک شکل
│   │
│   ├── removeAllShapes() ────────▶ حذف همه شکل‌ها
│   │
│   └── getAllShapes() ───────────▶ لیست همه شکل‌ها
│
└── remove() ────────────▶ نابود کردن widget
```

## چگونه شکل روی TradingView رسم می‌شود؟

### 1. ساخت Widget

```javascript
const widget = new TradingView.widget({
  container: 'chart-container',
  symbol: 'BTCUSDT',
  interval: '15',
  datafeed: myDatafeed,
  library_path: '/charting_library/',
  // ...
});
```

### 2. منتظر آماده شدن

```javascript
widget.onChartReady(() => {
  // حالا می‌توانیم با نمودار کار کنیم
  const chart = widget.activeChart();
});
```

### 3. رسم شکل

```javascript
// شکل چند نقطه‌ای (مثل خط روند)
chart.createMultipointShape(
  [
    { time: 1769468699, price: 88013.5 },
    { time: 1769505299, price: 87976.5 }
  ],
  {
    shape: 'trend_line',
    lock: false,
    disableSelection: true,
    overrides: {
      linecolor: '#f44336',
      linewidth: 2,
      linestyle: 0
    }
  }
);

// شکل تک نقطه‌ای (مثل فلش)
chart.createShape(
  { time: 1769505299, price: 87969.7 },
  {
    shape: 'arrow_down',
    overrides: {
      color: '#f44336'
    }
  }
);
```

## انواع شکل‌های TradingView

### خطوط (Lines)

| نام در TradingView | نام فارسی | نقاط |
|-------------------|-----------|------|
| `trend_line` | خط روند | 2 |
| `horizontal_line` | خط افقی | 1 |
| `vertical_line` | خط عمودی | 1 |
| `extended_line` | خط امتداد یافته | 2 |
| `ray` | پرتو | 2 |
| `arrow` | فلش | 2 |

### کانال‌ها (Channels)

| نام در TradingView | نام فارسی | نقاط |
|-------------------|-----------|------|
| `parallel_channel` | کانال موازی | 3-4 |
| `regression_trend` | کانال رگرسیون | 2 |

### مستطیل و زون (Rectangles)

| نام در TradingView | نام فارسی | نقاط |
|-------------------|-----------|------|
| `rectangle` | مستطیل | 2 |
| `rotated_rectangle` | مستطیل چرخیده | 2 |

### فیبوناچی (Fibonacci)

| نام در TradingView | نام فارسی | نقاط |
|-------------------|-----------|------|
| `fib_retracement` | اصلاحی فیبوناچی | 2 |
| `fib_trend_ext` | گسترش روندی | 3 |
| `fib_speed_resistance_fan` | بادبزن سرعت | 2 |

### الگوها (Patterns)

| نام در TradingView | نام فارسی | نقاط |
|-------------------|-----------|------|
| `abcd_pattern` | الگوی ABCD | 4 |
| `xabcd_pattern` | الگوی XABCD | 5 |
| `triangle_pattern` | مثلث | 3 |
| `head_and_shoulders` | سر و شانه | 5+ |
| `three_drives` | سه درایو | 5+ |

### نشانگرها (Markers)

| نام در TradingView | نام فارسی | نقاط |
|-------------------|-----------|------|
| `arrow_up` | فلش بالا | 1 |
| `arrow_down` | فلش پایین | 1 |
| `flag` | پرچم | 1 |
| `icon` | آیکون | 1 |
| `text` | متن | 1 |
| `balloon` | بالن | 1 |

## Overrides (تنظیمات شکل)

### تنظیمات عمومی

```javascript
{
  // رنگ خط
  linecolor: '#f44336',

  // ضخامت خط (1 تا 4)
  linewidth: 2,

  // استایل خط
  // 0 = خط ممتد
  // 1 = نقطه‌چین
  // 2 = خط‌چین
  linestyle: 0,

  // رنگ پس‌زمینه
  backgroundColor: 'rgba(255, 0, 0, 0.1)',

  // پر کردن پس‌زمینه
  fillBackground: true,

  // شفافیت (0 تا 100)
  transparency: 80
}
```

### تنظیمات خط روند

```javascript
{
  linecolor: '#2196f3',
  linewidth: 2,
  linestyle: 0,
  extendLeft: false,   // امتداد به چپ
  extendRight: false,  // امتداد به راست
  showLabel: false,    // نمایش برچسب
  showPrice: true      // نمایش قیمت
}
```

### تنظیمات کانال

```javascript
{
  linecolor: '#00bcd4',
  linewidth: 2,
  fillBackground: true,
  backgroundColor: 'rgba(0, 188, 212, 0.1)',
  showMidline: true,          // نمایش خط میانی
  midlineColor: '#00bcd4',
  midlineStyle: 2,            // خط‌چین
  midlineWidth: 1,
  extendLeft: false,
  extendRight: false
}
```

### تنظیمات فیبوناچی

```javascript
{
  linecolor: '#e91e63',
  linewidth: 1,
  showCoeffs: true,     // نمایش ضرایب
  showPrices: true,     // نمایش قیمت‌ها
  fillBackground: true,
  extendLines: false,

  // سطوح فیبوناچی
  level1: 0,
  level2: 0.236,
  level3: 0.382,
  level4: 0.5,
  level5: 0.618,
  level6: 0.786,
  level7: 1
}
```

## نحوه اتصال کتابخانه ما به TradingView

### کد ShapeRenderer

```typescript
// src/core/ShapeRenderer.ts

export class ShapeRenderer {
  private widget: TradingViewWidget | null = null;
  private chart: TradingViewChart | null = null;

  // اتصال به widget
  async attach(widget: TradingViewWidget): Promise<void> {
    return new Promise((resolve) => {
      this.widget = widget;

      widget.onChartReady(() => {
        this.chart = widget.activeChart();
        resolve();
      });
    });
  }

  // رسم شکل
  draw(shapeResult: ShapeResult): string | null {
    // تبدیل نقاط به فرمت TradingView (ثانیه)
    const tvPoints = shapeResult.points.map(p => ({
      time: Math.floor(p.time / 1000),  // میلی‌ثانیه به ثانیه
      price: p.price
    }));

    // ساخت شکل
    if (tvPoints.length === 1) {
      return this.chart.createShape(tvPoints[0], {
        shape: shapeResult.type,
        overrides: shapeResult.overrides
      });
    } else {
      return this.chart.createMultipointShape(tvPoints, {
        shape: shapeResult.type,
        overrides: shapeResult.overrides
      });
    }
  }
}
```

## تفاوت زمان در API و TradingView

```
┌─────────────────────────────────────────────────────────────────────┐
│                        فرمت‌های زمان                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  API Signal (ثانیه با اعشار):                                        │
│  p1t: 1769468699.999                                                │
│       │                                                              │
│       ▼                                                              │
│  داخلی کتابخانه (میلی‌ثانیه):                                         │
│  time: 1769468699999                                                 │
│       │                                                              │
│       ▼                                                              │
│  TradingView (ثانیه صحیح):                                           │
│  time: 1769468699                                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

تبدیل‌ها:
- API → Internal:  time * 1000
- Internal → TV:   Math.floor(time / 1000)
```

## چک‌لیست یکپارچگی

| مورد | توضیح | وضعیت |
|------|-------|-------|
| onChartReady | صبر برای آماده شدن چارت | ✅ |
| createMultipointShape | شکل‌های چند نقطه‌ای | ✅ |
| createShape | شکل‌های تک نقطه‌ای | ✅ |
| removeEntity | حذف تکی | ✅ |
| removeAllShapes | حذف همه | ✅ |
| Overrides | تنظیمات ظاهری | ✅ |
| زمان ثانیه | تبدیل صحیح | ✅ |

## خطاهای رایج

### 1. شکل رسم نمی‌شود
```javascript
// ❌ غلط - زمان میلی‌ثانیه
{ time: 1769468699999, price: 100 }

// ✅ درست - زمان ثانیه
{ time: 1769468699, price: 100 }
```

### 2. چارت آماده نیست
```javascript
// ❌ غلط - بدون انتظار
const shapes = new NXCChartShapes();
shapes.attach(widget);
shapes.draw(signals);  // ممکن است fail شود

// ✅ درست - با await
const shapes = new NXCChartShapes();
await shapes.attach(widget);
shapes.draw(signals);
```

### 3. شکل پیدا نمی‌شود (زمان اشتباه)
```javascript
// اگر زمان خیلی قدیمی یا جدید باشد، شکل خارج از viewport رسم می‌شود
// باید چارت را به آن نقطه ببرید یا زمان را بررسی کنید
```
