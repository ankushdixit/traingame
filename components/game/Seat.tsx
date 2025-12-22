"use client";

/**
 * Seat component - displays an individual seat in the compartment
 * Updated for new game mechanics:
 * - Occupied seats show popover with Ask/Watch options
 * - Empty seats during grab phase are directly clickable (single tap)
 * - Shows watch indicator when player is watching this seat
 */

import { useState, KeyboardEvent, useMemo } from "react";
import { Seat as SeatType } from "@/lib/types";
import { TransitionState } from "@/lib/useTransitionController";
import { SeatPopover } from "./SeatPopover";
import { TrainSeat } from "./TrainSeat";
import { SpeechBubble } from "./SpeechBubble";
import { getStations } from "@/lib/constants";
import { renderCharacter, PlayerCharacter } from "./characters";

export type SeatDisplayState =
  | "empty"
  | "occupied"
  | "occupied-known"
  | "player"
  | "watched"
  | "grabbable";

interface SeatProps {
  seat: SeatType;
  isPlayerSeat: boolean;
  isPlayerSeated: boolean;
  isWatched: boolean; // Is this seat being watched by player
  isAdjacent: boolean; // Is player's position adjacent to this seat
  actionsRemaining: number;
  isGrabPhase: boolean; // Is the grab competition active
  line: "short" | "full";
  transitionState?: TransitionState;
  playerClaimSuccess?: boolean;
  onAskDestination: (id: number) => void;
  onWatchSeat: (id: number) => void;
  onGrabSeat: (id: number) => void;
}

function getSeatDisplayState(
  seat: SeatType,
  isPlayerSeat: boolean,
  isWatched: boolean,
  isGrabPhase: boolean
): SeatDisplayState {
  if (isPlayerSeat) return "player";
  if (seat.occupant === null) {
    if (isGrabPhase) return "grabbable";
    return "empty";
  }
  if (isWatched) return "watched";
  if (seat.occupant.destinationRevealed) return "occupied-known";
  return "occupied";
}

function EmptySeatContent({ isGrabPhase }: { isGrabPhase: boolean }) {
  if (isGrabPhase) {
    return (
      <div className="flex flex-col items-center text-emerald-600 animate-pulse">
        <span className="text-2xl">🎯</span>
        <span className="text-xs font-bold">TAP!</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-stone-400">
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-xs font-medium">Empty</span>
    </div>
  );
}

function PlayerSeatContent() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-12 h-14" role="img" aria-label="You - the player character">
        <PlayerCharacter isSeated={true} />
      </div>
    </div>
  );
}

interface OccupiedSeatContentProps {
  seat: SeatType;
  displayState: SeatDisplayState;
  isDeparting: boolean;
  isNpcClaiming: boolean;
  line: "short" | "full";
}

function OccupiedSeatContent({
  seat,
  displayState,
  isDeparting,
  isNpcClaiming,
  line,
}: OccupiedSeatContentProps) {
  const animationClasses = [
    isDeparting ? "animate-npc-exit" : "",
    isNpcClaiming ? "animate-seat-claim" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const stations = getStations(line);

  // Show destination if revealed (regardless of watched state)
  const showDestination = seat.occupant?.destinationRevealed;

  return (
    <div
      className={`relative flex flex-col items-center justify-center h-full ${animationClasses}`}
    >
      <div className="w-12 h-16" role="img" aria-label={`Passenger ${seat.occupant!.id}`}>
        {renderCharacter(seat.occupant!.characterSprite, true)}
      </div>
      {/* Show destination bubble if revealed (works for both watched and non-watched seats) */}
      {showDestination && (
        <SpeechBubble stationName={stations[seat.occupant!.destination]} position="top" />
      )}
      {/* Show watch indicator when seat is being watched */}
      {displayState === "watched" && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-xs">👁️</span>
        </div>
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
  isGrabPhase: boolean;
  line: "short" | "full";
}

function SeatContent({
  displayState,
  seat,
  isDeparting,
  isNpcClaiming,
  isGrabPhase,
  line,
}: SeatContentProps) {
  if (displayState === "empty" || displayState === "grabbable") {
    return <EmptySeatContent isGrabPhase={isGrabPhase} />;
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
      line={line}
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

// eslint-disable-next-line complexity
export function Seat({
  seat,
  isPlayerSeat,
  isPlayerSeated,
  isWatched,
  isAdjacent,
  actionsRemaining,
  isGrabPhase,
  line,
  transitionState,
  playerClaimSuccess = false,
  onAskDestination,
  onWatchSeat,
  onGrabSeat,
}: SeatProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const displayState = getSeatDisplayState(seat, isPlayerSeat, isWatched, isGrabPhase);

  // Determine if seat is clickable
  const isEmpty = seat.occupant === null;
  const isOccupied = seat.occupant !== null;
  const isClickable =
    !isPlayerSeat &&
    !isPlayerSeated &&
    ((isEmpty && isGrabPhase) || // Empty during grab phase = single tap to grab
      isOccupied); // Occupied = show popover

  const { isDeparting, isNpcClaiming, showPlayerSuccess } = useAnimationState(
    seat,
    transitionState,
    isPlayerSeat,
    playerClaimSuccess
  );

  const handleClick = () => {
    if (!isClickable) return;

    if (isEmpty && isGrabPhase) {
      // Direct grab during grab phase
      onGrabSeat(seat.id);
    } else if (isOccupied) {
      // Show popover for occupied seats
      setIsPopoverOpen(true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick();
    }
  };

  const handleClosePopover = () => setIsPopoverOpen(false);

  // Extra classes for special states
  const extraClasses = [
    showPlayerSuccess ? "animate-success" : "",
    isGrabPhase && isEmpty ? "animate-pulse ring-2 ring-emerald-400" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="relative">
      <TrainSeat
        displayState={displayState}
        isClickable={isClickable}
        onClick={handleClick}
        onKeyDown={isClickable ? handleKeyDown : undefined}
        testId={`seat-${seat.id}`}
        seatNumber={seat.id}
        extraClasses={extraClasses}
      >
        <SeatContent
          displayState={displayState}
          seat={seat}
          isDeparting={isDeparting}
          isNpcClaiming={isNpcClaiming}
          isGrabPhase={isGrabPhase}
          line={line}
        />
      </TrainSeat>

      {isPopoverOpen && isOccupied && (
        <SeatPopover
          seat={seat}
          isPlayerSeated={isPlayerSeated}
          isWatched={isWatched}
          isAdjacent={isAdjacent}
          actionsRemaining={actionsRemaining}
          onAskDestination={() => {
            onAskDestination(seat.id);
            handleClosePopover();
          }}
          onWatchSeat={() => {
            onWatchSeat(seat.id);
            handleClosePopover();
          }}
          onClose={handleClosePopover}
        />
      )}
    </div>
  );
}
