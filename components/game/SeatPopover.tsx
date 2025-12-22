"use client";

/**
 * SeatPopover component - displays actions for a seat when clicked
 * Updated for new action system:
 * - Ask Destination: costs 1 action
 * - Watch Seat: costs 1 action, must be adjacent
 * - No claim option (handled during grab phase)
 */

import { useEffect, useRef } from "react";
import { Seat } from "@/lib/types";

interface SeatPopoverProps {
  seat: Seat;
  isPlayerSeated: boolean;
  isWatched: boolean; // Is this seat being watched by player
  isAdjacent: boolean; // Is player's position adjacent to this seat
  actionsRemaining: number;
  onAskDestination: () => void;
  onWatchSeat: () => void;
  onClose: () => void;
}

function PopoverContainer({
  children,
  popoverRef,
}: {
  children: React.ReactNode;
  popoverRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={popoverRef}
      className="absolute z-20 top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-stone-200 p-2 min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-200"
      data-testid="seat-popover"
    >
      {/* Arrow pointing up */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-stone-200 rotate-45" />
      {children}
    </div>
  );
}

// eslint-disable-next-line complexity, max-lines-per-function
export function SeatPopover({
  seat,
  isPlayerSeated,
  isWatched,
  isAdjacent,
  actionsRemaining,
  onAskDestination,
  onWatchSeat,
  onClose,
}: SeatPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Seated player cannot interact with seats
  if (isPlayerSeated) {
    return null;
  }

  // Empty seat - no popover in new system (grab phase handles this)
  if (!seat.occupant) {
    return null;
  }

  const noActionsLeft = actionsRemaining <= 0;
  const alreadyAsked = seat.occupant.destinationRevealed;
  const canAsk = !alreadyAsked && !noActionsLeft;
  const canWatch = isAdjacent && !isWatched && !noActionsLeft;

  return (
    <PopoverContainer popoverRef={popoverRef}>
      {/* Actions remaining indicator */}
      <div className="flex items-center justify-center gap-1 mb-2 pb-2 border-b border-stone-100">
        <span className="text-xs text-stone-500">Actions:</span>
        {[0, 1].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < actionsRemaining ? "bg-amber-400" : "bg-stone-200"
            }`}
          />
        ))}
      </div>

      {/* Ask Destination Button */}
      <button
        onClick={() => {
          if (canAsk) {
            onAskDestination();
            onClose();
          }
        }}
        disabled={!canAsk}
        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          canAsk
            ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
            : "bg-stone-100 text-stone-400 cursor-not-allowed"
        }`}
        data-testid="ask-destination-button"
      >
        {alreadyAsked ? "✓ Asked" : "🗣️ Ask Destination"}
        {!alreadyAsked && !noActionsLeft && <span className="text-xs ml-1 opacity-70">(-1)</span>}
      </button>

      {/* Watch Seat Button */}
      <button
        onClick={() => {
          if (canWatch) {
            onWatchSeat();
            onClose();
          }
        }}
        disabled={!canWatch}
        className={`w-full mt-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          isWatched
            ? "bg-purple-100 text-purple-600 cursor-not-allowed"
            : canWatch
              ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
              : "bg-stone-100 text-stone-400 cursor-not-allowed"
        }`}
        data-testid="watch-seat-button"
      >
        {isWatched ? "👁️ Watching" : "👁️ Watch Seat"}
        {!isWatched && isAdjacent && !noActionsLeft && (
          <span className="text-xs ml-1 opacity-70">(-1)</span>
        )}
      </button>

      {/* Helper text for non-adjacent */}
      {!isAdjacent && !isWatched && (
        <p className="text-xs text-stone-400 mt-1 text-center">Move closer to watch</p>
      )}

      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-full mt-2 px-3 py-1.5 rounded-lg text-xs text-stone-500 hover:bg-stone-100 transition-all"
      >
        Close
      </button>
    </PopoverContainer>
  );
}

// Legacy export for backwards compatibility
export type { SeatPopoverProps };
