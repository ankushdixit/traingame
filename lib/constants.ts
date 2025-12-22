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
 */
export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    name: "easy",
    displayName: "Easy",
    seatedNpcRange: [3, 4],
    standingNpcRange: [0, 0],
    npcClaimChance: 0.2,
    boardingConfig: { minBoard: 0, maxBoard: 1, boardingChance: 0.3 },
  },
  normal: {
    name: "normal",
    displayName: "Normal",
    seatedNpcRange: [5, 5],
    standingNpcRange: [1, 2],
    npcClaimChance: 0.5,
    boardingConfig: { minBoard: 1, maxBoard: 2, boardingChance: 0.5 },
  },
  rush: {
    name: "rush",
    displayName: "Rush Hour",
    seatedNpcRange: [6, 6],
    standingNpcRange: [2, 3],
    npcClaimChance: 0.8,
    boardingConfig: { minBoard: 1, maxBoard: 3, boardingChance: 0.7 },
  },
};

export const DEFAULT_DIFFICULTY: Difficulty = "normal";
