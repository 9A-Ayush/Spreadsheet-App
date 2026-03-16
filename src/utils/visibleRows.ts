import type { SheetState, ViewState } from "../store/types";
import { filterRows } from "./filtering";
import { sortRows } from "./sorting";

/**
 * Central function: derives visible row indices from sheet + view state.
 *
 * 1. Start with all original row indices [0, 1, 2, ..., rowCount-1]
 * 2. Apply column filters (using computed values)
 * 3. Apply sort (using computed values)
 * 4. Return ordered array of visible row indices
 *
 * This function NEVER mutates the base sheet data.
 */
export function getVisibleRows(
  sheet: SheetState,
  view: ViewState,
  computedValues: Record<string, string>
): number[] {
  // Step 1: all row indices
  let rows = Array.from({ length: sheet.rowCount }, (_, i) => i);

  // Step 2: apply filters
  rows = filterRows(rows, view.filters, computedValues);

  // Step 3: apply sort
  if (view.sort && view.sort.direction) {
    rows = sortRows(rows, view.sort, computedValues);
  }

  return rows;
}