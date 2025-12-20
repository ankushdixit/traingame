/**
 * TypeScript types for Mumbai Local Train Game
 */

export interface StationSelection {
  boardingStation: number | null; // index in STATIONS array
  destination: number | null; // index in STATIONS array
}

/**
 * NPC (Non-Player Character) in the train compartment
 */
export interface NPC {
  id: string;
  destination: number; // station index where NPC exits
  destinationRevealed: boolean; // has player asked?
}

/**
 * A seat in the train compartment
 */
export interface Seat {
  id: number;
  occupant: NPC | null;
}

/**
 * Complete game state for a train ride
 */
export interface GameState {
  currentStation: number;
  playerBoardingStation: number;
  playerDestination: number;
  playerSeated: boolean;
  seatId: number | null;
  seats: Seat[];
  gameStatus: "playing" | "won" | "lost";
}
