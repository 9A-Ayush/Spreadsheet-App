import { type SheetState, cellKey } from "../store/types";
import { parseCellRef } from "./cellRefs";

/**
 * Evaluates all cells and returns a map of cellKey -> computed display value.
 * Handles formulas, circular reference detection, and error states.
 */
export function computeAllCells(sheet: SheetState): Record<string, string> {
  const computed: Record<string, string> = {};
  const computing = new Set<string>(); // for circular reference detection

  function evaluate(key: string): string {
    if (key in computed) return computed[key];

    const cell = sheet.cells[key];
    if (!cell || cell.raw === "") {
      computed[key] = "";
      return "";
    }

    if (!cell.raw.startsWith("=")) {
      computed[key] = cell.raw;
      return cell.raw;
    }

    // It's a formula
    if (computing.has(key)) {
      computed[key] = "#CIRCULAR";
      return "#CIRCULAR";
    }

    computing.add(key);

    try {
      const result = evaluateExpression(cell.raw.substring(1), sheet, (refKey) => {
        return evaluate(refKey);
      });
      computed[key] = result;
    } catch {
      computed[key] = "#ERROR";
    }

    computing.delete(key);
    return computed[key];
  }

  // Evaluate all cells that exist
  for (const key of Object.keys(sheet.cells)) {
    evaluate(key);
  }

  return computed;
}

/**
 * Evaluates a single formula expression (without the leading '=').
 * Supports: cell references (A1), numbers, basic arithmetic (+, -, *, /)
 */
function evaluateExpression(
  expr: string,
  sheet: SheetState,
  resolveRef: (key: string) => string
): string {
  const trimmed = expr.trim();
  if (trimmed === "") return "#ERROR";

  // Tokenize: split into numbers, cell references, and operators
  // We use a simple recursive descent or expression evaluator
  try {
    const result = parseExpression(trimmed, 0, sheet, resolveRef);
    if (result.pos < trimmed.length) {
      return "#ERROR"; // leftover characters
    }
    const val = result.value;
    // Format result: if it's a clean integer, show without decimals
    if (Number.isFinite(val)) {
      if (Number.isInteger(val)) return val.toString();
      // Round to reasonable precision
      return parseFloat(val.toFixed(10)).toString();
    }
    return "#ERROR";
  } catch {
    return "#ERROR";
  }
}

interface ParseResult {
  value: number;
  pos: number;
}

function skipWhitespace(expr: string, pos: number): number {
  while (pos < expr.length && expr[pos] === " ") pos++;
  return pos;
}

/** Parse additive expression: term ((+|-) term)* */
function parseExpression(
  expr: string,
  pos: number,
  sheet: SheetState,
  resolveRef: (key: string) => string
): ParseResult {
  let result = parseTerm(expr, pos, sheet, resolveRef);

  while (true) {
    const p = skipWhitespace(expr, result.pos);
    if (p < expr.length && (expr[p] === "+" || expr[p] === "-")) {
      const op = expr[p];
      const right = parseTerm(expr, p + 1, sheet, resolveRef);
      result = {
        value: op === "+" ? result.value + right.value : result.value - right.value,
        pos: right.pos,
      };
    } else {
      result.pos = p;
      break;
    }
  }

  return result;
}

/** Parse multiplicative expression: factor ((*|/) factor)* */
function parseTerm(
  expr: string,
  pos: number,
  sheet: SheetState,
  resolveRef: (key: string) => string
): ParseResult {
  let result = parseFactor(expr, pos, sheet, resolveRef);

  while (true) {
    const p = skipWhitespace(expr, result.pos);
    if (p < expr.length && (expr[p] === "*" || expr[p] === "/")) {
      const op = expr[p];
      const right = parseFactor(expr, p + 1, sheet, resolveRef);
      if (op === "/" && right.value === 0) {
        throw new Error("Division by zero");
      }
      result = {
        value: op === "*" ? result.value * right.value : result.value / right.value,
        pos: right.pos,
      };
    } else {
      result.pos = p;
      break;
    }
  }

  return result;
}

/** Parse factor: number | cell reference | parenthesized expression | unary minus */
function parseFactor(
  expr: string,
  pos: number,
  sheet: SheetState,
  resolveRef: (key: string) => string
): ParseResult {
  pos = skipWhitespace(expr, pos);

  if (pos >= expr.length) throw new Error("Unexpected end");

  // Unary minus
  if (expr[pos] === "-") {
    const inner = parseFactor(expr, pos + 1, sheet, resolveRef);
    return { value: -inner.value, pos: inner.pos };
  }

  // Parenthesized expression
  if (expr[pos] === "(") {
    const inner = parseExpression(expr, pos + 1, sheet, resolveRef);
    const p = skipWhitespace(expr, inner.pos);
    if (p >= expr.length || expr[p] !== ")") throw new Error("Missing )");
    return { value: inner.value, pos: p + 1 };
  }

  // Cell reference: letter(s) followed by digit(s)
  const cellMatch = expr.substring(pos).match(/^([A-Za-z]+)(\d+)/);
  if (cellMatch) {
    const ref = parseCellRef(cellMatch[0]);
    if (ref) {
      const key = `${ref.row}:${ref.col}`;
      const refValue = resolveRef(key);

      if (refValue === "#CIRCULAR" || refValue === "#ERROR") {
        throw new Error(refValue);
      }

      const numVal = refValue === "" ? 0 : parseFloat(refValue);
      if (isNaN(numVal)) throw new Error("Non-numeric reference");

      return { value: numVal, pos: pos + cellMatch[0].length };
    }
  }

  // Number (integer or decimal)
  const numMatch = expr.substring(pos).match(/^(\d+\.?\d*)/);
  if (numMatch) {
    return {
      value: parseFloat(numMatch[1]),
      pos: pos + numMatch[1].length,
    };
  }

  throw new Error("Unexpected character: " + expr[pos]);
}

/**
 * Compute a single cell's display value (convenience wrapper).
 */
export function computeCell(
  sheet: SheetState,
  row: number,
  col: number,
  computedCache: Record<string, string>
): string {
  const key = cellKey(row, col);
  if (key in computedCache) return computedCache[key];
  return "";
}