import { type SortConfig } from "../store/types";
import { cellKey } from "../store/types";

/**
 * Compares two cell values for sorting.
 * Numbers sort numerically; strings sort lexicographically.
 * Empty cells sort to the end.
 */
function compareValues(a: string, b: string, direction: "asc" | "desc"): number {
  const aEmpty = a === "";
  const bEmpty = b === "";

  // Empty cells always go to the bottom
  if (aEmpty && bEmpty) return 0;
  if (aEmpty) return 1;
  if (bEmpty) return -1;

  const aNum = Number(a);
  const bNum = Number(b);
  const aIsNum = !isNaN(aNum) && a.trim() !== "";
  const bIsNum = !isNaN(bNum) && b.trim() !== "";

  let result: number;

  if (aIsNum && bIsNum) {
    result = aNum - bNum;
  } else if (aIsNum) {
    // Numbers before strings
    result = -1;
  } else if (bIsNum) {
    result = 1;
  } else {
    result = a.localeCompare(b, undefined, { sensitivity: "base" });
  }

  return direction === "desc" ? -result : result;
}

/**
 * Sorts row indices based on computed values in a column.
 * Returns a new array of sorted row indices.
 */
export function sortRows(
  rowIndices: number[],
  sort: SortConfig,
  computedValues: Record<string, string>
): number[] {
  if (!sort.direction) return rowIndices;

  return [...rowIndices].sort((rowA, rowB) => {
    const valA = computedValues[cellKey(rowA, sort.col)] || "";
    const valB = computedValues[cellKey(rowB, sort.col)] || "";
    return compareValues(valA, valB, sort.direction!);
  });
}