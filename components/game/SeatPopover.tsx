"use client";

/**
 * SeatPopover component - displays actions for a seat when clicked
 */

import { useEffect, useRef } from "react";
import { Seat } from "@/lib/types";
import { STATIONS } from "@/lib/constants";

interface SeatPopoverProps {
  seat: Seat;
  isPlayerSeated: boolean;
  isHovered: boolean;
  onRevealDestination: () => void;
  onClaimSeat: () => void;
  onHoverNear: () => void;
  onClose: () => void;
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
      <div
        ref={popoverRef}
        className="absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
        data-testid="seat-popover"
      >
        <button
          onClick={onClaimSeat}
          className="rounded bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
          data-testid="claim-seat-button"
        >
          Claim Seat
        </button>
      </div>
    );
  }

  // Occupied seat with revealed destination
  if (seat.occupant.destinationRevealed) {
    return (
      <div
        ref={popoverRef}
        className="absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
        data-testid="seat-popover"
      >
        <p className="mb-2 text-sm text-gray-700" data-testid="destination-revealed">
          Getting off at: {STATIONS[seat.occupant.destination]}
        </p>
        <button
          onClick={onHoverNear}
          className={`rounded px-4 py-2 text-sm font-medium ${
            isHovered ? "bg-gray-300 text-gray-600" : "bg-purple-500 text-white hover:bg-purple-600"
          }`}
          data-testid="hover-near-button"
          disabled={isHovered}
        >
          {isHovered ? "Watching this seat" : "Hover Near"}
        </button>
      </div>
    );
  }

  // Occupied seat with unrevealed destination
  return (
    <div
      ref={popoverRef}
      className="absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
      data-testid="seat-popover"
    >
      <div className="flex flex-col gap-2">
        <button
          onClick={onRevealDestination}
          className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          data-testid="ask-destination-button"
        >
          Ask destination?
        </button>
        <button
          onClick={onHoverNear}
          className={`rounded px-4 py-2 text-sm font-medium ${
            isHovered ? "bg-gray-300 text-gray-600" : "bg-purple-500 text-white hover:bg-purple-600"
          }`}
          data-testid="hover-near-button"
          disabled={isHovered}
        >
          {isHovered ? "Watching this seat" : "Hover Near"}
        </button>
      </div>
    </div>
  );
}
