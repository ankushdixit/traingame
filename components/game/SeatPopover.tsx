"use client";

/**
 * SeatPopover component - displays actions for a seat when clicked
 * Matches single-shot design with arrow and styled buttons
 */

import { useEffect, useRef } from "react";
import { Seat } from "@/lib/types";

interface SeatPopoverProps {
  seat: Seat;
  isPlayerSeated: boolean;
  isHovered: boolean;
  onRevealDestination: () => void;
  onClaimSeat: () => void;
  onHoverNear: () => void;
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
      className="absolute z-20 top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-stone-200 p-2 min-w-[140px] animate-in fade-in slide-in-from-top-2 duration-200"
      data-testid="seat-popover"
    >
      {/* Arrow pointing up */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-stone-200 rotate-45" />
      {children}
    </div>
  );
}

export function SeatPopover({
  seat,
  isPlayerSeated,
  isHovered,
  onRevealDestination,
  onClaimSeat,
  onHoverNear,
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

  // Empty seat - show claim option
  if (!seat.occupant) {
    return (
      <PopoverContainer popoverRef={popoverRef}>
        <button
          onClick={onClaimSeat}
          className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all"
          data-testid="claim-seat-button"
        >
          🎯 Claim Seat!
        </button>
        <button
          onClick={onClose}
          className="w-full mt-1 px-3 py-1.5 rounded-lg text-xs text-stone-500 hover:bg-stone-100 transition-all"
        >
          Close
        </button>
      </PopoverContainer>
    );
  }

  // Occupied seat with revealed destination - can only hover near
  if (seat.occupant.destinationRevealed) {
    return (
      <PopoverContainer popoverRef={popoverRef}>
        <button
          onClick={onRevealDestination}
          disabled
          className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-stone-100 text-stone-400 cursor-not-allowed"
          data-testid="ask-destination-button"
        >
          ✓ Asked
        </button>
        <button
          onClick={onHoverNear}
          disabled={isHovered}
          className={`w-full mt-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            isHovered
              ? "bg-stone-100 text-stone-400 cursor-not-allowed"
              : "bg-purple-50 text-purple-700 hover:bg-purple-100"
          }`}
          data-testid="hover-near-button"
        >
          {isHovered ? "👁️ Watching" : "👁️ Watch Seat"}
        </button>
        <button
          onClick={onClose}
          className="w-full mt-1 px-3 py-1.5 rounded-lg text-xs text-stone-500 hover:bg-stone-100 transition-all"
        >
          Close
        </button>
      </PopoverContainer>
    );
  }

  // Occupied seat with unrevealed destination
  return (
    <PopoverContainer popoverRef={popoverRef}>
      <button
        onClick={onRevealDestination}
        className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
        data-testid="ask-destination-button"
      >
        🗣️ Ask Destination
      </button>
      <button
        onClick={onHoverNear}
        disabled={isHovered}
        className={`w-full mt-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          isHovered
            ? "bg-stone-100 text-stone-400 cursor-not-allowed"
            : "bg-purple-50 text-purple-700 hover:bg-purple-100"
        }`}
        data-testid="hover-near-button"
      >
        {isHovered ? "👁️ Watching" : "👁️ Watch Seat"}
      </button>
      <button
        onClick={onClose}
        className="w-full mt-1 px-3 py-1.5 rounded-lg text-xs text-stone-500 hover:bg-stone-100 transition-all"
      >
        Close
      </button>
    </PopoverContainer>
  );
}
