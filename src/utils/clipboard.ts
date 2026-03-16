import { type SheetState, type Selection, cellKey } from "../store/types";

/**
 * Normalizes a selection so start <= end for both row and col.
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
 * Parses clipboard text (tab-separated values) into a 2D matrix of strings.
 * Handles both \r\n (Windows) and \n (Unix) line endings.
 * Safely ignores trailing empty newline.
 */
export function parseClipboardMatrix(text: string): string[][] {
  // Normalize line endings
  let normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Remove trailing newline (Excel/Sheets often append one)
  if (normalized.endsWith("\n")) {
    normalized = normalized.slice(0, -1);
  }

  if (normalized === "") return [[""]];

  const rows = normalized.split("\n");
  return rows.map((row) => row.split("\t"));
}

/**
 * Converts a selection of computed cell values to tab-separated clipboard text.
 * Uses COMPUTED values, not raw formulas.
 */
export function selectionToClipboardText(
  selection: Selection,
  computedValues: Record<string, string>
): string {
  const sel = normalizeSelection(selection);
  const lines: string[] = [];

  for (let r = sel.startRow; r <= sel.endRow; r++) {
    const cols: string[] = [];
    for (let c = sel.startCol; c <= sel.endCol; c++) {
      cols.push(computedValues[cellKey(r, c)] || "");
    }
    lines.push(cols.join("\t"));
  }

  return lines.join("\n");
}