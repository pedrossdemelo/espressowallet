import { ModeContext } from "context";
import { useContext } from "react";

export default function useMode() {
  return useContext(ModeContext);
}
