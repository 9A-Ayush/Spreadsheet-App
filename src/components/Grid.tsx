import React, { useCallback, useMemo } from "react";
import { type SpreadsheetState, cellKey } from "../store/types";
import { type SpreadsheetAction } from "../store/actions";
import { isCellInSelection, isCellActive } from "../utils/selection";
import { getVisibleRows } from "../utils/visibleRows";
import { getFilterOptions } from "../utils/filtering";
import CellComponent from "./CellComponent";
import HeaderCell from "./HeaderCell";

interface GridProps {
  state: SpreadsheetState;
  dispatch: React.Dispatch<SpreadsheetAction>;
  computedValues: Record<string, string>;
}

const Grid: React.FC<GridProps> = ({ state, dispatch, computedValues }) => {
  const { sheet, view, selection, activeCell, editingCell, editValue } = state;

  // Derive visible rows — the central view-layer derivation
  const visibleRows = useMemo(
    () => getVisibleRows(sheet, view, computedValues),
    [sheet, view, computedValues]
  );

  // Track if mouse is being dragged for selection
  const isMouseDownRef = React.useRef(false);

  const handleCellMouseDown = useCallback(
    (row: number, col: number, shiftKey: boolean) => {
      // Commit any ongoing edit first
      if (editingCell) {
        dispatch({ type: "COMMIT_EDIT" });
      }

      isMouseDownRef.current = true;

      if (shiftKey && activeCell) {
        // Extend selection from active cell
        dispatch({
          type: "SET_SELECTION",
          selection: {
            startRow: activeCell.row,
            startCol: activeCell.col,
            endRow: row,
            endCol: col,
          },
        });
      } else {
        dispatch({ type: "SET_ACTIVE_CELL", cell: { row, col } });
      }

      const handleMouseUp = () => {
        isMouseDownRef.current = false;
        document.removeEventListener("mouseup", handleMouseUp);
      };
      document.addEventListener("mouseup", handleMouseUp);
    },
    [dispatch, activeCell, editingCell]
  );

  const handleCellMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!isMouseDownRef.current || !activeCell) return;
      dispatch({
        type: "SET_SELECTION",
        selection: {
          startRow: activeCell.row,
          startCol: activeCell.col,
          endRow: row,
          endCol: col,
        },
      });
    },
    [dispatch, activeCell]
  );

  const handleCellDoubleClick = useCallback(
    (row: number, col: number) => {
      dispatch({ type: "START_EDITING", row, col });
    },
    [dispatch]
  );

  const handleEditChange = useCallback(
    (value: string) => {
      dispatch({ type: "UPDATE_EDIT_VALUE", value });
    },
    [dispatch]
  );

  const handleEditCommit = useCallback(() => {
    dispatch({ type: "COMMIT_EDIT" });
  }, [dispatch]);

  const handleEditCancel = useCallback(() => {
    dispatch({ type: "CANCEL_EDIT" });
  }, [dispatch]);

  const handleToggleSort = useCallback(
    (col: number) => {
      dispatch({ type: "TOGGLE_SORT", col });
    },
    [dispatch]
  );

  const handleApplyFilter = useCallback(
    (col: number, allowedValues: Set<string>) => {
      dispatch({ type: "SET_FILTER", col, allowedValues });
    },
    [dispatch]
  );

  const handleClearFilter = useCallback(
    (col: number) => {
      dispatch({ type: "CLEAR_FILTER", col });
    },
    [dispatch]
  );

  // Precompute all row indices for filter options
  const allRowIndices = useMemo(
    () => Array.from({ length: sheet.rowCount }, (_, i) => i),
    [sheet.rowCount]
  );

  return (
    <div
      style={{
        overflow: "auto",
        flex: 1,
        border: "1px solid #d1d5db",
        borderRadius: 4,
      }}
    >
      <table
        style={{
          borderCollapse: "collapse",
          tableLayout: "fixed",
          fontSize: 13,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <thead>
          <tr>
            {/* Row number header */}
            <th
              style={{
                position: "sticky",
                top: 0,
                left: 0,
                zIndex: 20,
                background: "#e5e7eb",
                border: "1px solid #d1d5db",
                width: 48,
                minWidth: 48,
                fontSize: 10,
                color: "#6b7280",
              }}
            >
              #
            </th>
            {Array.from({ length: sheet.colCount }, (_, colIdx) => {
              const sortDir =
                view.sort && view.sort.col === colIdx
                  ? view.sort.direction
                  : null;

              const filterOpts = getFilterOptions(
                colIdx,
                allRowIndices,
                view.filters,
                computedValues
              );

              return (
                <HeaderCell
                  key={colIdx}
                  colIndex={colIdx}
                  sortDirection={sortDir}
                  onToggleSort={() => handleToggleSort(colIdx)}
                  filterOptions={filterOpts}
                  activeFilter={view.filters[colIdx]}
                  onApplyFilter={(vals) => handleApplyFilter(colIdx, vals)}
                  onClearFilter={() => handleClearFilter(colIdx)}
                />
              );
            })}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((rowIdx) => (
            <tr key={rowIdx}>
              {/* Row number label */}
              <td
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 5,
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  textAlign: "center",
                  fontSize: 11,
                  color: "#6b7280",
                  fontWeight: 500,
                  width: 48,
                  minWidth: 48,
                  padding: "2px 4px",
                  userSelect: "none",
                }}
              >
                {rowIdx + 1}
              </td>
              {Array.from({ length: sheet.colCount }, (_, colIdx) => {
                const key = cellKey(rowIdx, colIdx);
                const cell = sheet.cells[key];
                const rawValue = cell?.raw ?? "";
                const displayValue = computedValues[key] || "";

                const isActiveHere = isCellActive(
                  rowIdx,
                  colIdx,
                  activeCell?.row ?? null,
                  activeCell?.col ?? null
                );
                const isSelectedHere = isCellInSelection(
                  rowIdx,
                  colIdx,
                  selection
                );
                const isEditingHere =
                  editingCell?.row === rowIdx && editingCell?.col === colIdx;

                return (
                  <CellComponent
                    key={key}
                    row={rowIdx}
                    col={colIdx}
                    rawValue={rawValue}
                    displayValue={displayValue}
                    style={cell?.style}
                    isActive={isActiveHere}
                    isSelected={isSelectedHere}
                    isEditing={isEditingHere}
                    editValue={isEditingHere ? editValue : ""}
                    onMouseDown={handleCellMouseDown}
                    onMouseEnter={handleCellMouseEnter}
                    onDoubleClick={handleCellDoubleClick}
                    onEditChange={handleEditChange}
                    onEditCommit={handleEditCommit}
                    onEditCancel={handleEditCancel}
                  />
                );
              })}
            </tr>
          ))}
          {visibleRows.length === 0 && (
            <tr>
              <td
                colSpan={sheet.colCount + 1}
                style={{
                  textAlign: "center",
                  padding: 24,
                  color: "#9ca3af",
                  fontSize: 13,
                }}
              >
                No rows match the current filters
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Grid;
