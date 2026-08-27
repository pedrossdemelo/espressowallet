import { useState } from "react";

function writeInitialState<T>(key: string, value: T): T {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export default function useLocalStorage<T>(key: string, initialState: T) {
  const raw = localStorage.getItem(key);
  const parsed: T | null = raw !== null ? JSON.parse(raw) : null;

  const [storedValue, setStoredValue] = useState<T>(
    parsed ?? writeInitialState(key, initialState)
  );

  function setValue(value: T) {
    localStorage.setItem(key, JSON.stringify(value));
    setStoredValue(value);
  }

  return [storedValue, setValue] as const;
}
