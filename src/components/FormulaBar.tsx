import React from "react";
import { type ActiveCell, cellKey, type SpreadsheetState } from "../store/types";
import { formatCellRef } from "../utils/cellRefs";

interface FormulaBarProps {
  activeCell: ActiveCell | null;
  rawValue: string;
  displayValue: string;
  isEditing: boolean;
}

const FormulaBar: React.FC<FormulaBarProps> = ({
  activeCell,
  rawValue,
  displayValue,
  isEditing,
}) => {
  const cellLabel = activeCell
    ? formatCellRef(activeCell.row, activeCell.col)
    : "";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 8px",
        borderBottom: "1px solid #e5e7eb",
        background: "#fafafa",
        fontSize: 13,
        fontFamily: "monospace",
      }}
    >
      <span
        style={{
          minWidth: 48,
          fontWeight: 600,
          color: "#374151",
          textAlign: "center",
        }}
      >
        {cellLabel}
      </span>
      <div
        style={{
          borderLeft: "1px solid #d1d5db",
          height: 20,
        }}
      />
      <span
        style={{
          flex: 1,
          color: "#6b7280",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {rawValue || ""}
        {rawValue && rawValue.startsWith("=") && !isEditing && (
          <span style={{ color: "#9ca3af", marginLeft: 8 }}>
            → {displayValue}
          </span>
        )}
      </span>
    </div>
  );
};

export default React.memo(FormulaBar);
