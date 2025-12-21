/**
 * Compartment component - displays the train compartment with themed styling
 * Seats arranged as facing benches with aisle between
 * Matches single-shot design with 3x2 grid layout
 * Layout: Top row -> Standing Area -> Bottom row -> Status Bar
 */

import { ReactNode } from "react";
import { Seat as SeatType } from "@/lib/types";
import { TransitionState } from "@/lib/useTransitionController";
import { Seat } from "./Seat";
import { TrainCompartment } from "./TrainCompartment";

interface CompartmentProps {
  seats: SeatType[];
  playerSeatId: number | null;
  isPlayerSeated: boolean;
  hoveredSeatId: number | null;
  currentStation?: number;
  transitionState?: TransitionState;
  playerClaimSuccess?: boolean;
  onRevealDestination: (id: number) => void;
  onClaimSeat: (id: number) => void;
  onHoverNear: (id: number) => void;
  /** Standing area component */
  standingArea: ReactNode;
  /** Status bar component */
  statusBar: ReactNode;
}

export function Compartment({
  seats,
  playerSeatId,
  isPlayerSeated,
  hoveredSeatId,
  currentStation,
  transitionState,
  playerClaimSuccess = false,
  onRevealDestination,
  onClaimSeat,
  onHoverNear,
  standingArea,
  statusBar,
}: CompartmentProps) {
  // Arrange seats in 2 rows of 3 (facing benches)
  const topRowSeats = seats.slice(0, 3);
  const bottomRowSeats = seats.slice(3, 6);

  const isShaking = transitionState?.phase === "shaking";

  const renderSeatRow = (rowSeats: SeatType[]) => (
    <div className="grid grid-cols-3 gap-4 justify-items-center">
      {rowSeats.map((seat) => (
        <Seat
          key={seat.id}
          seat={seat}
          isPlayerSeat={seat.id === playerSeatId}
          isPlayerSeated={isPlayerSeated}
          isHovered={seat.id === hoveredSeatId}
          transitionState={transitionState}
          playerClaimSuccess={playerClaimSuccess && seat.id === playerSeatId}
          onRevealDestination={onRevealDestination}
          onClaimSeat={onClaimSeat}
          onHoverNear={onHoverNear}
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
