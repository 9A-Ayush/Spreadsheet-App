import React from "react";
import { type SortDirection } from "../store/types";
import FilterDropdown from "./FilterDropdown";
import { colToLetter } from "../utils/cellRefs";

interface HeaderCellProps {
  colIndex: number;
  sortDirection: SortDirection;
  onToggleSort: () => void;
  filterOptions: string[];
  activeFilter: Set<string> | undefined;
  onApplyFilter: (allowedValues: Set<string>) => void;
  onClearFilter: () => void;
}

const HeaderCell: React.FC<HeaderCellProps> = ({
  colIndex,
  sortDirection,
  onToggleSort,
  filterOptions,
  activeFilter,
  onApplyFilter,
  onClearFilter,
}) => {
  const sortIndicator =
    sortDirection === "asc" ? " ↑" : sortDirection === "desc" ? " ↓" : "";

  return (
    <th
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#f3f4f6",
        border: "1px solid #d1d5db",
        padding: "4px 6px",
        fontWeight: 600,
        fontSize: 12,
        textAlign: "center",
        minWidth: 80,
        maxWidth: 150,
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <span
          onClick={onToggleSort}
          style={{ cursor: "pointer", flex: 1 }}
          title={`Sort column ${colToLetter(colIndex)}`}
        >
          {colToLetter(colIndex)}
          {sortIndicator && (
            <span style={{ color: "#2563eb", fontSize: 11 }}>
              {sortIndicator}
            </span>
          )}
        </span>
        <FilterDropdown
          columnIndex={colIndex}
          options={filterOptions}
          activeFilter={activeFilter}
          onApply={onApplyFilter}
          onClear={onClearFilter}
        />
      </div>
    </th>
  );
};

export default React.memo(HeaderCell);