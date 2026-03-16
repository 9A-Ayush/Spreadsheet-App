import { type Cell, type SheetState } from "../store/types";

const STORAGE_KEY = "spreadsheet_data";

interface PersistedData {
  cells: Record<string, Cell>;
  rowCount: number;
  colCount: number;
  version: number; // for future migration
}

const CURRENT_VERSION = 1;

/**
 * Saves sheet state to localStorage. Handles quota errors gracefully.
 */
export function saveToLocalStorage(sheet: SheetState): boolean {
  try {
    const data: PersistedData = {
      cells: sheet.cells,
      rowCount: sheet.rowCount,
      colCount: sheet.colCount,
      version: CURRENT_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    // Handle quota exceeded or other write failures
    console.warn("Failed to save to localStorage:", e);
    return false;
  }
}

/**
 * Loads sheet state from localStorage. Returns null if no data or corrupted.
 */
export function loadFromLocalStorage(): {
  cells: Record<string, Cell>;
  rowCount: number;
  colCount: number;
} | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw) as PersistedData;

    // Validate structure
    if (
      typeof data !== "object" ||
      data === null ||
      typeof data.cells !== "object" ||
      typeof data.rowCount !== "number" ||
      typeof data.colCount !== "number" ||
      data.rowCount < 1 ||
      data.colCount < 1
    ) {
      console.warn("Invalid persisted data structure, ignoring.");
      return null;
    }

    // Validate cells: each cell must have a 'raw' string
    const validatedCells: Record<string, Cell> = {};
    for (const [key, cell] of Object.entries(data.cells)) {
      // Validate key format "row:col"
      if (!/^\d+:\d+$/.test(key)) continue;

      if (typeof (cell as any)?.raw !== "string") continue;

      const validCell: Cell = { raw: (cell as Cell).raw };
      if ((cell as Cell).style && typeof (cell as Cell).style === "object") {
        validCell.style = { ...(cell as Cell).style };
      }
      validatedCells[key] = validCell;
    }

    return {
      cells: validatedCells,
      rowCount: Math.max(data.rowCount, 1),
      colCount: Math.max(data.colCount, 1),
    };
  } catch (e) {
    console.warn("Failed to load from localStorage:", e);
    return null;
  }
}

/**
 * Clears persisted data.
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}