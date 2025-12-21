"use client";

/**
 * Seat component - displays an individual seat in the compartment
 */

import { useState, KeyboardEvent } from "react";
import { Seat as SeatType } from "@/lib/types";
import { SeatPopover } from "./SeatPopover";
import { STATIONS } from "@/lib/constants";

export type SeatDisplayState = "empty" | "occupied" | "occupied-known" | "player" | "hovered";

interface SeatProps {
  seat: SeatType;
  isPlayerSeat: boolean;
  isPlayerSeated: boolean;
  isHovered: boolean;
  onRevealDestination: (id: number) => void;
  onClaimSeat: (id: number) => void;
  onHoverNear: (id: number) => void;
}

const seatStyles: Record<SeatDisplayState, string> = {
  empty: "bg-green-100 border-green-300",
  occupied: "bg-gray-200 border-gray-400",
  "occupied-known": "bg-blue-100 border-blue-300",
  player: "bg-yellow-200 border-yellow-500 ring-2 ring-yellow-400",
  hovered: "bg-purple-100 border-purple-400 ring-2 ring-purple-300",
};

function getSeatDisplayState(
  seat: SeatType,
  isPlayerSeat: boolean,
  isHovered: boolean
): SeatDisplayState {
  if (isPlayerSeat) return "player";
  if (isHovered && seat.occupant !== null) return "hovered";
  if (seat.occupant === null) return "empty";
  if (seat.occupant.destinationRevealed) return "occupied-known";
  return "occupied";
}

function SeatContent({ displayState, seat }: { displayState: SeatDisplayState; seat: SeatType }) {
  switch (displayState) {
    case "empty":
      return <span className="text-sm text-green-700">Empty</span>;
    case "occupied":
      return <span className="text-sm text-gray-700">Passenger</span>;
    case "occupied-known":
      return (
        <>
          <span className="text-sm text-blue-700">Passenger</span>
          <span className="text-xs text-blue-600" data-testid={`seat-${seat.id}-destination`}>
            → {STATIONS[seat.occupant!.destination]}
          </span>
        </>
      );
    case "hovered":
      return (
        <>
          <span className="text-sm text-purple-700">Passenger</span>
          <span className="text-xs text-purple-600" data-testid={`seat-${seat.id}-watching`}>
            Watching...
          </span>
        </>
      );
    case "player":
      return <span className="text-sm font-bold text-yellow-700">You</span>;
  }
}

export function Seat({
  seat,
  isPlayerSeat,
  isPlayerSeated,
  isHovered,
  onRevealDestination,
  onClaimSeat,
  onHoverNear,
}: SeatProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const displayState = getSeatDisplayState(seat, isPlayerSeat, isHovered);
  const isClickable = !isPlayerSeat && !isPlayerSeated;

  const handleClick = () => {
    if (!isClickable) return;
    setIsPopoverOpen(true);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick();
    }
  };

  return (
    <div className="relative">
      <div
        className={`flex h-20 w-24 flex-col items-center justify-center rounded-lg border-2 ${seatStyles[displayState]} ${isClickable ? "cursor-pointer hover:opacity-80" : ""}`}
        data-testid={`seat-${seat.id}`}
        data-state={displayState}
        onClick={handleClick}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={isClickable ? handleKeyDown : undefined}
      >
        <SeatContent displayState={displayState} seat={seat} />
      </div>

      {isPopoverOpen && (
        <SeatPopover
          seat={seat}
          isPlayerSeated={isPlayerSeated}
          isHovered={isHovered}
          onRevealDestination={() => {
            onRevealDestination(seat.id);
            setIsPopoverOpen(false);
          }}
          onClaimSeat={() => {
            onClaimSeat(seat.id);
            setIsPopoverOpen(false);
          }}
          onHoverNear={() => {
            onHoverNear(seat.id);
            setIsPopoverOpen(false);
          }}
          onClose={() => setIsPopoverOpen(false)}
        />
      )}
    </div>
  );
}
