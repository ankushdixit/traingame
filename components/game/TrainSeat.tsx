"use client";

/**
 * TrainSeat component - themed train bench seat styling
 * Wraps around seat content to provide Mumbai local train visual appearance
 */

import { KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SeatDisplayState } from "./Seat";

interface TrainSeatProps {
  displayState: SeatDisplayState;
  isClickable: boolean;
  onClick?: () => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  children: ReactNode;
  testId: string;
}

/**
 * Returns the appropriate train-themed color classes based on seat state.
 */
function getSeatColorClasses(displayState: SeatDisplayState): string {
  switch (displayState) {
    case "empty":
      // Empty seat - maroon cushion, inviting
      return "bg-train-maroon border-train-maroon-dark";
    case "occupied":
      // Occupied seat - darker, someone sitting
      return "bg-train-maroon-dark border-train-maroon";
    case "occupied-known":
      // Known destination - blue tint to indicate information
      return "bg-blue-800 border-blue-900";
    case "hovered":
      // Watching seat - purple tint
      return "bg-purple-800 border-purple-900";
    case "player":
      // Player seat - gold/yellow highlight
      return "bg-yellow-600 border-yellow-700 ring-2 ring-yellow-400";
  }
}

/**
 * Returns text color class based on seat state for content visibility.
 */
function getTextColorClass(displayState: SeatDisplayState): string {
  switch (displayState) {
    case "player":
      return "text-yellow-100";
    default:
      return "text-train-cream";
  }
}

export function TrainSeat({
  displayState,
  isClickable,
  onClick,
  onKeyDown,
  children,
  testId,
}: TrainSeatProps) {
  const seatClasses = cn(
    // Base bench seat shape
    "relative flex h-24 w-28 flex-col items-center justify-center",
    "rounded-t-lg rounded-b-sm border-2 shadow-md",
    "transition-all duration-150",
    // Color based on state
    getSeatColorClasses(displayState),
    // Text color
    getTextColorClass(displayState),
    // Interactivity
    isClickable &&
      "cursor-pointer hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-train-cream"
  );

  return (
    <div
      className={seatClasses}
      data-testid={testId}
      data-state={displayState}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={onKeyDown}
    >
      {/* Seat back (top part) */}
      <div
        className="absolute top-0 right-0 left-0 h-4 rounded-t-lg bg-train-metallic-dark opacity-30"
        aria-hidden="true"
      />

      {/* Seat cushion base */}
      <div
        className="absolute right-0 bottom-0 left-0 h-3 rounded-b-sm bg-train-seat-cushion"
        aria-hidden="true"
      />

      {/* Content area */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-1">
        {children}
      </div>
    </div>
  );
}
