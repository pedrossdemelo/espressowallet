type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number },
  ) => number;
};

/**
 * Runs work once the browser has nothing better to do.
 *
 * Everything scheduled through here is background work that must never
 * compete with what the user is waiting on — the sign-in request most of all.
 * `timeout` caps how long it can be put off, so the work still happens on a
 * page that never goes idle.
 *
 * Falls back to a timer where requestIdleCallback is missing (Safari < 17).
 */
export default function whenIdle(work: () => void, timeout = 4000): void {
  const idle = (window as IdleWindow).requestIdleCallback;

  if (typeof idle === "function") {
    idle(work, { timeout });
    return;
  }

  window.setTimeout(work, Math.min(timeout, 1000));
}
