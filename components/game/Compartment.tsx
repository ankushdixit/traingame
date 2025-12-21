/**
 * Compartment component - displays the 2x3 seat grid
 */

import { Seat as SeatType } from "@/lib/types";
import { Seat } from "./Seat";

interface CompartmentProps {
  seats: SeatType[];
  playerSeatId: number | null;
  isPlayerSeated: boolean;
  hoveredSeatId: number | null;
  onRevealDestination: (id: number) => void;
  onClaimSeat: (id: number) => void;
  onHoverNear: (id: number) => void;
}

export function Compartment({
  seats,
  playerSeatId,
  isPlayerSeated,
  hoveredSeatId,
  onRevealDestination,
  onClaimSeat,
  onHoverNear,
}: CompartmentProps) {
  // Arrange seats in 2 rows of 3
  const topRow = seats.slice(0, 3);
  const bottomRow = seats.slice(3, 6);

  return (
    <div className="flex flex-col gap-4" data-testid="compartment">
      <div className="flex justify-center gap-4">
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
      <div className="flex justify-center gap-4">
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
  );
}
