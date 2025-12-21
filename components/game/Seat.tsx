"use client";

/**
 * Seat component - displays an individual seat in the compartment
 * Uses character illustrations instead of text labels
 */

import { useState, KeyboardEvent, useMemo } from "react";
import { Seat as SeatType } from "@/lib/types";
import { TransitionState } from "@/lib/useTransitionController";
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
  transitionState?: TransitionState;
  playerClaimSuccess?: boolean;
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

function EmptySeatContent() {
  return (
    <div className="flex items-center justify-center h-full">
      <span className="text-sm font-medium text-gray-500">Empty</span>
    </div>
  );
}

function PlayerSeatContent() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-12 h-16" role="img" aria-label="You - the player character">
        <PlayerCharacter isSeated={true} />
      </div>
      <span className="text-xs font-bold text-orange-600 mt-1">You</span>
    </div>
  );
}

interface OccupiedSeatContentProps {
  seat: SeatType;
  displayState: SeatDisplayState;
  isDeparting: boolean;
  isNpcClaiming: boolean;
}

function OccupiedSeatContent({
  seat,
  displayState,
  isDeparting,
  isNpcClaiming,
}: OccupiedSeatContentProps) {
  const animationClasses = [
    isDeparting ? "animate-npc-exit" : "",
    isNpcClaiming ? "animate-seat-claim" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`relative flex flex-col items-center justify-center h-full ${animationClasses}`}
    >
      <div className="w-12 h-16" role="img" aria-label={`Passenger ${seat.occupant!.id}`}>
        {renderCharacter(seat.occupant!.characterSprite, true)}
      </div>
      {displayState === "occupied-known" && (
        <SpeechBubble stationName={STATIONS[seat.occupant!.destination]} position="top" />
      )}
      {displayState === "hovered" && (
        <span
          className="absolute bottom-0 text-xs text-orange-600 font-medium"
          data-testid={`seat-${seat.id}-watching`}
        >
          Watching...
        </span>
      )}
      {isNpcClaiming && (
        <span
          className="absolute -top-2 left-1/2 -translate-x-1/2 animate-npc-claim rounded bg-red-500 px-2 py-0.5 text-xs font-bold text-white"
          data-testid={`seat-${seat.id}-claim-indicator`}
        >
          Claimed!
        </span>
      )}
    </div>
  );
}

interface SeatContentProps {
  displayState: SeatDisplayState;
  seat: SeatType;
  isDeparting: boolean;
  isNpcClaiming: boolean;
}

function SeatContent({ displayState, seat, isDeparting, isNpcClaiming }: SeatContentProps) {
  if (displayState === "empty") {
    return <EmptySeatContent />;
  }

  if (displayState === "player") {
    return <PlayerSeatContent />;
  }

  return (
    <OccupiedSeatContent
      seat={seat}
      displayState={displayState}
      isDeparting={isDeparting}
      isNpcClaiming={isNpcClaiming}
    />
  );
}

function useAnimationState(
  seat: SeatType,
  transitionState: TransitionState | undefined,
  isPlayerSeat: boolean,
  playerClaimSuccess: boolean
) {
  return useMemo(() => {
    const isDeparting =
      transitionState?.phase === "departing" &&
      seat.occupant !== null &&
      transitionState.departingNpcIds.includes(seat.occupant.id);

    const isNpcClaiming =
      transitionState?.phase === "claiming" &&
      transitionState.claimedSeatId === seat.id &&
      transitionState.claimingNpcId !== null;

    const showPlayerSuccess = playerClaimSuccess && isPlayerSeat;

    return { isDeparting, isNpcClaiming, showPlayerSuccess };
  }, [seat, transitionState, isPlayerSeat, playerClaimSuccess]);
}

export function Seat({
  seat,
  isPlayerSeat,
  isPlayerSeated,
  isHovered,
  transitionState,
  playerClaimSuccess = false,
  onRevealDestination,
  onClaimSeat,
  onHoverNear,
}: SeatProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const displayState = getSeatDisplayState(seat, isPlayerSeat, isHovered);
  const isClickable = !isPlayerSeat && !isPlayerSeated;

  const { isDeparting, isNpcClaiming, showPlayerSuccess } = useAnimationState(
    seat,
    transitionState,
    isPlayerSeat,
    playerClaimSuccess
  );

  const handleClick = () => {
    if (isClickable) {
      setIsPopoverOpen(true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick();
    }
  };

  const handleClosePopover = () => setIsPopoverOpen(false);

  return (
    <div className="relative">
      <TrainSeat
        displayState={displayState}
        isClickable={isClickable}
        onClick={handleClick}
        onKeyDown={isClickable ? handleKeyDown : undefined}
        testId={`seat-${seat.id}`}
        extraClasses={showPlayerSuccess ? "animate-success" : ""}
      >
        <SeatContent
          displayState={displayState}
          seat={seat}
          isDeparting={isDeparting}
          isNpcClaiming={isNpcClaiming}
        />
      </TrainSeat>

      {isPopoverOpen && (
        <SeatPopover
          seat={seat}
          isPlayerSeated={isPlayerSeated}
          isHovered={isHovered}
          onRevealDestination={() => {
            onRevealDestination(seat.id);
            handleClosePopover();
          }}
          onClaimSeat={() => {
            onClaimSeat(seat.id);
            handleClosePopover();
          }}
          onHoverNear={() => {
            onHoverNear(seat.id);
            handleClosePopover();
          }}
          onClose={handleClosePopover}
        />
      )}
    </div>
  );
}
