// ─── Core Data Types ─────────────────────────────────────────────

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  color?: string;
  background?: string;
}

export interface Cell {
  raw: string;
  style?: CellStyle;
}

export interface SheetState {
  cells: Record<string, Cell>; // keyed by "row:col"
  rowCount: number;
  colCount: number;
}

// ─── View Layer Types ────────────────────────────────────────────

export type SortDirection = "asc" | "desc" | null;

export interface SortConfig {
  col: number;
  direction: SortDirection;
}

export interface ViewState {
  sort: SortConfig | null;
  filters: Record<number, Set<string>>; // col -> set of allowed display values
}

// ─── Selection & Navigation ──────────────────────────────────────

export interface Selection {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export interface ActiveCell {
  row: number;
  col: number;
}

// ─── History (Undo/Redo) ─────────────────────────────────────────

export interface HistoryEntry {
  /** Snapshot of cells before the action */
  cellsBefore: Record<string, Cell>;
  /** Snapshot of cells after the action */
  cellsAfter: Record<string, Cell>;
  /** Previous grid dimensions */
  rowCountBefore: number;
  colCountBefore: number;
  /** New grid dimensions */
  rowCountAfter: number;
  colCountAfter: number;
}

// ─── App State ───────────────────────────────────────────────────

export interface SpreadsheetState {
  sheet: SheetState;
  view: ViewState;
  selection: Selection | null;
  activeCell: ActiveCell | null;
  editingCell: ActiveCell | null; // cell currently in edit mode
  editValue: string; // current edit buffer
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];
}

// ─── Cell key helpers ────────────────────────────────────────────

export function cellKey(row: number, col: number): string {
  return `${row}:${col}`;
}

export function parseCellKey(key: string): [number, number] {
  const parts = key.split(":");
  return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
}