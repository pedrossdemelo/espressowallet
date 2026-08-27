export type SwipeAction = "start" | "end" | null;

/** Fraction of the row's width a drag has to cross to count as an action. */
export const swipeThreshold = 0.25;

/**
 * Decides what a finished horizontal drag meant.
 *
 * `offset` is how far the row was dragged: positive when dragged towards the
 * end of the row (revealing what sits at its start), negative the other way.
 * Anything short of the threshold snaps back and does nothing.
 */
export default function swipeAction(
  offset: number,
  width: number,
  threshold = swipeThreshold,
): SwipeAction {
  if (!Number.isFinite(offset) || !Number.isFinite(width) || width <= 0)
    return null;

  const travelled = offset / width;
  if (travelled >= threshold) return "start";
  if (travelled <= -threshold) return "end";
  return null;
}
