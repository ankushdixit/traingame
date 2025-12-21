/**
 * TypeScript types for Mumbai Local Train Game
 */

/**
 * Game difficulty levels
 */
export type Difficulty = "easy" | "normal" | "rush";

/**
 * Configuration for each difficulty level
 */
export interface DifficultyConfig {
  name: Difficulty;
  displayName: string;
  seatedNpcRange: [number, number]; // [min, max]
  standingNpcRange: [number, number]; // For future Story 4.2
  npcClaimChance: number; // For future Story 4.2
}

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
