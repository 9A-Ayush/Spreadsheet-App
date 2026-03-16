import React, { useReducer, useEffect, useMemo } from "react";
import {
  spreadsheetReducer,
  createInitialState,
} from "../store/spreadsheetReducer";
import { cellKey } from "../store/types";
import { computeAllCells } from "../utils/formula";
import { getVisibleRows } from "../utils/visibleRows";
import { loadFromLocalStorage } from "../utils/persistence";
import { useDebouncedPersistence } from "../hooks/useDebouncedPersistence";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import Grid from "./Grid";
import FormulaBar from "./FormulaBar";
import Toolbar from "./Toolbar";

const Spreadsheet: React.FC = () => {
  const [state, dispatch] = useReducer(
    spreadsheetReducer,
    undefined,
    createInitialState
  );

  // ─── Restore persisted data on mount ───────────────────────
  useEffect(() => {
    const persisted = loadFromLocalStorage();
    if (persisted) {
      dispatch({
        type: "RESTORE_PERSISTED",
        cells: persisted.cells,
        rowCount: persisted.rowCount,
        colCount: persisted.colCount,
      });
    }
  }, []);

  // ─── Computation layer: evaluate all formulas ──────────────
  const computedValues = useMemo(
    () => computeAllCells(state.sheet),
    [state.sheet]
  );

  // ─── Derive visible rows for count display ────────────────
  const visibleRows = useMemo(
    () => getVisibleRows(state.sheet, state.view, computedValues),
    [state.sheet, state.view, computedValues]
  );

  // ─── Auto-save with debounce ──────────────────────────────
  useDebouncedPersistence(state.sheet);

  // ─── Keyboard shortcuts ───────────────────────────────────
  useKeyboardShortcuts({ state, dispatch, computedValues });

  // ─── Formula bar data ─────────────────────────────────────
  const activeCellKey = state.activeCell
    ? cellKey(state.activeCell.row, state.activeCell.col)
    : null;
  const activeCellRaw = activeCellKey
    ? state.sheet.cells[activeCellKey]?.raw ?? ""
    : "";
  const activeCellDisplay = activeCellKey
    ? computedValues[activeCellKey] ?? ""
    : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "8px 12px",
          background: "#1e40af",
          color: "#fff",
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        📊 Spreadsheet
      </div>

      {/* Toolbar */}
      <Toolbar
        state={state}
        dispatch={dispatch}
        visibleRowCount={visibleRows.length}
        totalRowCount={state.sheet.rowCount}
      />

      {/* Formula Bar */}
      <FormulaBar
        activeCell={state.activeCell}
        rawValue={
          state.editingCell
            ? state.editValue
            : activeCellRaw
        }
        displayValue={activeCellDisplay}
        isEditing={state.editingCell !== null}
      />

      {/* Grid */}
      <Grid
        state={state}
        dispatch={dispatch}
        computedValues={computedValues}
      />
    </div>
  );
};

export default Spreadsheet;