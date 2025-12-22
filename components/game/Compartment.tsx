/**
 * Compartment component - displays the train compartment with themed styling
 * Seats arranged as facing benches with aisle between
 * Updated for new game mechanics with action system and grab phase
 */

import { ReactNode } from "react";
import { Seat as SeatType, Line } from "@/lib/types";
import { TransitionState } from "@/lib/useTransitionController";
import { Seat } from "./Seat";
import { TrainCompartment } from "./TrainCompartment";
import { isAdjacentToSeat } from "@/lib/constants";

interface CompartmentProps {
  seats: SeatType[];
  playerSeatId: number | null;
  isPlayerSeated: boolean;
  playerWatchedSeatId: number | null;
  playerStandingSpot: number;
  actionsRemaining: number;
  isGrabPhase: boolean;
  line: Line;
  currentStation?: number;
  transitionState?: TransitionState;
  playerClaimSuccess?: boolean;
  onAskDestination: (id: number) => void;
  onWatchSeat: (id: number) => void;
  onGrabSeat: (id: number) => void;
  /** Standing area component */
  standingArea: ReactNode;
  /** Status bar component */
  statusBar: ReactNode;
}

export function Compartment({
  seats,
  playerSeatId,
  isPlayerSeated,
  playerWatchedSeatId,
  playerStandingSpot,
  actionsRemaining,
  isGrabPhase,
  line,
  currentStation,
  transitionState,
  playerClaimSuccess = false,
  onAskDestination,
  onWatchSeat,
  onGrabSeat,
  standingArea,
  statusBar,
}: CompartmentProps) {
  // Arrange seats in 2 rows of 3 (facing benches)
  const topRowSeats = seats.slice(0, 3);
  const bottomRowSeats = seats.slice(3, 6);

  const isShaking = transitionState?.phase === "traveling";

  const renderSeatRow = (rowSeats: SeatType[]) => (
    <div className="grid grid-cols-3 gap-4 justify-items-center">
      {rowSeats.map((seat) => (
        <Seat
          key={seat.id}
          seat={seat}
          isPlayerSeat={seat.id === playerSeatId}
          isPlayerSeated={isPlayerSeated}
          isWatched={seat.id === playerWatchedSeatId}
          isAdjacent={isAdjacentToSeat(playerStandingSpot, seat.id)}
          actionsRemaining={actionsRemaining}
          isGrabPhase={isGrabPhase}
          line={line}
          transitionState={transitionState}
          playerClaimSuccess={playerClaimSuccess && seat.id === playerSeatId}
          onAskDestination={onAskDestination}
          onWatchSeat={onWatchSeat}
          onGrabSeat={onGrabSeat}
        />
      ))}
    </div>
  );

  return (
    <TrainCompartment
      currentStation={currentStation}
      isShaking={isShaking}
      topRow={<div data-testid="compartment">{renderSeatRow(topRowSeats)}</div>}
      standingArea={standingArea}
      bottomRow={renderSeatRow(bottomRowSeats)}
      statusBar={statusBar}
    />
  );
}
