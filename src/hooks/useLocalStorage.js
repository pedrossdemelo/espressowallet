import { useState } from "react";

function writeInitialState(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export default function useLocalStorage(key, initialState) {
  const [storedValue, setStoredValue] = useState(
    JSON.parse(localStorage.getItem(key)) ??
      writeInitialState(key, initialState)
  );

  function setValue(value) {
    localStorage.setItem(key, JSON.stringify(value));
    setStoredValue(value);
  }

  return [storedValue, setValue];
}
