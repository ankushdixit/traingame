/**
 * Game constants for Mumbai Local Train Game
 */

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
