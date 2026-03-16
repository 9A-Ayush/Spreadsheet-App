// History utility types and helpers are defined in store/types.ts
// This file provides additional helpers if needed.

import { HistoryEntry, Cell, SheetState, cellKey } from "../store/types";

/**
 * Creates a history entry for a batch operation (like paste).
 */
export function createBatchHistoryEntry(
  beforeCells: Record<string, Cell>,
  afterCells: Record<string, Cell>,
  beforeRowCount: number,
  beforeColCount: number,
  afterRowCount: number,
  afterColCount: number
): HistoryEntry {
  return {
    cellsBefore: { ...beforeCells },
    cellsAfter: { ...afterCells },
    rowCountBefore: beforeRowCount,
    colCountBefore: beforeColCount,
    rowCountAfter: afterRowCount,
    colCountAfter: afterColCount,
  };
}