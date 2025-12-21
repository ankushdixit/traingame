/**
 * Compartment component - displays the train compartment with themed styling
 * Seats arranged as facing benches with standing area in between
 */

import { Seat as SeatType } from "@/lib/types";
import { Seat } from "./Seat";
import { TrainCompartment } from "./TrainCompartment";

interface CompartmentProps {
  seats: SeatType[];
  playerSeatId: number | null;
  isPlayerSeated: boolean;
  hoveredSeatId: number | null;
  currentStation?: number;
  onRevealDestination: (id: number) => void;
  onClaimSeat: (id: number) => void;
  onHoverNear: (id: number) => void;
}

export function Compartment({
  seats,
  playerSeatId,
  isPlayerSeated,
  hoveredSeatId,
  currentStation,
  onRevealDestination,
  onClaimSeat,
  onHoverNear,
}: CompartmentProps) {
  // Arrange seats in 2 rows of 3 (facing benches)
  const topRow = seats.slice(0, 3);
  const bottomRow = seats.slice(3, 6);

  return (
    <TrainCompartment currentStation={currentStation}>
      <div className="flex flex-col gap-6" data-testid="compartment">
        {/* Top row - facing down (toward aisle) */}
        <div className="flex justify-center gap-3">
          {topRow.map((seat) => (
            <Seat
              key={seat.id}
              seat={seat}
              isPlayerSeat={seat.id === playerSeatId}
              isPlayerSeated={isPlayerSeated}
              isHovered={seat.id === hoveredSeatId}
              onRevealDestination={onRevealDestination}
              onClaimSeat={onClaimSeat}
              onHoverNear={onHoverNear}
            />
          ))}
        </div>

        {/* Standing area / aisle between seat rows */}
        <div
          className="flex h-12 items-center justify-center rounded bg-train-floor/20"
          data-testid="aisle"
        >
          <span className="text-sm text-train-metallic-dark">~ Aisle ~</span>
        </div>

        {/* Bottom row - facing up (toward aisle) */}
        <div className="flex justify-center gap-3">
          {bottomRow.map((seat) => (
            <Seat
              key={seat.id}
              seat={seat}
              isPlayerSeat={seat.id === playerSeatId}
              isPlayerSeated={isPlayerSeated}
              isHovered={seat.id === hoveredSeatId}
              onRevealDestination={onRevealDestination}
              onClaimSeat={onClaimSeat}
              onHoverNear={onHoverNear}
            />
          ))}
        </div>
      </div>
    </TrainCompartment>
  );
}
