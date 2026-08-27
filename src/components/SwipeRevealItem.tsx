import { Box } from "@mui/material";
import {
  ReactNode,
  TouchEvent as ReactTouchEvent,
  useRef,
  useState,
} from "react";
import swipeAction from "utils/swipeAction";

interface SwipeRevealItemProps {
  /** Revealed when the row is dragged towards the end (finger moves right). */
  startPanel: ReactNode;
  /** Revealed when the row is dragged towards the start (finger moves left). */
  endPanel: ReactNode;
  onStartAction: () => void;
  onEndAction: () => void;
  children: ReactNode;
}

// Vertical movement this much larger than horizontal means the user is
// scrolling the list, not swiping the row.
const scrollBias = 1.2;

// Below this the gesture hasn't committed to a direction yet.
const directionSlop = 6;

/**
 * A list row that can be dragged sideways to uncover an action on either
 * side. Replaces react-swipeable-views, which is unmaintained, caps its React
 * peer at 17, and no longer survives this project's bundler: its CommonJS
 * default export arrived as a module object and crashed the whole wallet with
 * "Element type is invalid" as soon as a transaction existed.
 *
 * Touch events rather than pointer events: Chrome stops emitting the
 * compatibility `pointermove` stream partway through a touch drag here, so a
 * pointer-based version only ever saw the first few pixels of the gesture.
 * `touch-action: pan-y` leaves vertical scrolling with the browser.
 */
export default function SwipeRevealItem({
  startPanel,
  endPanel,
  onStartAction,
  onEndAction,
  children,
}: SwipeRevealItemProps) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const horizontal = useRef(false);
  // Read on touchend, where the event carries no coordinates of its own.
  const latestOffset = useRef(0);

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    origin.current = { x: touch.clientX, y: touch.clientY };
    horizontal.current = false;
    latestOffset.current = 0;
  };

  const handleTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch || !origin.current) return;

    const dx = touch.clientX - origin.current.x;
    const dy = touch.clientY - origin.current.y;

    if (!horizontal.current) {
      if (Math.abs(dy) > Math.abs(dx) * scrollBias) {
        origin.current = null;
        return;
      }
      if (Math.abs(dx) < directionSlop) return;
      horizontal.current = true;
      setDragging(true);
    }

    const width = containerRef.current?.offsetWidth ?? 0;
    const next = width > 0 ? Math.max(-width, Math.min(width, dx)) : dx;
    latestOffset.current = next;
    setOffset(next);
  };

  const handleTouchEnd = () => {
    if (!horizontal.current) {
      origin.current = null;
      return;
    }

    const action = swipeAction(
      latestOffset.current,
      containerRef.current?.offsetWidth ?? 0,
    );

    origin.current = null;
    horizontal.current = false;
    latestOffset.current = 0;
    setDragging(false);
    setOffset(0);

    if (action === "start") onStartAction();
    if (action === "end") onEndAction();
  };

  return (
    <Box
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 1,
        touchAction: "pan-y",
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          // Whichever panel is showing has to sit against the edge the row is
          // being pulled away from.
          justifyContent: offset > 0 ? "flex-start" : "flex-end",
          "& > *": { width: "100%", height: "100%" },
        }}
      >
        {offset === 0 ? null : offset > 0 ? startPanel : endPanel}
      </Box>

      <Box
        sx={{
          position: "relative",
          transform: `translateX(${offset}px)`,
          transition: dragging ? "none" : "transform 225ms ease-out",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
