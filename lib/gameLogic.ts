/**
 * Game logic functions for Mumbai Local Train Game
 */

import { TOTAL_SEATS, MIN_NPCS, MAX_NPCS, STATIONS } from "./constants";
import { GameState, NPC, Seat } from "./types";

/**
 * Reveals an NPC's destination on a given seat.
 *
 * @param state - Current game state
 * @param seatId - ID of the seat whose occupant's destination should be revealed
 * @returns Updated game state with the NPC's destination revealed
 */
export function revealDestination(state: GameState, seatId: number): GameState {
  return {
    ...state,
    seats: state.seats.map((seat) =>
      seat.id === seatId && seat.occupant
        ? { ...seat, occupant: { ...seat.occupant, destinationRevealed: true } }
        : seat
    ),
  };
}

/**
 * Generates the initial game state when a game begins.
 *
 * @param boardingStation - Index of the station where the player boards
 * @param destination - Index of the player's destination station
 * @returns A complete GameState object with NPCs placed in seats
 */
export function generateInitialState(boardingStation: number, destination: number): GameState {
  // 1. Determine NPC count (3 or 4)
  const npcCount = Math.random() < 0.5 ? MIN_NPCS : MAX_NPCS;

  // 2. Create 6 empty seats
  const seats: Seat[] = Array.from({ length: TOTAL_SEATS }, (_, i) => ({
    id: i,
    occupant: null,
  }));

  // 3. Randomly select seats for NPCs
  const seatIndices = Array.from({ length: TOTAL_SEATS }, (_, i) => i);
  const shuffledIndices = seatIndices.sort(() => Math.random() - 0.5);
  const npcSeatIndices = shuffledIndices.slice(0, npcCount);

  // 4. Generate NPCs with destinations
  const minDest = boardingStation + 1;
  const maxDest = STATIONS.length - 1; // Dadar (final station)

  npcSeatIndices.forEach((seatIndex, i) => {
    const npcDestination = minDest + Math.floor(Math.random() * (maxDest - minDest + 1));

    const npc: NPC = {
      id: `npc-${i}`,
      destination: npcDestination,
      destinationRevealed: false,
    };

    seats[seatIndex].occupant = npc;
  });

  // 5. Return complete state
  return {
    currentStation: boardingStation,
    playerBoardingStation: boardingStation,
    playerDestination: destination,
    playerSeated: false,
    seatId: null,
    seats,
    gameStatus: "playing",
  };
}
