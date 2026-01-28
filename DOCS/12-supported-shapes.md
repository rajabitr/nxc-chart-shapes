# لیست کامل شکل‌های پشتیبانی شده

## جدول شکل‌ها

| shapeType | نام فارسی | نقاط | توضیح |
|-----------|-----------|------|-------|
| `trend_line` | خط روند | 2 | خط از نقطه A به B |
| `horizontal_line` | خط افقی | 1 | خط افقی در یک قیمت |
| `vertical_line` | خط عمودی | 1 | خط عمودی در یک زمان |
| `extended_line` | خط امتداد یافته | 2 | خط روند با امتداد به راست |
| `parallel_channel` | کانال موازی | 3-4 | دو خط موازی |
| `rectangle` | مستطیل/زون | 2 | منطقه حمایت/مقاومت |
| `fib_retracement` | فیبوناچی اصلاحی | 2 | سطوح اصلاحی فیبوناچی |
| `fib_extension` | فیبوناچی گسترشی | 3 | سطوح گسترش فیبوناچی |
| `fib_trend_ext` | فیبوناچی روندی | 3 | گسترش روندی فیبوناچی |
| `triangle` | مثلث | 3 | الگوی مثلث |
| `abcd_pattern` | الگوی ABCD | 4 | الگوی هارمونیک ABCD |
| `xabcd_pattern` | الگوی XABCD | 5 | الگوی هارمونیک XABCD |
| `head_and_shoulders` | سر و شانه | 5+ | الگوی سر و شانه |
| `three_drives` | سه درایو | 5+ | الگوی سه درایو |
| `arrow` | فلش | 1 | نشانگر ورود/خروج |
| `icon` | آیکون | 1 | آیکون سفارشی |
| `balloon` | بالن | 1 | بالن با متن |
| `callout` | کالوت | 1 | برچسب با متن |
| `text` | متن | 1 | متن ساده |
| `note` | یادداشت | 1 | یادداشت چسبیده |

## نمونه Strategy Config برای هر شکل

### خطوط (Lines)

```javascript
// Trend Line
{
  id: 315,
  name: 'Trend Line',
  shapeType: 'trend_line',
  pointCount: 2,
  colors: { buy: '#4caf50', sell: '#f44336' }
}

// Horizontal Line
{
  id: 316,
  name: 'Horizontal Line',
  shapeType: 'horizontal_line',
  pointCount: 1,
  colors: { buy: '#ff9800', sell: '#ff5722' }
}

// Vertical Line
{
  id: 317,
  name: 'Vertical Line',
  shapeType: 'vertical_line',
  pointCount: 1,
  colors: { buy: '#9c27b0', sell: '#e91e63' }
}
```

### کانال‌ها (Channels)

```javascript
// Parallel Channel
{
  id: 293,
  name: 'Channel Pattern',
  shapeType: 'parallel_channel',
  pointCount: 3,  // یا 4
  colors: { buy: '#00bcd4', sell: '#e91e63' }
}
```

### زون‌ها (Zones)

```javascript
// Rectangle/Zone
{
  id: 320,
  name: 'Support/Resistance Zone',
  shapeType: 'rectangle',
  pointCount: 2,
  colors: { buy: '#009688', sell: '#e91e63' }
}
```

### فیبوناچی (Fibonacci)

```javascript
// Fibonacci Retracement
{
  id: 330,
  name: 'Fibonacci Retracement',
  shapeType: 'fib_retracement',
  pointCount: 2,
  colors: { buy: '#9c27b0', sell: '#ff5722' }
}

// Fibonacci Extension
{
  id: 331,
  name: 'Fibonacci Extension',
  shapeType: 'fib_extension',
  pointCount: 3,
  colors: { buy: '#673ab7', sell: '#ff5722' }
}

// Fibonacci Trend Extension
{
  id: 332,
  name: 'Fibonacci Trend Extension',
  shapeType: 'fib_trend_ext',
  pointCount: 3,
  colors: { buy: '#3f51b5', sell: '#f44336' }
}
```

### الگوها (Patterns)

```javascript
// Triangle
{
  id: 360,
  name: 'Triangle',
  shapeType: 'triangle',
  pointCount: 3,
  colors: { buy: '#00bcd4', sell: '#ff5722' }
}

// ABCD Pattern
{
  id: 340,
  name: 'ABCD Pattern',
  shapeType: 'abcd_pattern',
  pointCount: 4,
  colors: { buy: '#3f51b5', sell: '#f44336' }
}

// XABCD Pattern (Harmonic)
{
  id: 350,
  name: 'XABCD Pattern',
  shapeType: 'xabcd_pattern',
  pointCount: 5,
  colors: { buy: '#795548', sell: '#ff5722' }
}

// Head and Shoulders
{
  id: 370,
  name: 'Head and Shoulders',
  shapeType: 'head_and_shoulders',
  pointCount: 5,
  colors: { buy: '#4caf50', sell: '#f44336' }
}

// Three Drives
{
  id: 380,
  name: 'Three Drives',
  shapeType: 'three_drives',
  pointCount: 5,
  colors: { buy: '#009688', sell: '#e91e63' }
}
```

### نشانگرها (Markers)

```javascript
// Arrow
{
  id: 514,
  name: 'Entry Signal',
  shapeType: 'arrow',
  pointCount: 0,  // فقط از entryPoint استفاده می‌کند
  colors: { buy: '#00e676', sell: '#ff1744' }
}

// Balloon
{
  id: 515,
  name: 'Balloon',
  shapeType: 'balloon',
  pointCount: 1,
  colors: { buy: '#2196f3', sell: '#f44336' }
}

// Text Label
{
  id: 516,
  name: 'Text Label',
  shapeType: 'text',
  pointCount: 1,
  colors: { buy: '#4caf50', sell: '#f44336' }
}
```

## فرمت Payload برای هر شکل

### شکل 2 نقطه‌ای (مثل trend_line)

```json
{
  "payload": {
    "p1p": "88013.5",
    "p1t": 1769468699.999,
    "p2p": "87976.5",
    "p2t": 1769505299.999,
    "entryPoint": 1769505299.999
  }
}
```

### شکل 3 نقطه‌ای (مثل parallel_channel, fib_extension)

```json
{
  "payload": {
    "p1p": "88000",
    "p1t": 1769468699,
    "p2p": "87500",
    "p2t": 1769490000,
    "p3p": "87800",
    "p3t": 1769505299,
    "entryPoint": 1769505299
  }
}
```

### شکل 4 نقطه‌ای (مثل abcd_pattern)

```json
{
  "payload": {
    "p1p": "88000",
    "p1t": 1769400000,
    "p2p": "87000",
    "p2t": 1769450000,
    "p3p": "87500",
    "p3t": 1769480000,
    "p4p": "86500",
    "p4t": 1769505299,
    "entryPoint": 1769505299
  }
}
```

### شکل 5 نقطه‌ای (مثل xabcd_pattern)

```json
{
  "payload": {
    "p1p": "88000",
    "p1t": 1769350000,
    "p2p": "87000",
    "p2t": 1769400000,
    "p3p": "87500",
    "p3t": 1769450000,
    "p4p": "86800",
    "p4t": 1769480000,
    "p5p": "87200",
    "p5t": 1769505299,
    "entryPoint": 1769505299
  }
}
```

### شکل 1 نقطه‌ای (مثل arrow, balloon)

```json
{
  "payload": {
    "p1p": "87969.70",
    "p1t": 1769505299.999,
    "entryPoint": 1769505299.999
  }
}
```

## اندیکاتورها (Indicators)

کتابخانه از اندیکاتورهای TradingView پشتیبانی می‌کند:

| shapeType | نام | توضیح |
|-----------|-----|-------|
| `indicator_IchimokuCloud` | ایچیموکو | ابر ایچیموکو |
| `indicator_MASimple` | SMA | میانگین متحرک ساده |
| `indicator_MAWeighted` | WMA | میانگین متحرک وزنی |
| `indicator_MAExponential` | EMA | میانگین متحرک نمایی |
| `indicator_RSI` | RSI | شاخص قدرت نسبی |
| `indicator_MACD` | MACD | مکدی |
| `indicator_Volume` | Volume | حجم معاملات |

### Strategy IDs برای اندیکاتورها

```javascript
// Ichimoku Cloud: 1-30, 496, 497
// SMA 10: 31-34, 51-52
// SMA 20: 35-38, 53-54
// SMA 50: 39-42, 55-56
// SMA 100: 43-46, 57-58
// SMA 200: 47-50, 59-60
// WMA 10: 61-64, 81-82
// WMA 20: 65-68, 83-84
// WMA 50: 69-72, 85-86
// WMA 100: 73-76, 87-88
// WMA 200: 77-80, 89-90
// EMA 10: 91-94, 111-112
// EMA 20: 95-98, 113-114
// EMA 50: 99-102, 115-116
// EMA 100: 103-106, 117-118
// EMA 200: 107-110, 119-120
```

## MA Cross Strategies (121-180)

این استراتژی‌ها **دو** میانگین متحرک رسم می‌کنند:

| Strategy IDs | نام | توضیح |
|--------------|-----|-------|
| 121-140 | SMA Crossover | تقاطع SMA ها |
| 141-160 | WMA Crossover | تقاطع WMA ها |
| 161-180 | EMA Crossover | تقاطع EMA ها |

```javascript
// مثال: SMA50 crosses SMA200 (Golden Cross / Death Cross)
// strategy_id: 137 (crosses up), 138 (crosses down)
// نتیجه: دو اندیکاتور SMA50 و SMA200 روی چارت رسم می‌شود
```

## RSI Divergence (215-220, 277-278)

این استراتژی **4 شکل** رسم می‌کند:

1. **RSI Indicator** - اندیکاتور RSI در پنل جداگانه
2. **Trend Line روی چارت قیمت** - از p1 به p2
3. **Trend Line روی RSI pane** - از p3 به p4 (با `ownerStudyId: 'RSI'`)
4. **Entry Marker** - خط عمودی در نقطه ورود

### فرمت Payload برای RSI Divergence

```json
{
  "payload": {
    "p1p": "88000",      // قیمت نقطه 1 (روی چارت قیمت)
    "p1t": 1769400000,
    "p2p": "87500",      // قیمت نقطه 2 (روی چارت قیمت)
    "p2t": 1769450000,
    "p3p": "48.79",      // مقدار RSI نقطه 1 (روی RSI pane)
    "p3t": 1769400000,
    "p4p": "47.96",      // مقدار RSI نقطه 2 (روی RSI pane)
    "p4t": 1769450000,
    "entryPoint": 1769450000
  }
}
```

## MACD Divergence (289-292)

مشابه RSI Divergence، **4 شکل** رسم می‌کند:

1. **MACD Indicator** - اندیکاتور MACD در پنل جداگانه
2. **Trend Line روی چارت قیمت** - از p1 به p2
3. **Trend Line روی MACD pane** - از p3 به p4 (با `ownerStudyId: 'MACD'`)
4. **Entry Marker** - خط عمودی در نقطه ورود

## ownerStudyId - رسم روی پنل اندیکاتور

برای رسم شکل روی پنل اندیکاتور (مثل RSI یا MACD) از `ownerStudyId` استفاده کنید:

```javascript
{
  type: 'trend_line',
  points: [point1, point2],
  overrides: {
    linecolor: '#ff0000',
    linewidth: 2,
    ownerStudyId: 'RSI',  // رسم روی پنل RSI
    // یا: ownerStudyId: 'MACD'  // رسم روی پنل MACD
  }
}
```

**نکته مهم:** اول باید اندیکاتور ساخته شود، بعد شکل روی آن رسم شود. کتابخانه این کار را خودکار انجام می‌دهد.

## extendRight - امتداد خطوط

همه خطوط روند (trend_line) به صورت پیش‌فرض `extendRight: true` دارند:

```javascript
{
  type: 'trend_line',
  overrides: {
    extendRight: true,   // خط به سمت راست امتداد می‌یابد
    extendLeft: false
  }
}
```

## نکات مهم

1. **entryPoint همیشه الزامی است** - حتی اگر شکل نقاط دیگر داشته باشد

2. **زمان‌ها به ثانیه هستند** - با اعشار (مثل `1769468699.999`)

3. **قیمت‌ها می‌توانند string یا number باشند** - کتابخانه هر دو را پردازش می‌کند

4. **signal_type رنگ را تعیین می‌کند**:
   - `"B"` (Buy) → رنگ سبز
   - `"S"` (Sell) → رنگ قرمز

5. **strategy_id باید در registry ثبت شده باشد** - وگرنه از auto-detection استفاده می‌شود

6. **Divergence ها 4 نقطه دارند** - p1,p2 برای چارت قیمت، p3,p4 برای پنل اندیکاتور

7. **MA Cross ها 2 اندیکاتور رسم می‌کنند** - هر دو MA روی چارت نمایش داده می‌شوند
