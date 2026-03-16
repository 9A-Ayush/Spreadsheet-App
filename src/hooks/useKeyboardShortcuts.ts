import { useEffect, useCallback } from "react";
import { type SpreadsheetAction } from "../store/actions";
import {
  type SpreadsheetState,
  type Selection,
  cellKey,
} from "../store/types";
import {
  parseClipboardMatrix,
  selectionToClipboardText,
  normalizeSelection,
} from "../utils/clipboard";

interface KeyboardShortcutsOptions {
  state: SpreadsheetState;
  dispatch: React.Dispatch<SpreadsheetAction>;
  computedValues: Record<string, string>;
}

export function useKeyboardShortcuts({
  state,
  dispatch,
  computedValues,
}: KeyboardShortcutsOptions): void {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const { activeCell, editingCell, selection, sheet } = state;

      // Don't intercept if we're editing a cell (input handles its own keys)
      if (editingCell) return;

      // ─── Ctrl/Cmd shortcuts ─────────────────────────────────
      const isCtrl = e.ctrlKey || e.metaKey;

      if (isCtrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: "UNDO" });
        return;
      }

      if (isCtrl && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        dispatch({ type: "REDO" });
        return;
      }

      if (isCtrl && e.key === "c") {
        if (selection) {
          e.preventDefault();
          const text = selectionToClipboardText(selection, computedValues);
          navigator.clipboard.writeText(text).catch(console.warn);
        }
        return;
      }

      if (isCtrl && e.key === "v") {
        e.preventDefault();
        const anchor = activeCell || (selection ? { row: normalizeSelection(selection).startRow, col: normalizeSelection(selection).startCol } : null);
        if (!anchor) return;

        navigator.clipboard
          .readText()
          .then((text) => {
            const matrix = parseClipboardMatrix(text);
            dispatch({
              type: "PASTE_BLOCK",
              startRow: anchor.row,
              startCol: anchor.col,
              matrix,
            });
          })
          .catch(console.warn);
        return;
      }

      if (isCtrl && e.key === "a") {
        e.preventDefault();
        dispatch({
          type: "SET_SELECTION",
          selection: {
            startRow: 0,
            startCol: 0,
            endRow: sheet.rowCount - 1,
            endCol: sheet.colCount - 1,
          },
        });
        return;
      }

      // ─── Navigation ─────────────────────────────────────────
      if (!activeCell) return;

      const { row, col } = activeCell;

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selection) {
          e.preventDefault();
          dispatch({ type: "DELETE_SELECTION" });
        }
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        dispatch({ type: "START_EDITING", row, col });
        return;
      }

      if (e.key === "F2") {
        e.preventDefault();
        dispatch({ type: "START_EDITING", row, col });
        return;
      }

      // Arrow keys for navigation
      let newRow = row;
      let newCol = col;

      switch (e.key) {
        case "ArrowUp":
          newRow = Math.max(0, row - 1);
          break;
        case "ArrowDown":
          newRow = Math.min(sheet.rowCount - 1, row + 1);
          break;
        case "ArrowLeft":
          newCol = Math.max(0, col - 1);
          break;
        case "ArrowRight":
          newCol = Math.min(sheet.colCount - 1, col + 1);
          break;
        case "Tab":
          e.preventDefault();
          if (e.shiftKey) {
            newCol = Math.max(0, col - 1);
          } else {
            newCol = Math.min(sheet.colCount - 1, col + 1);
          }
          break;
        default:
          // If the user starts typing a printable character, start editing
          if (e.key.length === 1 && !isCtrl) {
            e.preventDefault();
            dispatch({
              type: "START_EDITING",
              row,
              col,
              initialValue: e.key,
            });
          }
          return;
      }

      if (newRow !== row || newCol !== col) {
        e.preventDefault();

        if (e.shiftKey && (e.key.startsWith("Arrow"))) {
          // Extend selection
          const currentSel = selection || {
            startRow: row,
            startCol: col,
            endRow: row,
            endCol: col,
          };
          dispatch({
            type: "SET_SELECTION",
            selection: {
              startRow: currentSel.startRow,
              startCol: currentSel.startCol,
              endRow: newRow,
              endCol: newCol,
            },
          });
          dispatch({
            type: "SET_ACTIVE_CELL",
            cell: { row: newRow, col: newCol },
          });
          // Re-set selection since SET_ACTIVE_CELL overrides it
          // We need to dispatch selection after
        } else {
          dispatch({
            type: "SET_ACTIVE_CELL",
            cell: { row: newRow, col: newCol },
          });
        }
      }
    },
    [state, dispatch, computedValues]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}