import { TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "../store";

/**
 * `useSelector` with this app's state baked in.
 *
 * react-redux v8 dropped the `DefaultRootState` fallback that let plain
 * `useSelector` calls infer the store's shape, so selectors have to reach the
 * typing through a hook like this one instead.
 */
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useAppSelector;
