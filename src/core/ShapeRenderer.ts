import type {
  ChartPoint,
  ShapeDrawOptions,
  ShapeResult,
  StoredShape,
  TradingViewChart,
  TradingViewPoint,
  TradingViewShapeId,
  TradingViewWidget,
} from '../types';

/**
 * Renders shapes on TradingView chart
 */
export class ShapeRenderer {
  private widget: TradingViewWidget | null = null;
  private chart: TradingViewChart | null = null;
  private shapes: Map<string, StoredShape> = new Map();
  private studyIds: Map<string, TradingViewShapeId> = new Map(); // Store study IDs by type (RSI, MACD, etc.)
  private isReady = false;

  /**
   * Attach to a TradingView widget
   */
  attach(widget: TradingViewWidget): Promise<void> {
    return new Promise((resolve) => {
      this.widget = widget;

      widget.onChartReady(() => {
        this.chart = widget.activeChart();
        this.isReady = true;
        resolve();
      });
    });
  }

  /**
   * Check if renderer is ready
   */
  ready(): boolean {
    return this.isReady && this.chart !== null;
  }

  /**
   * Draw a single shape on the chart
   */
  draw(shapeResult: ShapeResult, options: ShapeDrawOptions = {}): string | null {
    if (!this.chart) {
      console.warn('[NXCChartShapes] Chart not ready');
      return null;
    }

    // Check if this is an indicator (type starts with "indicator_")
    if (shapeResult.type.startsWith('indicator_')) {
      return this.drawIndicator(shapeResult, options);
    }

    const tvPoints = this.convertPoints(shapeResult.points);
    if (tvPoints.length === 0) {
      console.warn('[NXCChartShapes] No valid points to draw');
      return null;
    }

    // Check if shape should be drawn on a study pane
    let ownerStudyId: TradingViewShapeId | undefined;
    if (shapeResult.overrides?.ownerStudyId) {
      const studyType = shapeResult.overrides.ownerStudyId as string;
      ownerStudyId = this.studyIds.get(studyType);
      console.log('[NXCChartShapes] Drawing on study pane:', studyType, 'studyId:', ownerStudyId);
    }

    // Remove internal properties from overrides before passing to TradingView
    const cleanOverrides = { ...shapeResult.overrides };
    delete cleanOverrides.ownerStudyId;
    delete cleanOverrides.drawOnStudy;

    const shapeOptions: {
      shape: string;
      lock: boolean;
      disableSelection: boolean;
      disableSave: boolean;
      disableUndo: boolean;
      overrides: Record<string, unknown>;
      zOrder: 'top' | 'bottom' | 'normal';
      ownerStudyId?: TradingViewShapeId;
    } = {
      shape: shapeResult.type,
      lock: options.lock ?? false,
      disableSelection: options.disableSelection ?? false,
      disableSave: options.disableSave ?? true,
      disableUndo: options.disableUndo ?? true,
      overrides: cleanOverrides,
      zOrder: options.zOrder ?? 'top',
    };

    // Add ownerStudyId if drawing on a study pane
    if (ownerStudyId) {
      shapeOptions.ownerStudyId = ownerStudyId;
    }

    let shapeId: TradingViewShapeId | null;

    // Debug logging
    console.log('[NXCChartShapes] Drawing shape:', {
      type: shapeResult.type,
      points: tvPoints,
      overrides: cleanOverrides,
      ownerStudyId,
    });

    // Use createShape for single-point shapes, createMultipointShape for others
    if (tvPoints.length === 1) {
      shapeId = this.chart.createShape(tvPoints[0], shapeOptions as any);
    } else {
      shapeId = this.chart.createMultipointShape(tvPoints, shapeOptions as any);
    }

    console.log('[NXCChartShapes] Shape created with ID:', shapeId);

    if (shapeId === null) {
      console.warn(`[NXCChartShapes] Failed to create shape: ${shapeResult.type}`);
      return null;
    }

    // Generate unique ID
    const id = shapeResult.signalId || this.generateId();

    // Store reference
    this.shapes.set(id, {
      id,
      shapeId,
      signalId: shapeResult.signalId || id,
      type: shapeResult.type,
    });

    return id;
  }

  /**
   * Draw an indicator (study) on the chart
   */
  private drawIndicator(shapeResult: ShapeResult, options: ShapeDrawOptions = {}): string | null {
    if (!this.chart) {
      return null;
    }

    const indicatorType = shapeResult.overrides.indicatorType as string;
    const indicatorParams = shapeResult.overrides.indicatorParams as Record<string, unknown> || {};

    // Map our indicator types to TradingView study names
    const studyNameMap: Record<string, string> = {
      'IchimokuCloud': 'Ichimoku Cloud',
      'MASimple': 'Moving Average',
      'MAWeighted': 'Moving Average Weighted',
      'MAExponential': 'Moving Average Exponential',
      'RSI': 'Relative Strength Index',
      'MACD': 'MACD',
      'Volume': 'Volume',
    };

    const studyName = studyNameMap[indicatorType] || indicatorType;

    // Get length value from params
    let lengthValue: number | undefined;
    if (indicatorParams.Length !== undefined) {
      lengthValue = indicatorParams.Length as number;
    } else if (indicatorParams['RSI Length'] !== undefined) {
      lengthValue = indicatorParams['RSI Length'] as number;
    } else if (indicatorParams['MA Length'] !== undefined) {
      lengthValue = indicatorParams['MA Length'] as number;
    }

    // Build inputs and overrides based on indicator type
    // Based on original PHP code:
    // - Moving Average: { length: value }
    // - Moving Average Exponential: { length: value }
    // - Moving Average Weighted: { in_0: value }
    // - RSI: { length: 14, smoothingLine: 'SMA' }
    // - Volume: { length: value }
    let studyInputs: Record<string, unknown> = {};
    let studyOverrides: Record<string, unknown> = {};

    switch (indicatorType) {
      case 'MASimple':
      case 'MAExponential':
        if (lengthValue !== undefined) {
          studyInputs = { length: lengthValue };
        }
        break;

      case 'MAWeighted':
        if (lengthValue !== undefined) {
          studyInputs = { in_0: lengthValue };
        }
        break;

      case 'RSI':
        studyInputs = { length: lengthValue ?? 14, smoothingLine: 'SMA' };
        studyOverrides = {
          'smoothed ma.color': '#FF0000',
          'smoothed ma.visible': true,
        };
        break;

      case 'Volume':
        if (lengthValue !== undefined) {
          studyInputs = { length: lengthValue };
        }
        studyOverrides = {
          'smoothed ma.color': '#FF0000',
          'volume ma.color': '#FF0000',
          'smoothed MA.visible': false,
          'volume MA.visible': true,
        };
        break;

      default:
        // For Ichimoku and others, use defaults
        break;
    }

    console.log('[NXCChartShapes] Adding indicator:', {
      type: indicatorType,
      studyName,
      studyInputs,
      studyOverrides,
    });

    // Create study asynchronously
    const id = shapeResult.signalId || this.generateId();

    this.chart.createStudy(
      studyName,
      false, // forceOverlay
      options.lock ?? false,
      studyInputs,
      studyOverrides,
      {}
    ).then((studyId) => {
      if (studyId) {
        console.log('[NXCChartShapes] Indicator created with ID:', studyId);
        this.shapes.set(id, {
          id,
          shapeId: studyId,
          signalId: shapeResult.signalId || id,
          type: shapeResult.type,
        });
        // Store study ID by indicator type for later use (e.g., drawing shapes on RSI pane)
        this.studyIds.set(indicatorType, studyId);
        console.log('[NXCChartShapes] Stored studyId for', indicatorType, ':', studyId);
      } else {
        console.warn(`[NXCChartShapes] Failed to create indicator: ${studyName}`);
      }
    }).catch((err) => {
      console.error('[NXCChartShapes] Error creating indicator:', err);
    });

    return id;
  }

  /**
   * Get stored study ID by indicator type
   */
  getStudyId(indicatorType: string): TradingViewShapeId | undefined {
    return this.studyIds.get(indicatorType);
  }

  /**
   * Async version of drawIndicator that waits for study creation
   */
  private async drawIndicatorAsync(shapeResult: ShapeResult, options: ShapeDrawOptions = {}): Promise<string | null> {
    if (!this.chart) {
      return null;
    }

    const indicatorType = shapeResult.overrides.indicatorType as string;
    const indicatorParams = shapeResult.overrides.indicatorParams as Record<string, unknown> || {};

    const studyNameMap: Record<string, string> = {
      'IchimokuCloud': 'Ichimoku Cloud',
      'MASimple': 'Moving Average',
      'MAWeighted': 'Moving Average Weighted',
      'MAExponential': 'Moving Average Exponential',
      'RSI': 'Relative Strength Index',
      'MACD': 'MACD',
      'Volume': 'Volume',
    };

    const studyName = studyNameMap[indicatorType] || indicatorType;

    let lengthValue: number | undefined;
    if (indicatorParams.Length !== undefined) {
      lengthValue = indicatorParams.Length as number;
    }

    let studyInputs: Record<string, unknown> = {};
    let studyOverrides: Record<string, unknown> = {};

    switch (indicatorType) {
      case 'MASimple':
      case 'MAExponential':
        if (lengthValue !== undefined) {
          studyInputs = { length: lengthValue };
        }
        break;
      case 'MAWeighted':
        if (lengthValue !== undefined) {
          studyInputs = { in_0: lengthValue };
        }
        break;
      case 'RSI':
        studyInputs = { length: lengthValue ?? 14, smoothingLine: 'SMA' };
        studyOverrides = {
          'smoothed ma.color': '#FF0000',
          'smoothed ma.visible': true,
        };
        break;
      case 'Volume':
        if (lengthValue !== undefined) {
          studyInputs = { length: lengthValue };
        }
        studyOverrides = {
          'smoothed ma.color': '#FF0000',
          'volume ma.color': '#FF0000',
          'smoothed MA.visible': false,
          'volume MA.visible': true,
        };
        break;
      default:
        break;
    }

    console.log('[NXCChartShapes] Adding indicator (async):', {
      type: indicatorType,
      studyName,
      studyInputs,
    });

    const id = shapeResult.signalId || this.generateId();

    try {
      const studyId = await this.chart.createStudy(
        studyName,
        false,
        options.lock ?? false,
        studyInputs,
        studyOverrides,
        {}
      );

      if (studyId) {
        console.log('[NXCChartShapes] Indicator created (async) with ID:', studyId);
        this.shapes.set(id, {
          id,
          shapeId: studyId,
          signalId: shapeResult.signalId || id,
          type: shapeResult.type,
        });
        this.studyIds.set(indicatorType, studyId);
        console.log('[NXCChartShapes] Stored studyId for', indicatorType, ':', studyId);
      } else {
        console.warn(`[NXCChartShapes] Failed to create indicator: ${studyName}`);
      }

      return id;
    } catch (err) {
      console.error('[NXCChartShapes] Error creating indicator:', err);
      return null;
    }
  }

  /**
   * Draw multiple shapes (async to handle indicator dependencies)
   */
  async drawAll(shapeResults: ShapeResult[], options: ShapeDrawOptions = {}): Promise<string[]> {
    const ids: string[] = [];

    // First pass: draw all indicators and wait for them
    const indicatorResults = shapeResults.filter(s => s.type.startsWith('indicator_'));
    const otherResults = shapeResults.filter(s => !s.type.startsWith('indicator_'));

    console.log('[NXCChartShapes] drawAll - indicators:', indicatorResults.length, 'other shapes:', otherResults.length);

    // Draw indicators first and wait
    for (const shapeResult of indicatorResults) {
      console.log('[NXCChartShapes] Drawing indicator:', shapeResult.type);
      const id = await this.drawAsync(shapeResult, options);
      if (id) {
        ids.push(id);
      }
    }

    // Delay to ensure studies are fully initialized
    if (indicatorResults.length > 0) {
      console.log('[NXCChartShapes] Waiting for studies to initialize...');
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('[NXCChartShapes] Studies initialized. Stored studyIds:', Array.from(this.studyIds.entries()));
    }

    // Then draw other shapes (they can now reference study IDs)
    for (const shapeResult of otherResults) {
      console.log('[NXCChartShapes] Drawing shape:', shapeResult.type, 'ownerStudyId:', shapeResult.overrides?.ownerStudyId);
      const id = this.draw(shapeResult, options);
      if (id) {
        ids.push(id);
      }
    }

    return ids;
  }

  /**
   * Async version of draw for indicators
   */
  private async drawAsync(shapeResult: ShapeResult, options: ShapeDrawOptions = {}): Promise<string | null> {
    if (!this.chart) {
      console.warn('[NXCChartShapes] Chart not ready');
      return null;
    }

    if (shapeResult.type.startsWith('indicator_')) {
      return this.drawIndicatorAsync(shapeResult, options);
    }

    return this.draw(shapeResult, options);
  }

  /**
   * Remove a shape by ID
   */
  remove(id: string): boolean {
    const stored = this.shapes.get(id);
    if (!stored || !this.chart) {
      return false;
    }

    this.chart.removeEntity(stored.shapeId as TradingViewShapeId);
    this.shapes.delete(id);
    return true;
  }

  /**
   * Remove shapes by signal ID
   */
  removeBySignalId(signalId: string): number {
    let removed = 0;

    for (const [id, stored] of this.shapes) {
      if (stored.signalId === signalId || stored.signalId.startsWith(`${signalId}_`)) {
        if (this.remove(id)) {
          removed++;
        }
      }
    }

    return removed;
  }

  /**
   * Clear all shapes
   */
  clear(): void {
    if (this.chart) {
      // Remove each tracked shape
      for (const [id] of this.shapes) {
        this.remove(id);
      }
    }

    this.shapes.clear();
  }

  /**
   * Clear all shapes (including untracked)
   */
  clearAll(): void {
    if (this.chart) {
      this.chart.removeAllShapes();
      this.chart.removeAllStudies();
    }
    this.shapes.clear();
  }

  /**
   * Get count of drawn shapes
   */
  getShapeCount(): number {
    return this.shapes.size;
  }

  /**
   * Get all stored shape references
   */
  getShapes(): StoredShape[] {
    return Array.from(this.shapes.values());
  }

  /**
   * Detach from widget
   */
  detach(): void {
    this.clear();
    this.widget = null;
    this.chart = null;
    this.isReady = false;
  }

  /**
   * Convert ChartPoint array to TradingView point format
   */
  private convertPoints(points: ChartPoint[]): TradingViewPoint[] {
    return points
      .filter((p) => p.time > 0 && !isNaN(p.price))
      .map((p) => ({
        time: Math.floor(p.time / 1000), // TradingView expects seconds, not milliseconds
        price: p.price,
      }));
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `nxc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
