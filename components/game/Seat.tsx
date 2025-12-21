"use client";

/**
 * Seat component - displays an individual seat in the compartment
 */

import { useState, KeyboardEvent } from "react";
import { Seat as SeatType } from "@/lib/types";
import { SeatPopover } from "./SeatPopover";
import { TrainSeat } from "./TrainSeat";
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
      return <span className="text-sm font-medium">Empty</span>;
    case "occupied":
      return (
        <span className="text-2xl" role="img" aria-label="passenger">
          🧑
        </span>
      );
    case "occupied-known":
      return (
        <>
          <span className="text-2xl" role="img" aria-label="passenger">
            🧑
          </span>
          <span className="text-xs opacity-90" data-testid={`seat-${seat.id}-destination`}>
            → {STATIONS[seat.occupant!.destination]}
          </span>
        </>
      );
    case "hovered":
      return (
        <>
          <span className="text-2xl" role="img" aria-label="passenger">
            🧑
          </span>
          <span className="text-xs opacity-90" data-testid={`seat-${seat.id}-watching`}>
            Watching...
          </span>
        </>
      );
    case "player":
      return (
        <>
          <span className="text-2xl" role="img" aria-label="you">
            😊
          </span>
          <span className="text-sm font-bold">You</span>
        </>
      );
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
      <TrainSeat
        displayState={displayState}
        isClickable={isClickable}
        onClick={handleClick}
        onKeyDown={isClickable ? handleKeyDown : undefined}
        testId={`seat-${seat.id}`}
      >
        <SeatContent displayState={displayState} seat={seat} />
      </TrainSeat>

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
