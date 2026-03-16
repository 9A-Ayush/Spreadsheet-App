import type { ActiveCell, Cell, Selection, SortDirection } from "./types";

// ─── Action Types ────────────────────────────────────────────────

export type SpreadsheetAction =
  | { type: "SET_CELL"; row: number; col: number; raw: string }
  | { type: "PASTE_BLOCK"; startRow: number; startCol: number; matrix: string[][] }
  | { type: "TOGGLE_SORT"; col: number }
  | { type: "SET_FILTER"; col: number; allowedValues: Set<string> }
  | { type: "CLEAR_FILTER"; col: number }
  | { type: "CLEAR_ALL_FILTERS" }
  | { type: "SET_SELECTION"; selection: Selection | null }
  | { type: "SET_ACTIVE_CELL"; cell: ActiveCell | null }
  | { type: "START_EDITING"; row: number; col: number; initialValue?: string }
  | { type: "UPDATE_EDIT_VALUE"; value: string }
  | { type: "COMMIT_EDIT" }
  | { type: "CANCEL_EDIT" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESTORE_PERSISTED"; cells: Record<string, Cell>; rowCount: number; colCount: number }
  | { type: "DELETE_SELECTION" }
  | { type: "SET_CELL_STYLE"; row: number; col: number; style: Cell["style"] }
  | { type: "ADD_ROW" }
  | { type: "ADD_COLUMN" };