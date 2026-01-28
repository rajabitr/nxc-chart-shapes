# استفاده در React / Next.js

## نصب

```bash
npm install nxc-chart-shapes
```

## ساختار پروژه

```
my-react-app/
├── public/
│   └── charting_library/     ◄── کتابخانه TradingView
├── src/
│   ├── components/
│   │   └── TradingChart.tsx
│   └── hooks/
│       └── useSignals.ts
└── package.json
```

## Strategies (Built-in)

**نیازی به تعریف strategies نیست!** کتابخانه 500+ استراتژی را built-in دارد:

- Ichimoku (1-30)
- SMA/WMA/EMA (31-120)
- MA Cross (121-180)
- RSI Divergence (215-220, 277-278)
- MACD Divergence (289-292)
- Trend Lines, Channels, Patterns, etc.

فقط اگر strategy سفارشی نیاز دارید:

```typescript
// اختیاری - فقط برای override یا strategy جدید
const CUSTOM_STRATEGIES = {
  999: {
    id: 999,
    name: 'My Custom',
    shapeType: 'rectangle',
    pointCount: 2,
    colors: { buy: '#00ff00', sell: '#ff0000' }
  }
};
```

## Hook برای Fetch سیگنال‌ها

```typescript
// src/hooks/useSignals.ts

import { useState, useCallback } from 'react';
import type { APISignal } from 'nxc-chart-shapes';

const API_BASE = 'https://api.nexcrypto.trade/v1';
const API_KEY = process.env.NEXT_PUBLIC_NXC_API_KEY;

export function useSignals() {
  const [signals, setSignals] = useState<APISignal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSignal = useCallback(async (signalId: string) => {
    const response = await fetch(`${API_BASE}/signals/${signalId}`, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': API_KEY || ''
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch signal: ${response.status}`);
    }

    return response.json() as Promise<APISignal>;
  }, []);

  const fetchSignals = useCallback(async (signalIds: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        signalIds.map(id => fetchSignal(id))
      );
      setSignals(results);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return [];
    } finally {
      setLoading(false);
    }
  }, [fetchSignal]);

  const clearSignals = useCallback(() => {
    setSignals([]);
  }, []);

  return { signals, loading, error, fetchSignals, clearSignals };
}
```

## کامپوننت TradingChart

```tsx
// src/components/TradingChart.tsx

import { useEffect, useRef, useCallback } from 'react';
import { NXCChartShapes, type APISignal } from 'nxc-chart-shapes';

// TypeScript declaration for TradingView
declare global {
  interface Window {
    TradingView: {
      widget: new (options: any) => any;
    };
  }
}

interface TradingChartProps {
  symbol: string;
  interval: string;
  signals?: APISignal[];
  theme?: 'light' | 'dark';
  onChartReady?: () => void;
}

export function TradingChart({
  symbol,
  interval,
  signals = [],
  theme = 'dark',
  onChartReady
}: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const shapesRef = useRef<NXCChartShapes | null>(null);

  // Initialize chart
  useEffect(() => {
    if (!containerRef.current || !window.TradingView) return;

    // Create widget
    widgetRef.current = new window.TradingView.widget({
      container: containerRef.current,
      symbol,
      interval,
      datafeed: createDatafeed(),
      library_path: '/charting_library/',
      locale: 'en',
      timezone: 'Etc/UTC',
      theme: theme === 'dark' ? 'Dark' : 'Light',
      autosize: true,
      disabled_features: [
        'use_localstorage_for_settings',
        'header_symbol_search'
      ]
    });

    widgetRef.current.onChartReady(async () => {
      // Initialize shapes (strategies are built-in)
      shapesRef.current = new NXCChartShapes({
        theme,
        showEntryMarker: true
      });

      await shapesRef.current.attach(widgetRef.current);
      onChartReady?.();
    });

    return () => {
      shapesRef.current?.destroy();
      widgetRef.current?.remove();
    };
  }, [symbol, interval, theme]);

  // Draw signals when they change
  useEffect(() => {
    if (!shapesRef.current?.isReady()) return;

    shapesRef.current.clear();

    if (signals.length > 0) {
      // draw() is async for indicators/divergence
      shapesRef.current.draw(signals);
    }
  }, [signals]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: '500px' }}
    />
  );
}

// Datafeed (simplified)
function createDatafeed() {
  return {
    onReady: (cb: any) => setTimeout(() => cb({
      supported_resolutions: ['1', '5', '15', '30', '60', '240', 'D', 'W']
    }), 0),

    resolveSymbol: (name: string, resolve: any) => setTimeout(() => resolve({
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

    getBars: async (symbolInfo: any, resolution: string, params: any, onResult: any) => {
      const interval: Record<string, string> = {
        '1': '1m', '5': '5m', '15': '15m', '30': '30m',
        '60': '1h', '240': '4h', 'D': '1d', 'W': '1w'
      };

      const res = await fetch(
        `https://api.binance.com/api/v3/klines?` +
        `symbol=${symbolInfo.name}&interval=${interval[resolution] || '1h'}&` +
        `startTime=${params.from * 1000}&endTime=${params.to * 1000}&limit=1000`
      );
      const data = await res.json();

      onResult(data.map((k: any) => ({
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
}
```

## صفحه اصلی

```tsx
// src/app/page.tsx (Next.js App Router)

'use client';

import { useState, useCallback } from 'react';
import { TradingChart } from '@/components/TradingChart';
import { useSignals } from '@/hooks/useSignals';

export default function HomePage() {
  const [signalIds, setSignalIds] = useState('');
  const { signals, loading, error, fetchSignals, clearSignals } = useSignals();

  const handleFetch = useCallback(async () => {
    const ids = signalIds.split(',').map(s => s.trim()).filter(Boolean);
    if (ids.length > 0) {
      await fetchSignals(ids);
    }
  }, [signalIds, fetchSignals]);

  const handleClear = useCallback(() => {
    clearSignals();
    setSignalIds('');
  }, [clearSignals]);

  return (
    <div className="container">
      <header className="header">
        <input
          type="text"
          value={signalIds}
          onChange={(e) => setSignalIds(e.target.value)}
          placeholder="Enter signal IDs (comma separated)"
        />
        <button onClick={handleFetch} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch & Draw'}
        </button>
        <button onClick={handleClear}>Clear</button>
      </header>

      {error && <div className="error">{error}</div>}

      <main className="chart-wrapper">
        <TradingChart
          symbol="BTCUSDT"
          interval="5"
          signals={signals}
          theme="dark"
        />
      </main>

      <aside className="sidebar">
        <h3>Loaded Signals ({signals.length})</h3>
        {signals.map(signal => (
          <div key={signal.signal_id} className="signal-card">
            <span>{signal.symbol}</span>
            <span className={signal.signal_type === 'B' ? 'buy' : 'sell'}>
              {signal.signal_type === 'B' ? 'BUY' : 'SELL'}
            </span>
          </div>
        ))}
      </aside>
    </div>
  );
}
```

## لود کردن TradingView Library

### روش 1: Script در HTML

```html
<!-- public/index.html -->
<script src="/charting_library/charting_library.standalone.js"></script>
```

### روش 2: Dynamic Import در Next.js

```tsx
// components/TradingChart.tsx

import dynamic from 'next/dynamic';

const TradingChartInner = dynamic(
  () => import('./TradingChartInner').then(mod => mod.TradingChartInner),
  { ssr: false }
);

export function TradingChart(props: TradingChartProps) {
  return <TradingChartInner {...props} />;
}
```

## نکات مهم

### 1. SSR در Next.js

TradingView فقط در مرورگر کار می‌کند:

```tsx
'use client'; // ◄── الزامی در Next.js App Router

// یا

const Chart = dynamic(() => import('./Chart'), { ssr: false });
```

### 2. Cleanup

```tsx
useEffect(() => {
  // setup...

  return () => {
    shapesRef.current?.destroy();
    widgetRef.current?.remove();
  };
}, []);
```

### 3. Symbol Change

```tsx
useEffect(() => {
  if (shapesRef.current?.isReady()) {
    shapesRef.current.clear();
    widgetRef.current?.activeChart().setSymbol(symbol);
  }
}, [symbol]);
```

### 4. Resize

TradingView با `autosize: true` خودش resize را مدیریت می‌کند.

## ساختار فایل کامل

```
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── TradingChart.tsx
│   └── SignalList.tsx
├── hooks/
│   ├── useSignals.ts
│   └── useTradingView.ts
├── types/
│   └── index.ts
└── styles/
    └── chart.css
```

**نکته:** فایل `config/strategies.ts` نیاز نیست چون همه strategies در کتابخانه built-in هستند.
