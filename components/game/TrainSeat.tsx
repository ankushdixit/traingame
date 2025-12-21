"use client";

/**
 * TrainSeat component - themed train bench seat styling
 * Wraps around seat content to provide Mumbai local train visual appearance
 * Matches single-shot design with emerald/rose/amber colors
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
  seatNumber: number;
  extraClasses?: string;
}

/**
 * Returns the appropriate color classes based on seat state.
 * Matches single-shot design palette.
 */
function getSeatColorClasses(displayState: SeatDisplayState): string {
  switch (displayState) {
    case "empty":
      // Empty seat - emerald/green with pulse animation
      return "bg-gradient-to-b from-emerald-100 to-emerald-200 border-emerald-400 hover:from-emerald-200 hover:to-emerald-300 animate-pulse";
    case "occupied":
      // Occupied seat - rose/pink
      return "bg-gradient-to-b from-rose-100 to-rose-200 border-rose-300 hover:from-rose-200 hover:to-rose-300";
    case "occupied-known":
      // Known destination - still rose but slightly different
      return "bg-gradient-to-b from-rose-100 to-rose-200 border-rose-300";
    case "hovered":
      // Watching seat - purple tint
      return "bg-gradient-to-b from-purple-100 to-purple-200 border-purple-300";
    case "player":
      // Player seat - amber/gold with ring
      return "bg-gradient-to-b from-amber-200 to-amber-300 border-amber-500 ring-4 ring-amber-400 shadow-lg shadow-amber-200/50";
  }
}

export function TrainSeat({
  displayState,
  isClickable,
  onClick,
  onKeyDown,
  children,
  testId,
  seatNumber,
  extraClasses = "",
}: TrainSeatProps) {
  const seatClasses = cn(
    // Base bench seat shape matching single-shot
    "relative w-24 h-28 rounded-t-xl transition-all duration-300 flex flex-col items-center justify-center gap-1",
    "border-2 shadow-md",
    // Color based on state
    getSeatColorClasses(displayState),
    // Interactivity
    isClickable && "cursor-pointer hover:scale-105",
    !isClickable && displayState !== "player" && "cursor-default",
    // Extra classes for animations
    extraClasses
  );

  return (
    <div className="relative">
      <button
        className={seatClasses}
        data-testid={testId}
        data-state={displayState}
        onClick={onClick}
        onKeyDown={onKeyDown}
        disabled={!isClickable && displayState !== "player"}
        type="button"
      >
        {/* Seat back design */}
        <div
          className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-stone-400 to-stone-500 rounded-t-xl"
          aria-hidden="true"
        />

        {/* Content area */}
        <div className="relative z-10 flex flex-col items-center justify-center">{children}</div>

        {/* Seat number */}
        <span className="absolute bottom-1 right-1 text-xs text-stone-400 font-mono">
          #{seatNumber + 1}
        </span>
      </button>

      {/* Seat base/cushion */}
      <div
        className="w-24 h-3 bg-gradient-to-b from-stone-500 to-stone-600 rounded-b-lg shadow-md"
        aria-hidden="true"
      />
    </div>
  );
}
