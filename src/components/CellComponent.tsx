import React, { useRef, useEffect, useCallback } from "react";
import { type CellStyle } from "../store/types";

interface CellComponentProps {
  row: number;
  col: number;
  rawValue: string;
  displayValue: string;
  style?: CellStyle;
  isActive: boolean;
  isSelected: boolean;
  isEditing: boolean;
  editValue: string;
  onMouseDown: (row: number, col: number, shiftKey: boolean) => void;
  onMouseEnter: (row: number, col: number) => void;
  onDoubleClick: (row: number, col: number) => void;
  onEditChange: (value: string) => void;
  onEditCommit: () => void;
  onEditCancel: () => void;
}

const CellComponent: React.FC<CellComponentProps> = ({
  row,
  col,
  rawValue,
  displayValue,
  style,
  isActive,
  isSelected,
  isEditing,
  editValue,
  onMouseDown,
  onMouseEnter,
  onDoubleClick,
  onEditChange,
  onEditCommit,
  onEditCancel,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Place cursor at end
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onEditCommit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onEditCancel();
      } else if (e.key === "Tab") {
        e.preventDefault();
        onEditCommit();
      }
    },
    [onEditCommit, onEditCancel]
  );

  const cellStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    padding: 0,
    minWidth: 80,
    maxWidth: 200,
    height: 28,
    position: "relative",
    background: isActive
      ? "#dbeafe"
      : isSelected
      ? "#eff6ff"
      : style?.background || "#fff",
    outline: isActive ? "2px solid #2563eb" : "none",
    outlineOffset: "-1px",
  };

  const textStyle: React.CSSProperties = {
    fontWeight: style?.bold ? 700 : 400,
    fontStyle: style?.italic ? "italic" : "normal",
    color: style?.color || "#111827",
  };

  return (
    <td
      style={cellStyle}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(row, col, e.shiftKey);
      }}
      onMouseEnter={(e) => {
        if (e.buttons === 1) {
          onMouseEnter(row, col);
        }
      }}
      onDoubleClick={() => onDoubleClick(row, col)}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => onEditChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={onEditCommit}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            padding: "2px 4px",
            fontSize: 13,
            fontFamily: "inherit",
            boxSizing: "border-box",
            background: "transparent",
            ...textStyle,
          }}
        />
      ) : (
        <div
          style={{
            padding: "2px 4px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: 13,
            lineHeight: "24px",
            ...textStyle,
          }}
          title={displayValue}
        >
          {displayValue}
        </div>
      )}
    </td>
  );
};

export default React.memo(CellComponent);
