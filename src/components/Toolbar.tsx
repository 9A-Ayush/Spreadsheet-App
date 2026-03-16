import React from "react";
import { type SpreadsheetAction } from "../store/actions";
import { type SpreadsheetState } from "../store/types";

interface ToolbarProps {
  state: SpreadsheetState;
  dispatch: React.Dispatch<SpreadsheetAction>;
  visibleRowCount: number;
  totalRowCount: number;
}

const Toolbar: React.FC<ToolbarProps> = ({
  state,
  dispatch,
  visibleRowCount,
  totalRowCount,
}) => {
  const hasFilters = Object.keys(state.view.filters).length > 0;
  const hasSort = state.view.sort !== null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 8px",
        borderBottom: "1px solid #e5e7eb",
        background: "#f9fafb",
        fontSize: 12,
      }}
    >
      <button
        onClick={() => dispatch({ type: "UNDO" })}
        disabled={state.undoStack.length === 0}
        style={buttonStyle}
        title="Undo (Ctrl+Z)"
      >
        ↶ Undo
      </button>
      <button
        onClick={() => dispatch({ type: "REDO" })}
        disabled={state.redoStack.length === 0}
        style={buttonStyle}
        title="Redo (Ctrl+Y)"
      >
        ↷ Redo
      </button>
      <div style={{ borderLeft: "1px solid #d1d5db", height: 20 }} />
      <button
        onClick={() => dispatch({ type: "ADD_ROW" })}
        style={buttonStyle}
      >
        + Row
      </button>
      <button
        onClick={() => dispatch({ type: "ADD_COLUMN" })}
        style={buttonStyle}
      >
        + Column
      </button>
      {hasFilters && (
        <>
          <div style={{ borderLeft: "1px solid #d1d5db", height: 20 }} />
          <button
            onClick={() => dispatch({ type: "CLEAR_ALL_FILTERS" })}
            style={{ ...buttonStyle, color: "#2563eb" }}
          >
            Clear All Filters
          </button>
        </>
      )}
      <div style={{ flex: 1 }} />
      <span style={{ color: "#6b7280" }}>
        {visibleRowCount === totalRowCount
          ? `${totalRowCount} rows`
          : `${visibleRowCount} of ${totalRowCount} rows visible`}
        {hasSort && " • sorted"}
        {hasFilters && " • filtered"}
      </span>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: 4,
  padding: "4px 10px",
  fontSize: 12,
  cursor: "pointer",
  color: "#374151",
};

export default React.memo(Toolbar);
