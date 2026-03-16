import { type ViewState } from "../store/types";
import { cellKey } from "../store/types";

/**
 * Returns row indices that pass all active column filters.
 * Filters operate on computed/display values.
 */
export function filterRows(
  rowIndices: number[],
  filters: Record<number, Set<string>>,
  computedValues: Record<string, string>
): number[] {
  const filterEntries = Object.entries(filters);
  if (filterEntries.length === 0) return rowIndices;

  return rowIndices.filter((row) => {
    return filterEntries.every(([colStr, allowedValues]) => {
      const col = parseInt(colStr, 10);
      const value = computedValues[cellKey(row, col)] || "";
      return allowedValues.has(value);
    });
  });
}

/**
 * Gets unique computed values in a column for filter dropdown options.
 * Only considers rows that pass OTHER column filters (not this column's filter).
 */
export function getFilterOptions(
  col: number,
  allRowIndices: number[],
  filters: Record<number, Set<string>>,
  computedValues: Record<string, string>
): string[] {
  // Apply all filters EXCEPT the current column
  const otherFilters = { ...filters };
  delete otherFilters[col];

  const filteredRows = filterRows(allRowIndices, otherFilters, computedValues);

  const uniqueValues = new Set<string>();
  for (const row of filteredRows) {
    const value = computedValues[cellKey(row, col)] || "";
    uniqueValues.add(value);
  }

  return Array.from(uniqueValues).sort((a, b) => {
    const aNum = Number(a);
    const bNum = Number(b);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    return a.localeCompare(b);
  });
}