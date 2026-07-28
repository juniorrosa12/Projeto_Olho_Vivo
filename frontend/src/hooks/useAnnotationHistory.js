import { useCallback, useRef, useState } from "react";

export default function useAnnotationHistory(initialValue = []) {
  const [value, setValue] = useState(initialValue);
  const historyRef = useRef([initialValue]);
  const indexRef = useRef(0);
  const [, updateVersion] = useState(0);

  const replace = useCallback((next) => setValue(next), []);
  const commit = useCallback((next) => {
    const history = historyRef.current.slice(0, indexRef.current + 1);
    history.push(next);
    historyRef.current = history;
    indexRef.current = history.length - 1;
    setValue(next);
    updateVersion((version) => version + 1);
  }, []);
  const reset = useCallback((next) => {
    historyRef.current = [next];
    indexRef.current = 0;
    setValue(next);
    updateVersion((version) => version + 1);
  }, []);
  const undo = useCallback(() => {
    if (!indexRef.current) return;
    indexRef.current -= 1;
    setValue(historyRef.current[indexRef.current]);
    updateVersion((version) => version + 1);
  }, []);
  const redo = useCallback(() => {
    if (indexRef.current >= historyRef.current.length - 1) return;
    indexRef.current += 1;
    setValue(historyRef.current[indexRef.current]);
    updateVersion((version) => version + 1);
  }, []);

  return { value, replace, commit, reset, undo, redo, canUndo: indexRef.current > 0, canRedo: indexRef.current < historyRef.current.length - 1 };
}
