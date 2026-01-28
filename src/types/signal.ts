/**
 * API Signal format from NexCryptoTrade backend
 */
export interface APISignal {
  signal_id: string;
  exchange_id: number;
  symbol: string;
  timeframe_min: number;
  strategy_id: number;
  signal_type: 'S' | 'B';
  pivot_type: number | null;
  zone_range: number | null;
  candle_close_unix: number;
  close_price: string;
  payload: SignalPayload;
  created_at: string;
}

/**
 * Signal payload containing point data
 * Points are numbered p1p/p1t, p2p/p2t, etc.
 */
export interface SignalPayload {
  [key: string]: string | number | undefined;
  entryPoint: number;
  p1p?: string | number;
  p1t?: number;
  p2p?: string | number;
  p2t?: number;
  p3p?: string | number;
  p3t?: number;
  p4p?: string | number;
  p4t?: number;
  p5p?: string | number;
  p5t?: number;
}

/**
 * Parsed point from payload
 */
export interface ParsedPoint {
  index: number;
  price: number;
  time: number;
}
