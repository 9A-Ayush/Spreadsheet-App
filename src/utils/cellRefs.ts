/**
 * Converts a column index (0-based) to a letter label (A, B, ..., Z, AA, AB, ...)
 */
export function colToLetter(col: number): string {
  let result = "";
  let n = col;
  while (n >= 0) {
    result = String.fromCharCode(65 + (n % 26)) + result;
    n = Math.floor(n / 26) - 1;
  }
  return result;
}

/**
 * Converts a letter label (A, B, ..., AA) to a 0-based column index.
 * Returns -1 if invalid.
 */
export function letterToCol(letters: string): number {
  const upper = letters.toUpperCase();
  let result = 0;
  for (let i = 0; i < upper.length; i++) {
    result = result * 26 + (upper.charCodeAt(i) - 64);
  }
  return result - 1;
}

/**
 * Parses a cell reference like "A1" into { row, col } (0-based).
 * Returns null if invalid.
 */
export function parseCellRef(ref: string): { row: number; col: number } | null {
  const match = ref.match(/^([A-Za-z]+)(\d+)$/);
  if (!match) return null;
  const col = letterToCol(match[1]);
  const row = parseInt(match[2], 10) - 1; // 1-based in formulas, 0-based internally
  if (row < 0 || col < 0) return null;
  return { row, col };
}

/**
 * Formats a 0-based row/col as a cell reference like "A1".
 */
export function formatCellRef(row: number, col: number): string {
  return `${colToLetter(col)}${row + 1}`;
}