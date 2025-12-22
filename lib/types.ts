/**
 * TypeScript types for Mumbai Local Train Game
 */

/**
 * Game difficulty levels
 */
export type Difficulty = "easy" | "normal" | "rush";

/**
 * Line type for journey length selection
 */
export type Line = "short" | "full";

/**
 * Configuration for NPC boarding at intermediate stations
 */
export interface BoardingConfig {
  minBoard: number;
  maxBoard: number;
  boardingChance: number;
}

/**
 * Response time configuration for NPCs
 */
export interface ResponseTimeConfig {
  min: number; // Minimum response time in ms
  max: number; // Maximum response time in ms
}

/**
 * Configuration for each difficulty level
 */
export interface DifficultyConfig {
  name: Difficulty;
  displayName: string;
  seatedNpcRange: [number, number]; // [min, max] - always [6, 6] in new design
  standingNpcRange: [number, number]; // Standing NPC count range
  npcResponseTime: ResponseTimeConfig; // NPC response time range for grab competition
  boardingConfig: BoardingConfig; // Configuration for intermediate station boarding
}

/**
 * Option for difficulty selector UI
 */
export interface DifficultyOption {
  value: Difficulty;
  label: string;
  description: string;
  emoji: string;
}

/**
 * Available difficulty options for the selector
 */
export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    value: "easy",
    label: "Easy",
    description: "2-3 competitors, slower reactions",
    emoji: "😌",
  },
  {
    value: "normal",
    label: "Normal",
    description: "3-4 competitors, moderate speed",
    emoji: "😤",
  },
  {
    value: "rush",
    label: "Rush Hour",
    description: "5-6 competitors, lightning fast!",
    emoji: "🔥",
  },
];

/**
 * Standing NPC who competes with player for seats
 */
export interface StandingNPC {
  id: string;
  watchedSeatId: number | null; // Seat they're watching (hidden from player)
  responseTimeBase: number; // Base response time in ms (calculated from difficulty range)
  characterSprite: number; // Visual representation index
  standingSpot: number; // Position in the aisle (0-5)
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
  playerStandingSpot: number; // Player's position in the aisle (0-5) when standing
  seats: Seat[];
  gameStatus: "playing" | "won" | "lost";
  standingNPCs: StandingNPC[];
  playerWatchedSeatId: number | null; // Seat player is watching (must be adjacent)
  actionsRemaining: number; // Actions left this turn (max 2)
  difficulty: Difficulty;
  line: Line; // Journey length (short or full)
  lastClaimMessage: string | null; // Message when NPC grabs seat
  lastBoardingMessage: string | null; // Message when passengers board at intermediate stations
}
