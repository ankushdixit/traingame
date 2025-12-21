"use client";

/**
 * Seat component - displays an individual seat in the compartment
 * Uses character illustrations instead of text labels
 */

import { useState, KeyboardEvent } from "react";
import { Seat as SeatType } from "@/lib/types";
import { SeatPopover } from "./SeatPopover";
import { TrainSeat } from "./TrainSeat";
import { SpeechBubble } from "./SpeechBubble";
import { STATIONS } from "@/lib/constants";
import { renderCharacter, PlayerCharacter } from "./characters";

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

interface SeatContentProps {
  displayState: SeatDisplayState;
  seat: SeatType;
}

function SeatContent({ displayState, seat }: SeatContentProps) {
  switch (displayState) {
    case "empty":
      return (
        <div className="flex items-center justify-center h-full">
          <span className="text-sm font-medium text-gray-500">Empty</span>
        </div>
      );
    case "occupied":
    case "occupied-known":
    case "hovered":
      return (
        <div className="relative flex flex-col items-center justify-center h-full">
          {/* Character illustration */}
          <div className="w-12 h-16" role="img" aria-label={`Passenger ${seat.occupant!.id}`}>
            {renderCharacter(seat.occupant!.characterSprite, true)}
          </div>
          {/* Speech bubble for revealed destination */}
          {displayState === "occupied-known" && (
            <SpeechBubble stationName={STATIONS[seat.occupant!.destination]} position="top" />
          )}
          {/* Watching indicator for hovered state */}
          {displayState === "hovered" && (
            <span
              className="absolute bottom-0 text-xs text-orange-600 font-medium"
              data-testid={`seat-${seat.id}-watching`}
            >
              Watching...
            </span>
          )}
        </div>
      );
    case "player":
      return (
        <div className="flex flex-col items-center justify-center h-full">
          {/* Player character */}
          <div className="w-12 h-16" role="img" aria-label="You - the player character">
            <PlayerCharacter isSeated={true} />
          </div>
          <span className="text-xs font-bold text-orange-600 mt-1">You</span>
        </div>
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
