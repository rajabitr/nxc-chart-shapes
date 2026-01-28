# عیب‌یابی و مشکلات رایج

## 1. شکل روی نمودار دیده نمی‌شود

### علت احتمالی: زمان خارج از محدوده

```
مشکل: شکل رسم شده اما دیده نمی‌شود
علت: زمان نقاط خارج از محدوده قابل مشاهده نمودار است
```

**راه حل:**
```javascript
// بررسی زمان سیگنال
console.log('Signal time:', new Date(signal.payload.p1t * 1000));

// بررسی محدوده نمودار
const range = widget.activeChart().getVisibleRange();
console.log('Chart range:', new Date(range.from * 1000), 'to', new Date(range.to * 1000));

// جابجایی نمودار به زمان سیگنال
widget.activeChart().setVisibleRange({
  from: signal.payload.p1t - 3600,  // 1 ساعت قبل
  to: signal.payload.p1t + 3600      // 1 ساعت بعد
});
```

---

### علت احتمالی: strategy_id تعریف نشده

```
مشکل: هیچ شکلی رسم نمی‌شود
علت: strategy_id سیگنال در registry وجود ندارد
```

**راه حل:**
```javascript
// بررسی
console.log('Signal strategy_id:', signal.strategy_id);
console.log('Has strategy:', shapes.hasStrategy(signal.strategy_id));
console.log('Registered strategies:', shapes.getRegisteredStrategies());

// اضافه کردن strategy
shapes.registerStrategy(signal.strategy_id, {
  id: signal.strategy_id,
  name: 'Unknown Strategy',
  shapeType: 'trend_line',
  pointCount: 2,
  colors: { buy: '#4caf50', sell: '#f44336' }
});
```

---

### علت احتمالی: چارت آماده نیست

```
مشکل: خطای "Chart not ready"
علت: draw() قبل از attach() صدا زده شده
```

**راه حل:**
```javascript
// ❌ غلط
const shapes = new NXCChartShapes();
shapes.attach(widget);
shapes.draw(signals);  // ممکن است fail شود

// ✅ درست
const shapes = new NXCChartShapes();
await shapes.attach(widget);  // صبر کنید
shapes.draw(signals);

// یا با callback
widget.onChartReady(() => {
  shapes.attach(widget).then(() => {
    shapes.draw(signals);
  });
});
```

---

## 2. رنگ شکل اشتباه است

### علت: signal_type نادرست یا colors تعریف نشده

```javascript
// بررسی
console.log('Signal type:', signal.signal_type);
console.log('Strategy config:', shapes.getStrategyConfig(signal.strategy_id));

// اطمینان از وجود colors
registerStrategy(315, {
  id: 315,
  name: 'My Strategy',
  shapeType: 'trend_line',
  pointCount: 2,
  colors: {
    buy: '#4caf50',   // ◄── الزامی
    sell: '#f44336'   // ◄── الزامی
  }
});
```

---

## 3. نقاط شکل جابجا هستند

### علت: تبدیل زمان اشتباه

```
مشکل: شکل در زمان اشتباهی رسم می‌شود
علت: API ثانیه می‌فرستد، کتابخانه میلی‌ثانیه می‌خواهد، TradingView ثانیه می‌خواهد
```

**جریان صحیح:**
```
API (ثانیه با اعشار):  1769468699.999
                           │
                           │ × 1000
                           ▼
Internal (میلی‌ثانیه):  1769468699999
                           │
                           │ ÷ 1000
                           ▼
TradingView (ثانیه):    1769468699
```

**بررسی:**
```javascript
// داده خام
console.log('Raw p1t:', signal.payload.p1t);

// بعد از parse
const points = extractPoints(signal.payload);
console.log('Parsed points:', points);

// زمان نهایی برای TV
points.forEach(p => {
  console.log('TV time:', Math.floor(p.time / 1000));
});
```

---

## 4. خطای TypeScript

### خطا: Cannot find module 'nxc-chart-shapes'

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

### خطا: Type errors with TradingView

```typescript
// تعریف type برای TradingView
declare global {
  interface Window {
    TradingView: {
      widget: new (options: any) => any;
    };
  }
}
```

---

## 5. مشکلات Build

### خطا: Cannot find module '@rollup/plugin-...'

```bash
npm install --save-dev @rollup/plugin-commonjs @rollup/plugin-node-resolve @rollup/plugin-typescript @rollup/plugin-terser
```

### خطا: TypeScript errors during build

```bash
# Clean and rebuild
npm run clean
npm run build
```

---

## 6. مشکلات UMD در مرورگر

### خطا: NXCChartShapes is not defined

```html
<!-- اطمینان از ترتیب صحیح script ها -->
<script src="charting_library/charting_library.standalone.js"></script>
<script src="nxc-chart-shapes.umd.js"></script>

<script>
  // استفاده
  const shapes = new NXCChartShapes.default({...});
  // یا
  const { NXCChartShapes } = window.NXCChartShapes;
  const shapes = new NXCChartShapes({...});
</script>
```

### خطا: TradingView is not defined

```javascript
// صبر برای لود شدن
function waitForTradingView(callback, timeout = 10000) {
  const start = Date.now();
  const check = setInterval(() => {
    if (window.TradingView) {
      clearInterval(check);
      callback();
    } else if (Date.now() - start > timeout) {
      clearInterval(check);
      console.error('TradingView not loaded');
    }
  }, 100);
}

waitForTradingView(() => {
  initChart();
});
```

---

## 7. مشکلات WebView

### شکل‌ها در موبایل رسم نمی‌شوند

```javascript
// Debug mode
window.onerror = function(msg, url, line) {
  alert('Error: ' + msg + '\nLine: ' + line);
  return false;
};

// Log همه چیز
console.log = function(...args) {
  if (window.NativeApp && window.NativeApp.log) {
    window.NativeApp.log(JSON.stringify(args));
  }
};
```

### JSON parse error

```javascript
// در Native code، escape کنید
val escaped = jsonString
    .replace("\\", "\\\\")
    .replace("'", "\\'")
    .replace("\"", "\\\"")
    .replace("\n", "\\n")

webView.evaluateJavascript("drawSignals('$escaped')") { }
```

---

## 8. Performance Issues

### کندی با تعداد زیاد شکل

```javascript
// حذف شکل‌های قدیمی
if (shapes.getShapeCount() > 50) {
  shapes.clear();
}

// یا فقط سیگنال‌های اخیر را رسم کنید
const recentSignals = signals.slice(-20);
shapes.draw(recentSignals);
```

### Memory leak

```javascript
// همیشه cleanup کنید
useEffect(() => {
  const shapes = new NXCChartShapes({...});

  return () => {
    shapes.destroy();  // ◄── مهم!
  };
}, []);
```

---

## 9. چک‌لیست Debug

```javascript
function debugSignal(signal, shapes) {
  console.group('Signal Debug');

  // 1. بررسی سیگنال
  console.log('Signal ID:', signal.signal_id);
  console.log('Strategy ID:', signal.strategy_id);
  console.log('Signal Type:', signal.signal_type);
  console.log('Symbol:', signal.symbol);

  // 2. بررسی payload
  console.log('Payload:', signal.payload);
  console.log('Entry Point:', new Date(signal.payload.entryPoint * 1000));

  // 3. بررسی strategy
  console.log('Has Strategy:', shapes.hasStrategy(signal.strategy_id));
  console.log('Strategy Config:', shapes.parser?.getStrategyConfig(signal.strategy_id));

  // 4. بررسی نقاط
  const points = extractPoints(signal.payload);
  console.log('Extracted Points:', points);
  points.forEach((p, i) => {
    console.log(`Point ${i+1}:`, {
      price: p.price,
      time: new Date(p.time)
    });
  });

  // 5. بررسی shapes manager
  console.log('Shapes Ready:', shapes.isReady());
  console.log('Shape Count:', shapes.getShapeCount());

  console.groupEnd();
}

// استفاده
debugSignal(mySignal, shapesManager);
```

---

## 10. گزارش Bug

اگر مشکلی پیدا کردید، این اطلاعات را گزارش دهید:

```javascript
const bugReport = {
  // اطلاعات سیستم
  userAgent: navigator.userAgent,
  platform: navigator.platform,

  // نسخه‌ها
  libraryVersion: '1.0.0',  // نسخه nxc-chart-shapes
  tradingViewVersion: TradingView?.version || 'unknown',

  // سیگنال مشکل‌دار
  signal: JSON.stringify(signal),

  // خطا
  error: error.message,
  stack: error.stack,

  // وضعیت
  isReady: shapes?.isReady(),
  shapeCount: shapes?.getShapeCount(),
  registeredStrategies: shapes?.getRegisteredStrategies()
};

console.log('Bug Report:', JSON.stringify(bugReport, null, 2));
```
