import { useEffect, useRef } from "react";
import { type SheetState } from "../store/types";
import { saveToLocalStorage } from "../utils/persistence";

/**
 * Debounced auto-save hook. Saves sheet state to localStorage
 * 500ms after the last change.
 */
export function useDebouncedPersistence(sheet: SheetState): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sheetRef = useRef(sheet);
  sheetRef.current = sheet;

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      saveToLocalStorage(sheetRef.current);
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [sheet]);
}
