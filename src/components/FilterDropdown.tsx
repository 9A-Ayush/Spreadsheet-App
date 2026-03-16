import React, { useState, useRef, useEffect, useMemo } from "react";

interface FilterDropdownProps {
  columnIndex: number;
  options: string[];
  activeFilter: Set<string> | undefined;
  onApply: (allowedValues: Set<string>) => void;
  onClear: () => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  columnIndex,
  options,
  activeFilter,
  onApply,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(
    activeFilter ? new Set(activeFilter) : new Set(options)
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset selection when options change or dropdown opens
  useEffect(() => {
    if (isOpen) {
      setSelected(activeFilter ? new Set(activeFilter) : new Set(options));
    }
  }, [isOpen, activeFilter, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const allSelected = options.every((o) => selected.has(o));
  const isFiltered = activeFilter !== undefined;

  const handleToggle = (value: string) => {
    const next = new Set(selected);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    setSelected(next);
  };

  const handleSelectAll = () => {
    setSelected(new Set(options));
  };

  const handleClearAll = () => {
    setSelected(new Set());
  };

  const handleApply = () => {
    if (selected.size === options.length) {
      // All selected = no filter
      onClear();
    } else {
      onApply(selected);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    onClear();
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title="Filter"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "10px",
          color: isFiltered ? "#2563eb" : "#6b7280",
          padding: "0 2px",
          fontWeight: isFiltered ? "bold" : "normal",
        }}
      >
        ▼
      </button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 1000,
            background: "#fff",
            border: "1px solid #d1d5db",
            borderRadius: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            minWidth: 160,
            maxHeight: 280,
            display: "flex",
            flexDirection: "column",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              padding: "6px 8px",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              gap: 8,
            }}
          >
            <button
              onClick={handleSelectAll}
              style={{
                fontSize: 11,
                cursor: "pointer",
                background: "none",
                border: "none",
                color: "#2563eb",
                padding: 0,
              }}
            >
              Select All
            </button>
            <button
              onClick={handleClearAll}
              style={{
                fontSize: 11,
                cursor: "pointer",
                background: "none",
                border: "none",
                color: "#2563eb",
                padding: 0,
              }}
            >
              Clear
            </button>
          </div>
          <div style={{ overflowY: "auto", flex: 1, padding: "4px 0" }}>
            {options.map((option) => (
              <label
                key={option}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "3px 8px",
                  cursor: "pointer",
                  fontSize: 12,
                  gap: 6,
                }}
              >
                <input
                  type="checkbox"
                  checked={selected.has(option)}
                  onChange={() => handleToggle(option)}
                  style={{ margin: 0 }}
                />
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {option || "(empty)"}
                </span>
              </label>
            ))}
            {options.length === 0 && (
              <div
                style={{
                  padding: "8px",
                  color: "#9ca3af",
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                No values
              </div>
            )}
          </div>
          <div
            style={{
              padding: "6px 8px",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={handleClear}
              style={{
                fontSize: 11,
                cursor: "pointer",
                background: "none",
                border: "1px solid #d1d5db",
                borderRadius: 3,
                padding: "3px 8px",
                color: "#374151",
              }}
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              disabled={selected.size === 0}
              style={{
                fontSize: 11,
                cursor: "pointer",
                background: selected.size === 0 ? "#9ca3af" : "#2563eb",
                border: "none",
                borderRadius: 3,
                padding: "3px 10px",
                color: "#fff",
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
