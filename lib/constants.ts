/**
 * Game constants for Mumbai Local Train Game
 */

import { Difficulty, DifficultyConfig } from "./types";

export const STATIONS = [
  "Churchgate",
  "Marine Lines",
  "Charni Road",
  "Grant Road",
  "Mumbai Central",
  "Dadar",
] as const;

export type StationName = (typeof STATIONS)[number];

/**
 * Get valid destination options based on boarding station index.
 * Destinations must be after the boarding station.
 */
export function getDestinationOptions(boardingIndex: number): number[] {
  return STATIONS.map((_, i) => i).filter((i) => i > boardingIndex);
}

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
  },
  normal: {
    name: "normal",
    displayName: "Normal",
    seatedNpcRange: [5, 5],
    standingNpcRange: [1, 2],
    npcClaimChance: 0.5,
  },
  rush: {
    name: "rush",
    displayName: "Rush Hour",
    seatedNpcRange: [6, 6],
    standingNpcRange: [2, 3],
    npcClaimChance: 0.8,
  },
};

export const DEFAULT_DIFFICULTY: Difficulty = "normal";
