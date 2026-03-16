import { type Selection } from "../store/types";

/**
 * Normalizes a selection so start <= end.
 */
export function normalizeSelection(sel: Selection): Selection {
  return {
    startRow: Math.min(sel.startRow, sel.endRow),
    startCol: Math.min(sel.startCol, sel.endCol),
    endRow: Math.max(sel.startRow, sel.endRow),
    endCol: Math.max(sel.startCol, sel.endCol),
  };
}

/**
 * Checks if a cell is within a selection.
 */
export function isCellInSelection(
  row: number,
  col: number,
  sel: Selection | null
): boolean {
  if (!sel) return false;
  const norm = normalizeSelection(sel);
  return (
    row >= norm.startRow &&
    row <= norm.endRow &&
    col >= norm.startCol &&
    col <= norm.endCol
  );
}

/**
 * Checks if a cell is the active cell.
 */
export function isCellActive(
  row: number,
  col: number,
  activeRow: number | null,
  activeCol: number | null
): boolean {
  return row === activeRow && col === activeCol;
}