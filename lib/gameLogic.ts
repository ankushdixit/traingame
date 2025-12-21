/**
 * Game logic functions for Mumbai Local Train Game
 */

import { TOTAL_SEATS, STATIONS, DIFFICULTY_CONFIGS, DEFAULT_DIFFICULTY } from "./constants";
import { GameState, NPC, Seat, Difficulty, StandingNPC } from "./types";

/**
 * Advances the train to the next station.
 * Removes NPCs whose destination is the new station or earlier.
 * Standing NPCs compete for newly empty seats.
 * Checks for game end conditions.
 *
 * @param state - Current game state
 * @returns Updated game state with new station, departed NPCs removed, and game status updated
 */
export function advanceStation(state: GameState): GameState {
  const newStation = state.currentStation + 1;

  // Identify seats that will become empty and remove departing NPCs
  const newlyEmptySeats: number[] = [];
  const updatedSeats = state.seats.map((seat) => {
    if (seat.occupant && seat.occupant.destination <= newStation) {
      newlyEmptySeats.push(seat.id);
      return { ...seat, occupant: null };
    }
    return seat;
  });

  // Process standing NPC claims for newly empty seats
  const claimResult = processStandingNPCClaims(
    {
      ...state,
      seats: updatedSeats,
      currentStation: newStation,
    },
    newlyEmptySeats
  );

  // Check for game end
  let newStatus: "playing" | "won" | "lost" = "playing";
  if (newStation >= state.playerDestination) {
    newStatus = state.playerSeated ? "won" : "lost";
  }

  return {
    ...claimResult,
    gameStatus: newStatus,
    // Reset hovered seat after station advance
    hoveredSeatId: null,
  };
}

/**
 * Processes standing NPC claims for newly empty seats.
 * Player has priority if hovering near a seat.
 *
 * @param state - Current game state (with updated seats and station)
 * @param newlyEmptySeats - Array of seat IDs that just became empty
 * @returns Updated game state after claim processing
 */
export function processStandingNPCClaims(state: GameState, newlyEmptySeats: number[]): GameState {
  const config = DIFFICULTY_CONFIGS[state.difficulty];
  let updatedState: GameState = { ...state, lastClaimMessage: null };

  for (const seatId of newlyEmptySeats) {
    // Player has priority if hovering near this seat
    if (state.hoveredSeatId === seatId) {
      continue; // Skip NPC claims for this seat
    }

    // Check if any standing NPC claims this seat
    const claimRoll = Math.random();
    if (claimRoll < config.npcClaimChance && updatedState.standingNPCs.length > 0) {
      const claimingNpc = updatedState.standingNPCs[0];

      // Generate destination for the claiming NPC
      const minDest = state.currentStation + 1;
      const maxDest = STATIONS.length - 1;
      const npcDestination = minDest + Math.floor(Math.random() * (maxDest - minDest + 1));

      // Create seated NPC from standing NPC
      const seatedNpc: NPC = {
        id: claimingNpc.id,
        destination: npcDestination,
        destinationRevealed: false,
      };

      updatedState = {
        ...updatedState,
        seats: updatedState.seats.map((seat) =>
          seat.id === seatId ? { ...seat, occupant: seatedNpc } : seat
        ),
        standingNPCs: updatedState.standingNPCs.slice(1),
        lastClaimMessage: "A passenger grabbed the seat!",
      };
      break; // Only one NPC claims per transition
    }
  }

  return updatedState;
}

/**
 * Claims an empty seat for the player.
 *
 * @param state - Current game state
 * @param seatId - ID of the seat to claim
 * @returns Updated game state with player seated
 */
export function claimSeat(state: GameState, seatId: number): GameState {
  return {
    ...state,
    playerSeated: true,
    seatId: seatId,
    hoveredSeatId: null, // Clear hover when claiming
  };
}

/**
 * Sets the seat the player is "hovering near" to gain priority.
 *
 * @param state - Current game state
 * @param seatId - ID of the seat to hover near (or null to clear)
 * @returns Updated game state with hovered seat
 */
export function setHoveredSeat(state: GameState, seatId: number | null): GameState {
  return {
    ...state,
    hoveredSeatId: seatId,
  };
}

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
 * Generates standing NPCs based on difficulty configuration.
 *
 * @param difficulty - Game difficulty level
 * @returns Array of standing NPCs
 */
export function generateStandingNPCs(difficulty: Difficulty): StandingNPC[] {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const [minNpcs, maxNpcs] = config.standingNpcRange;
  const npcCount = minNpcs + Math.floor(Math.random() * (maxNpcs - minNpcs + 1));

  return Array.from({ length: npcCount }, (_, i) => ({
    id: `standing-npc-${i}`,
    targetSeatId: null,
    claimPriority: Math.random(),
    characterSprite: Math.floor(Math.random() * 4), // 4 sprite options for future use
  }));
}

/**
 * Generates the initial game state when a game begins.
 *
 * @param boardingStation - Index of the station where the player boards
 * @param destination - Index of the player's destination station
 * @param difficulty - Game difficulty level (defaults to 'normal')
 * @returns A complete GameState object with NPCs placed in seats
 */
export function generateInitialState(
  boardingStation: number,
  destination: number,
  difficulty: Difficulty = DEFAULT_DIFFICULTY
): GameState {
  // 1. Determine NPC count based on difficulty
  const config = DIFFICULTY_CONFIGS[difficulty];
  const [minNpcs, maxNpcs] = config.seatedNpcRange;
  const npcCount = minNpcs + Math.floor(Math.random() * (maxNpcs - minNpcs + 1));

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

  // 5. Generate standing NPCs
  const standingNPCs = generateStandingNPCs(difficulty);

  // 6. Return complete state
  return {
    currentStation: boardingStation,
    playerBoardingStation: boardingStation,
    playerDestination: destination,
    playerSeated: false,
    seatId: null,
    seats,
    gameStatus: "playing",
    standingNPCs,
    hoveredSeatId: null,
    difficulty,
    lastClaimMessage: null,
  };
}
