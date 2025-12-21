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
  standingNpcRange: [number, number]; // Standing NPC count range
  npcClaimChance: number; // Probability that standing NPC claims empty seat
}

/**
 * Option for difficulty selector UI
 */
export interface DifficultyOption {
  value: Difficulty;
  label: string;
  description: string;
}

/**
 * Available difficulty options for the selector
 */
export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    value: "easy",
    label: "Easy",
    description: "Plenty of seats, few competitors",
  },
  {
    value: "normal",
    label: "Normal",
    description: "One seat, some competition",
  },
  {
    value: "rush",
    label: "Rush Hour",
    description: "No seats, fierce competition",
  },
];

/**
 * Standing NPC who competes with player for seats
 */
export interface StandingNPC {
  id: string;
  targetSeatId: number | null; // Seat they're watching (or null for random)
  claimPriority: number; // 0-1, used with difficulty's npcClaimChance
  characterSprite: number; // For future visual feature
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
  characterSprite: number; // Index into CHARACTERS array for visual representation
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
  standingNPCs: StandingNPC[];
  hoveredSeatId: number | null; // Seat player is "hovering near"
  difficulty: Difficulty;
  lastClaimMessage: string | null; // "A passenger grabbed the seat!" or null
}
