import type { ChartPoint, SignalPayload, ParsedPoint, PointExtractionResult } from '../types';

/**
 * Extract all points from signal payload
 * Points can be numbered as:
 * - p1p/p1t, p2p/p2t, etc. (regular points)
 * - z1p/z1t, z2p/z2t, etc. (zone points for double bottom/top)
 */
export function extractPoints(payload: SignalPayload): ChartPoint[] {
  const points: ChartPoint[] = [];

  // Try regular points first (p1p, p1t, p2p, p2t, ...)
  let i = 1;
  while (true) {
    const priceKey = `p${i}p`;
    const timeKey = `p${i}t`;

    const priceValue = payload[priceKey];
    const timeValue = payload[timeKey];

    if (priceValue === undefined || timeValue === undefined) {
      break;
    }

    const price = typeof priceValue === 'string' ? parseFloat(priceValue) : priceValue;
    const time = typeof timeValue === 'number' ? timeValue : parseFloat(String(timeValue));

    if (!isNaN(price) && !isNaN(time)) {
      points.push({
        price,
        time: Math.floor(time * 1000), // Convert seconds to milliseconds
      });
    }

    i++;
  }

  // If no regular points found, try zone points (z1p, z1t, z2p, z2t, ...)
  if (points.length === 0) {
    i = 1;
    while (true) {
      const priceKey = `z${i}p`;
      const timeKey = `z${i}t`;

      const priceValue = payload[priceKey];
      const timeValue = payload[timeKey];

      if (priceValue === undefined || timeValue === undefined) {
        break;
      }

      const price = typeof priceValue === 'string' ? parseFloat(priceValue) : priceValue;
      const time = typeof timeValue === 'number' ? timeValue : parseFloat(String(timeValue));

      if (!isNaN(price) && !isNaN(time)) {
        points.push({
          price,
          time: Math.floor(time * 1000), // Convert seconds to milliseconds
        });
      }

      i++;
    }
  }

  return points;
}

/**
 * Extract entry marker point from payload
 */
export function extractEntryMarker(payload: SignalPayload, closePrice: string): ChartPoint {
  return {
    time: payload.entryPoint * 1000, // Convert to milliseconds
    price: parseFloat(closePrice),
  };
}

/**
 * Extract all points and entry marker from signal
 */
export function extractAllPoints(
  payload: SignalPayload,
  closePrice: string
): PointExtractionResult {
  return {
    points: extractPoints(payload),
    entryMarker: extractEntryMarker(payload, closePrice),
  };
}

/**
 * Get parsed points with index
 */
export function getParsedPoints(payload: SignalPayload): ParsedPoint[] {
  const points: ParsedPoint[] = [];
  let i = 1;

  while (true) {
    const priceKey = `p${i}p`;
    const timeKey = `p${i}t`;

    const priceValue = payload[priceKey];
    const timeValue = payload[timeKey];

    if (priceValue === undefined || timeValue === undefined) {
      break;
    }

    const price = typeof priceValue === 'string' ? parseFloat(priceValue) : priceValue;
    const time = typeof timeValue === 'number' ? timeValue : parseInt(String(timeValue), 10);

    if (!isNaN(price) && !isNaN(time)) {
      points.push({
        index: i,
        price,
        time: time * 1000,
      });
    }

    i++;
  }

  return points;
}

/**
 * Validate that we have required number of points
 */
export function validatePointCount(points: ChartPoint[], required: number): boolean {
  return points.length >= required;
}

/**
 * Get specific point by index (1-based)
 */
export function getPointByIndex(payload: SignalPayload, index: number): ChartPoint | null {
  const priceKey = `p${index}p`;
  const timeKey = `p${index}t`;

  const priceValue = payload[priceKey];
  const timeValue = payload[timeKey];

  if (priceValue === undefined || timeValue === undefined) {
    return null;
  }

  const price = typeof priceValue === 'string' ? parseFloat(priceValue) : priceValue;
  const time = typeof timeValue === 'number' ? timeValue : parseInt(String(timeValue), 10);

  if (isNaN(price) || isNaN(time)) {
    return null;
  }

  return {
    price,
    time: time * 1000,
  };
}

/**
 * Sort points by time
 */
export function sortPointsByTime(points: ChartPoint[]): ChartPoint[] {
  return [...points].sort((a, b) => a.time - b.time);
}

/**
 * Sort points by price
 */
export function sortPointsByPrice(points: ChartPoint[]): ChartPoint[] {
  return [...points].sort((a, b) => a.price - b.price);
}

/**
 * Calculate center point of multiple points
 */
export function calculateCenterPoint(points: ChartPoint[]): ChartPoint {
  if (points.length === 0) {
    return { time: 0, price: 0 };
  }

  const sumTime = points.reduce((sum, p) => sum + p.time, 0);
  const sumPrice = points.reduce((sum, p) => sum + p.price, 0);

  return {
    time: sumTime / points.length,
    price: sumPrice / points.length,
  };
}
