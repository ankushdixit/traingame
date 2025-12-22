/**
 * Game constants for Mumbai Local Train Game
 */

import { Difficulty, DifficultyConfig, Line } from "./types";

export type { Line } from "./types";

/**
 * Short line stations (Churchgate to Dadar)
 */
export const STATIONS_SHORT = [
  "Churchgate",
  "Marine Lines",
  "Charni Road",
  "Grant Road",
  "Mumbai Central",
  "Dadar",
] as const;

/**
 * Full line stations (Churchgate to Borivali)
 */
export const STATIONS_FULL = [
  "Churchgate",
  "Marine Lines",
  "Charni Road",
  "Grant Road",
  "Mumbai Central",
  "Dadar",
  "Matunga Road",
  "Mahim",
  "Bandra",
  "Khar Road",
  "Santacruz",
  "Vile Parle",
  "Andheri",
  "Jogeshwari",
  "Borivali",
] as const;

/**
 * Default stations array for backwards compatibility
 */
export const STATIONS = STATIONS_SHORT;

export type StationName = (typeof STATIONS_SHORT)[number] | (typeof STATIONS_FULL)[number];

/**
 * Get stations array based on selected line
 */
export function getStations(line: Line): readonly string[] {
  return line === "full" ? STATIONS_FULL : STATIONS_SHORT;
}

/**
 * Default line selection
 */
export const DEFAULT_LINE: Line = "short";

/**
 * Get valid destination options based on boarding station index and line.
 * Destinations must be after the boarding station.
 */
export function getDestinationOptions(boardingIndex: number, line: Line = "short"): number[] {
  const stations = getStations(line);
  return stations.map((_, i) => i).filter((i) => i > boardingIndex);
}

/**
 * Major stations where passengers commonly board (Full Line only)
 */
export const BOARDING_STATIONS = new Set(["Dadar", "Bandra", "Andheri"]);

/**
 * Game configuration constants
 */
export const TOTAL_SEATS = 6;

/**
 * Difficulty configurations for the game
 * All difficulties now start with all 6 seats occupied
 */
export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    name: "easy",
    displayName: "Easy",
    seatedNpcRange: [6, 6], // All seats full
    standingNpcRange: [2, 3],
    npcResponseTime: { min: 300, max: 600 },
    boardingConfig: { minBoard: 0, maxBoard: 1, boardingChance: 0.3 },
  },
  normal: {
    name: "normal",
    displayName: "Normal",
    seatedNpcRange: [6, 6], // All seats full
    standingNpcRange: [3, 4],
    npcResponseTime: { min: 250, max: 550 },
    boardingConfig: { minBoard: 1, maxBoard: 2, boardingChance: 0.5 },
  },
  rush: {
    name: "rush",
    displayName: "Rush Hour",
    seatedNpcRange: [6, 6], // All seats full
    standingNpcRange: [5, 6],
    npcResponseTime: { min: 200, max: 500 },
    boardingConfig: { minBoard: 1, maxBoard: 3, boardingChance: 0.7 },
  },
};

export const DEFAULT_DIFFICULTY: Difficulty = "normal";

/**
 * Position adjacency map - which seats each standing spot is adjacent to
 * Standing spots layout (left to right): 0, 1, 2, 3, 4, 5
 * Seats above: #1(0), #2(1), #3(2)
 * Seats below: #4(3), #5(4), #6(5)
 *
 * Spots 0,1 (leftmost) → adjacent to seats 0,3 (#1, #4)
 * Spots 2,3 (center) → adjacent to seats 1,4 (#2, #5)
 * Spots 4,5 (rightmost) → adjacent to seats 2,5 (#3, #6)
 */
export const POSITION_ADJACENCY: Record<number, number[]> = {
  0: [0, 3], // Leftmost → seats #1, #4
  1: [0, 3], // Leftmost → seats #1, #4
  2: [1, 4], // Center → seats #2, #5
  3: [1, 4], // Center → seats #2, #5
  4: [2, 5], // Rightmost → seats #3, #6
  5: [2, 5], // Rightmost → seats #3, #6
};

/**
 * Get the column (0-2) for a standing position
 * Spots 0,1 → column 0 (left)
 * Spots 2,3 → column 1 (center)
 * Spots 4,5 → column 2 (right)
 */
export function getPositionColumn(position: number): number {
  return Math.floor(position / 2);
}

/**
 * Check if a standing position is adjacent to a seat
 */
export function isAdjacentToSeat(position: number, seatId: number): boolean {
  return POSITION_ADJACENCY[position]?.includes(seatId) ?? false;
}

/**
 * Get all seats adjacent to a standing position
 */
export function getAdjacentSeats(position: number): number[] {
  return POSITION_ADJACENCY[position] ?? [];
}

/**
 * Timing constants for grab competition
 */
export const GRAB_WINDOW_MS = 2000; // Total time window to grab a seat
export const WATCHING_BONUS_MS = 100; // Time advantage for watching a seat
export const ADJACENT_BONUS_MS = 50; // Time advantage for being adjacent
export const NON_ADJACENT_PENALTY_MS = 250; // Time penalty for not being adjacent

/**
 * Action system constants
 */
export const ACTIONS_PER_TURN = 2;
