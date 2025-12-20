/**
 * Seat component - displays an individual seat in the compartment
 */

import { Seat as SeatType } from "@/lib/types";

export type SeatDisplayState = "empty" | "occupied" | "occupied-known" | "player";

interface SeatProps {
  seat: SeatType;
  isPlayerSeat: boolean;
}

const seatStyles: Record<SeatDisplayState, string> = {
  empty: "bg-green-100 border-green-300",
  occupied: "bg-gray-200 border-gray-400",
  "occupied-known": "bg-blue-100 border-blue-300",
  player: "bg-yellow-200 border-yellow-500 ring-2 ring-yellow-400",
};

function getSeatDisplayState(seat: SeatType, isPlayerSeat: boolean): SeatDisplayState {
  if (isPlayerSeat) {
    return "player";
  }
  if (seat.occupant === null) {
    return "empty";
  }
  if (seat.occupant.destinationRevealed) {
    return "occupied-known";
  }
  return "occupied";
}

export function Seat({ seat, isPlayerSeat }: SeatProps) {
  const displayState = getSeatDisplayState(seat, isPlayerSeat);
  const style = seatStyles[displayState];

  return (
    <div
      className={`flex h-20 w-24 flex-col items-center justify-center rounded-lg border-2 ${style}`}
      data-testid={`seat-${seat.id}`}
      data-state={displayState}
    >
      {displayState === "empty" && <span className="text-sm text-green-700">Empty</span>}
      {displayState === "occupied" && <span className="text-sm text-gray-700">Passenger</span>}
      {displayState === "occupied-known" && (
        <span className="text-sm text-blue-700">Passenger</span>
      )}
      {displayState === "player" && <span className="text-sm font-bold text-yellow-700">You</span>}
    </div>
  );
}
