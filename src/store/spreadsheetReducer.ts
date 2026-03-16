import type { SpreadsheetAction } from "./actions";
import {
  type SpreadsheetState,
  type Cell,
  type HistoryEntry,
  cellKey,
  type Selection,
} from "./types";

// ─── Constants ───────────────────────────────────────────────────

const DEFAULT_ROWS = 1000;
const DEFAULT_COLS = 100;
const MAX_HISTORY = 100;

// ─── Initial State ───────────────────────────────────────────────

export function createInitialState(): SpreadsheetState {
  return {
    sheet: {
      cells: {},
      rowCount: DEFAULT_ROWS,
      colCount: DEFAULT_COLS,
    },
    view: {
      sort: null,
      filters: {},
    },
    selection: null,
    activeCell: null,
    editingCell: null,
    editValue: "",
    undoStack: [],
    redoStack: [],
  };
}

// ─── History Helpers ─────────────────────────────────────────────

function pushHistory(
  state: SpreadsheetState,
  newCells: Record<string, Cell>,
  newRowCount?: number,
  newColCount?: number
): { undoStack: HistoryEntry[]; redoStack: HistoryEntry[] } {
  const entry: HistoryEntry = {
    cellsBefore: { ...state.sheet.cells },
    cellsAfter: { ...newCells },
    rowCountBefore: state.sheet.rowCount,
    colCountBefore: state.sheet.colCount,
    rowCountAfter: newRowCount ?? state.sheet.rowCount,
    colCountAfter: newColCount ?? state.sheet.colCount,
  };
  const undoStack = [...state.undoStack, entry].slice(-MAX_HISTORY);
  return { undoStack, redoStack: [] }; // clear redo on new action
}

function normalizeSelection(sel: Selection): Selection {
  return {
    startRow: Math.min(sel.startRow, sel.endRow),
    startCol: Math.min(sel.startCol, sel.endCol),
    endRow: Math.max(sel.startRow, sel.endRow),
    endCol: Math.max(sel.startCol, sel.endCol),
  };
}

// ─── Reducer ─────────────────────────────────────────────────────

export function spreadsheetReducer(
  state: SpreadsheetState,
  action: SpreadsheetAction
): SpreadsheetState {
  switch (action.type) {
    case "SET_CELL": {
      const key = cellKey(action.row, action.col);
      const existing = state.sheet.cells[key];
      const newCells = { ...state.sheet.cells };

      if (action.raw === "" && !existing?.style) {
        delete newCells[key];
      } else {
        newCells[key] = { ...existing, raw: action.raw };
      }

      const history = pushHistory(state, newCells);
      return {
        ...state,
        sheet: { ...state.sheet, cells: newCells },
        ...history,
      };
    }

    case "PASTE_BLOCK": {
      const { startRow, startCol, matrix } = action;
      const newCells = { ...state.sheet.cells };

      // Decision: expand grid if paste exceeds bounds
      let newRowCount = state.sheet.rowCount;
      let newColCount = state.sheet.colCount;

      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          const targetRow = startRow + r;
          const targetCol = startCol + c;
          const key = cellKey(targetRow, targetCol);
          const value = matrix[r][c];

          if (value === "" && !newCells[key]?.style) {
            delete newCells[key];
          } else {
            newCells[key] = { ...(newCells[key] || {}), raw: value };
          }

          if (targetRow >= newRowCount) newRowCount = targetRow + 1;
          if (targetCol >= newColCount) newColCount = targetCol + 1;
        }
      }

      const history = pushHistory(state, newCells, newRowCount, newColCount);
      return {
        ...state,
        sheet: {
          ...state.sheet,
          cells: newCells,
          rowCount: newRowCount,
          colCount: newColCount,
        },
        ...history,
      };
    }

    case "DELETE_SELECTION": {
      if (!state.selection) return state;
      const sel = normalizeSelection(state.selection);
      const newCells = { ...state.sheet.cells };

      for (let r = sel.startRow; r <= sel.endRow; r++) {
        for (let c = sel.startCol; c <= sel.endCol; c++) {
          const key = cellKey(r, c);
          if (newCells[key]) {
            if (newCells[key].style) {
              newCells[key] = { ...newCells[key], raw: "" };
            } else {
              delete newCells[key];
            }
          }
        }
      }

      const history = pushHistory(state, newCells);
      return {
        ...state,
        sheet: { ...state.sheet, cells: newCells },
        ...history,
      };
    }

    case "TOGGLE_SORT": {
      const currentSort = state.view.sort;
      let newDirection: "asc" | "desc" | null;

      if (currentSort && currentSort.col === action.col) {
        // Cycle: asc -> desc -> null
        if (currentSort.direction === "asc") newDirection = "desc";
        else if (currentSort.direction === "desc") newDirection = null;
        else newDirection = "asc";
      } else {
        newDirection = "asc";
      }

      return {
        ...state,
        view: {
          ...state.view,
          sort:
            newDirection === null
              ? null
              : { col: action.col, direction: newDirection },
        },
      };
    }

    case "SET_FILTER": {
      const newFilters = { ...state.view.filters };
      if (action.allowedValues.size === 0) {
        // Empty filter = show nothing matching that column, but we treat
        // it as "clear" for usability
        delete newFilters[action.col];
      } else {
        newFilters[action.col] = action.allowedValues;
      }
      return {
        ...state,
        view: { ...state.view, filters: newFilters },
      };
    }

    case "CLEAR_FILTER": {
      const newFilters = { ...state.view.filters };
      delete newFilters[action.col];
      return {
        ...state,
        view: { ...state.view, filters: newFilters },
      };
    }

    case "CLEAR_ALL_FILTERS": {
      return {
        ...state,
        view: { ...state.view, filters: {} },
      };
    }

    case "SET_SELECTION": {
      return { ...state, selection: action.selection };
    }

    case "SET_ACTIVE_CELL": {
      return {
        ...state,
        activeCell: action.cell,
        selection: action.cell
          ? {
              startRow: action.cell.row,
              startCol: action.cell.col,
              endRow: action.cell.row,
              endCol: action.cell.col,
            }
          : null,
      };
    }

    case "START_EDITING": {
      const key = cellKey(action.row, action.col);
      const cell = state.sheet.cells[key];
      const initialValue =
        action.initialValue !== undefined
          ? action.initialValue
          : cell?.raw ?? "";
      return {
        ...state,
        editingCell: { row: action.row, col: action.col },
        editValue: initialValue,
        activeCell: { row: action.row, col: action.col },
      };
    }

    case "UPDATE_EDIT_VALUE": {
      return { ...state, editValue: action.value };
    }

    case "COMMIT_EDIT": {
      if (!state.editingCell) return state;
      const { row, col } = state.editingCell;
      const key = cellKey(row, col);
      const existing = state.sheet.cells[key];
      const newCells = { ...state.sheet.cells };

      if (state.editValue === "" && !existing?.style) {
        delete newCells[key];
      } else {
        newCells[key] = { ...(existing || {}), raw: state.editValue };
      }

      const history = pushHistory(state, newCells);
      return {
        ...state,
        sheet: { ...state.sheet, cells: newCells },
        editingCell: null,
        editValue: "",
        ...history,
      };
    }

    case "CANCEL_EDIT": {
      return { ...state, editingCell: null, editValue: "" };
    }

    case "UNDO": {
      if (state.undoStack.length === 0) return state;
      const entry = state.undoStack[state.undoStack.length - 1];
      const newUndoStack = state.undoStack.slice(0, -1);
      const newRedoStack = [...state.redoStack, entry];
      return {
        ...state,
        sheet: {
          ...state.sheet,
          cells: { ...entry.cellsBefore },
          rowCount: entry.rowCountBefore,
          colCount: entry.colCountBefore,
        },
        undoStack: newUndoStack,
        redoStack: newRedoStack,
      };
    }

    case "REDO": {
      if (state.redoStack.length === 0) return state;
      const entry = state.redoStack[state.redoStack.length - 1];
      const newRedoStack = state.redoStack.slice(0, -1);
      const newUndoStack = [...state.undoStack, entry];
      return {
        ...state,
        sheet: {
          ...state.sheet,
          cells: { ...entry.cellsAfter },
          rowCount: entry.rowCountAfter,
          colCount: entry.colCountAfter,
        },
        undoStack: newUndoStack,
        redoStack: newRedoStack,
      };
    }

    case "RESTORE_PERSISTED": {
      return {
        ...state,
        sheet: {
          cells: action.cells,
          rowCount: action.rowCount,
          colCount: action.colCount,
        },
      };
    }

    case "SET_CELL_STYLE": {
      const key = cellKey(action.row, action.col);
      const existing = state.sheet.cells[key] || { raw: "" };
      const newCells = {
        ...state.sheet.cells,
        [key]: { ...existing, style: { ...existing.style, ...action.style } },
      };
      const history = pushHistory(state, newCells);
      return {
        ...state,
        sheet: { ...state.sheet, cells: newCells },
        ...history,
      };
    }

    case "ADD_ROW": {
      return {
        ...state,
        sheet: { ...state.sheet, rowCount: state.sheet.rowCount + 1 },
      };
    }

    case "ADD_COLUMN": {
      return {
        ...state,
        sheet: { ...state.sheet, colCount: state.sheet.colCount + 1 },
      };
    }

    default:
      return state;
  }
}