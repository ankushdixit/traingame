/**
 * Game logic functions for Mumbai Local Train Game
 *
 * New design:
 * - All 6 seats occupied at start
 * - Player has 2 actions per turn: Ask, Watch, Move
 * - NPCs also watch seats (hidden from player)
 * - Seats open through response time competition
 * - Win: Grab any seat (instant victory)
 * - Lose: Reach destination while standing
 */

import {
  TOTAL_SEATS,
  DIFFICULTY_CONFIGS,
  DEFAULT_DIFFICULTY,
  DEFAULT_LINE,
  getStations,
  BOARDING_STATIONS,
  ACTIONS_PER_TURN,
  isAdjacentToSeat,
  getAdjacentSeats,
  getPositionColumn,
} from "./constants";
import { GameState, NPC, Seat, Difficulty, StandingNPC, Line } from "./types";
import { CHARACTER_COUNT } from "@/components/game/characters";

/**
 * Result of station advance - identifies which seats opened
 */
export interface StationAdvanceResult {
  state: GameState;
  openedSeats: number[]; // Seats that just became empty (for grab competition)
  departingNpcIds: string[]; // NPCs who left (for animation)
}

/**
 * Advances the train to the next station.
 * NPCs whose destination is reached will exit, opening their seats.
 * Returns the opened seats for grab competition phase.
 *
 * @param state - Current game state
 * @returns Updated state with opened seats info
 */
export function advanceStation(state: GameState): StationAdvanceResult {
  const newStation = state.currentStation + 1;
  const stations = getStations(state.line);

  // Identify departing NPCs and their seats
  const openedSeats: number[] = [];
  const departingNpcIds: string[] = [];

  const updatedSeats = state.seats.map((seat) => {
    if (seat.occupant && seat.occupant.destination <= newStation) {
      departingNpcIds.push(seat.occupant.id);
      openedSeats.push(seat.id);
      return { ...seat, occupant: null };
    }
    return seat;
  });

  // Check for game loss (reached destination while standing)
  // Preserve existing won/lost status
  let newStatus: "playing" | "won" | "lost" = state.gameStatus;
  if (newStatus === "playing" && newStation >= state.playerDestination && !state.playerSeated) {
    newStatus = "lost";
  }

  // Update NPC watches randomly
  const updatedNPCs = updateNPCWatches(state.standingNPCs, state.difficulty);

  // Always try to process new boarders to maintain difficulty level
  // Higher chance at major boarding stations
  const stationName = stations[newStation];
  const isBoardingStation = BOARDING_STATIONS.has(stationName);

  const boardingResult = processNewStandingBoarders(
    updatedNPCs,
    state.playerStandingSpot,
    state.difficulty,
    isBoardingStation // Pass flag for increased boarding chance at major stations
  );
  const finalStandingNPCs = boardingResult.npcs;
  const boardingMessage = boardingResult.message;

  const newState: GameState = {
    ...state,
    currentStation: newStation,
    seats: updatedSeats,
    standingNPCs: finalStandingNPCs,
    gameStatus: newStatus,
    actionsRemaining: ACTIONS_PER_TURN, // Reset actions for new turn
    lastClaimMessage: null,
    lastBoardingMessage: boardingMessage,
  };

  return {
    state: newState,
    openedSeats,
    departingNpcIds,
  };
}

/**
 * Player grabs a seat during grab competition.
 * Results in instant win.
 *
 * @param state - Current game state
 * @param seatId - ID of the seat to claim
 * @returns Updated game state with player seated and game won
 */
export function playerGrabsSeat(state: GameState, seatId: number): GameState {
  return {
    ...state,
    playerSeated: true,
    seatId: seatId,
    gameStatus: "won",
    playerWatchedSeatId: null,
  };
}

/**
 * NPC grabs a seat during grab competition.
 * Also attempts to board new standing NPCs to maintain difficulty level.
 *
 * @param state - Current game state
 * @param npcId - ID of the NPC who grabs the seat
 * @param seatId - ID of the seat being grabbed
 * @returns Updated game state with NPC seated
 */
export function npcGrabsSeat(state: GameState, npcId: string, seatId: number): GameState {
  const stations = getStations(state.line);
  const npc = state.standingNPCs.find((n) => n.id === npcId);

  if (!npc) return state;

  // Create seated NPC with random destination
  const minDest = state.currentStation + 1;
  const maxDest = stations.length - 1;
  const destination = minDest + Math.floor(Math.random() * (maxDest - minDest + 1));

  const seatedNpc: NPC = {
    id: npc.id,
    destination,
    destinationRevealed: false,
    characterSprite: npc.characterSprite,
  };

  // Remove NPC from standing list
  const remainingNPCs = state.standingNPCs.filter((n) => n.id !== npcId);

  // Try to board new standing NPCs to maintain difficulty level
  const boardingResult = processNewStandingBoarders(
    remainingNPCs,
    state.playerStandingSpot,
    state.difficulty
  );

  // Remove from standing NPCs, add to seat, potentially add new boarders
  return {
    ...state,
    seats: state.seats.map((seat) =>
      seat.id === seatId ? { ...seat, occupant: seatedNpc } : seat
    ),
    standingNPCs: boardingResult.npcs,
    lastClaimMessage: "A passenger grabbed the seat!",
    lastBoardingMessage: boardingResult.message,
  };
}

/**
 * Fill any remaining empty seats with new NPCs.
 * This ensures no seats stay empty after grab phase.
 * Simulates the reality that someone always wants a seat on a Mumbai local.
 *
 * @param state - Current game state
 * @returns Updated game state with empty seats filled
 */
export function fillEmptySeats(state: GameState): GameState {
  const stations = getStations(state.line);
  const emptySeats = state.seats.filter((seat) => seat.occupant === null);

  if (emptySeats.length === 0) return state;

  // Fill each empty seat with a new NPC
  const updatedSeats = state.seats.map((seat) => {
    if (seat.occupant !== null) return seat;

    // Create a new NPC to fill this seat
    const minDest = state.currentStation + 1;
    const maxDest = stations.length - 1;
    const destination = minDest + Math.floor(Math.random() * (maxDest - minDest + 1));

    const newNpc: NPC = {
      id: `auto-fill-${seat.id}-${Date.now()}`,
      destination,
      destinationRevealed: false,
      characterSprite: Math.floor(Math.random() * CHARACTER_COUNT),
    };

    return { ...seat, occupant: newNpc };
  });

  const filledCount = emptySeats.length;
  const message =
    filledCount === 1
      ? "A passenger rushed in and took the empty seat!"
      : `${filledCount} passengers rushed in and took the empty seats!`;

  return {
    ...state,
    seats: updatedSeats,
    lastClaimMessage: message,
  };
}

// ==================== ACTION FUNCTIONS ====================

/**
 * Ask a seated NPC for their destination (costs 1 action).
 *
 * @param state - Current game state
 * @param seatId - ID of the seat to ask
 * @returns Updated game state with destination revealed and action used
 */
export function askDestination(state: GameState, seatId: number): GameState {
  if (state.actionsRemaining <= 0) return state;

  const seat = state.seats.find((s) => s.id === seatId);
  if (!seat?.occupant || seat.occupant.destinationRevealed) return state;

  return {
    ...state,
    seats: state.seats.map((s) =>
      s.id === seatId && s.occupant
        ? { ...s, occupant: { ...s.occupant, destinationRevealed: true } }
        : s
    ),
    actionsRemaining: state.actionsRemaining - 1,
  };
}

/**
 * Watch a seat for grab priority (costs 1 action).
 * Player can only watch seats adjacent to their position.
 * Replaces any existing watch.
 *
 * @param state - Current game state
 * @param seatId - ID of the seat to watch
 * @returns Updated game state with seat watched and action used
 */
export function watchSeat(state: GameState, seatId: number): GameState {
  if (state.actionsRemaining <= 0) return state;
  if (!isAdjacentToSeat(state.playerStandingSpot, seatId)) return state;
  if (state.playerWatchedSeatId === seatId) return state; // Already watching

  return {
    ...state,
    playerWatchedSeatId: seatId,
    actionsRemaining: state.actionsRemaining - 1,
  };
}

/**
 * Stop watching current seat (free action).
 *
 * @param state - Current game state
 * @returns Updated game state with watch cleared
 */
export function unwatchSeat(state: GameState): GameState {
  return {
    ...state,
    playerWatchedSeatId: null,
  };
}

/**
 * Maximum distance a player can move in one action.
 * Player can only move to spots within this distance.
 */
const MAX_MOVE_DISTANCE = 2;

/**
 * Move to a different standing position (costs 1 action).
 * If the target spot is occupied by an NPC, swap positions with them.
 * Auto-clears watch if moving to non-adjacent column.
 * Movement is limited to spots within MAX_MOVE_DISTANCE (2) of current position.
 *
 * @param state - Current game state
 * @param newSpot - New standing spot (0-5)
 * @returns Updated game state with new position and action used
 */
export function movePosition(state: GameState, newSpot: number): GameState {
  if (state.actionsRemaining <= 0) return state;
  if (newSpot < 0 || newSpot > 5) return state;
  if (newSpot === state.playerStandingSpot) return state;

  // Check distance constraint - can only move up to 2 spots
  const distance = Math.abs(newSpot - state.playerStandingSpot);
  if (distance > MAX_MOVE_DISTANCE) return state;

  // Check if watch should be cleared (moving to different column)
  const oldColumn = getPositionColumn(state.playerStandingSpot);
  const newColumn = getPositionColumn(newSpot);
  const clearWatch = oldColumn !== newColumn;

  // Check if spot is occupied by NPC - if so, swap positions
  const npcInSpot = state.standingNPCs.find((npc) => npc.standingSpot === newSpot);

  if (npcInSpot) {
    // Swap positions: player takes NPC's spot, NPC takes player's old spot
    const updatedNPCs = state.standingNPCs.map((npc) =>
      npc.id === npcInSpot.id ? { ...npc, standingSpot: state.playerStandingSpot } : npc
    );

    return {
      ...state,
      playerStandingSpot: newSpot,
      standingNPCs: updatedNPCs,
      playerWatchedSeatId: clearWatch ? null : state.playerWatchedSeatId,
      actionsRemaining: state.actionsRemaining - 1,
    };
  }

  // Empty spot - just move there
  return {
    ...state,
    playerStandingSpot: newSpot,
    playerWatchedSeatId: clearWatch ? null : state.playerWatchedSeatId,
    actionsRemaining: state.actionsRemaining - 1,
  };
}

/**
 * Reset actions for a new turn.
 *
 * @param state - Current game state
 * @returns Updated game state with actions reset
 */
export function resetTurnActions(state: GameState): GameState {
  return {
    ...state,
    actionsRemaining: ACTIONS_PER_TURN,
  };
}

// ==================== NPC LOGIC ====================

/**
 * Updates what seats NPCs are watching (random behavior).
 *
 * @param npcs - Current standing NPCs
 * @param difficulty - Game difficulty
 * @returns Updated NPCs with new watched seats
 */
export function updateNPCWatches(npcs: StandingNPC[], _difficulty: Difficulty): StandingNPC[] {
  return npcs.map((npc) => {
    // 50% chance to change watch each turn
    if (Math.random() > 0.5) {
      return npc;
    }

    // Get adjacent seats for this NPC's position
    const adjacentSeats = getAdjacentSeats(npc.standingSpot);

    // 70% chance to watch an adjacent seat, 30% chance to not watch
    if (Math.random() < 0.7 && adjacentSeats.length > 0) {
      const randomSeat = adjacentSeats[Math.floor(Math.random() * adjacentSeats.length)];
      return { ...npc, watchedSeatId: randomSeat };
    } else {
      return { ...npc, watchedSeatId: null };
    }
  });
}

/**
 * Generates standing NPCs based on difficulty configuration.
 * Each NPC is assigned a unique standing spot, a watched seat, and response time.
 *
 * @param difficulty - Game difficulty level
 * @param reservedSpots - Array of spots already taken (e.g., by player)
 * @returns Array of standing NPCs with assigned properties
 */
export function generateStandingNPCs(
  difficulty: Difficulty,
  reservedSpots: number[] = []
): StandingNPC[] {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const [minNpcs, maxNpcs] = config.standingNpcRange;
  const npcCount = minNpcs + Math.floor(Math.random() * (maxNpcs - minNpcs + 1));

  // Get available spots (0-5, excluding reserved ones)
  const availableSpots = [0, 1, 2, 3, 4, 5].filter((s) => !reservedSpots.includes(s));
  const shuffledSpots = availableSpots.sort(() => Math.random() - 0.5);

  const { min: minTime, max: maxTime } = config.npcResponseTime;

  return Array.from({ length: Math.min(npcCount, shuffledSpots.length) }, (_, i) => {
    const standingSpot = shuffledSpots[i];
    const adjacentSeats = getAdjacentSeats(standingSpot);

    // 60% chance to start watching an adjacent seat
    const watchedSeatId =
      Math.random() < 0.6 && adjacentSeats.length > 0
        ? adjacentSeats[Math.floor(Math.random() * adjacentSeats.length)]
        : null;

    // Random response time within difficulty range
    const responseTimeBase = minTime + Math.floor(Math.random() * (maxTime - minTime + 1));

    return {
      id: `standing-npc-${i}`,
      watchedSeatId,
      responseTimeBase,
      characterSprite: Math.floor(Math.random() * CHARACTER_COUNT),
      standingSpot,
    };
  });
}

/**
 * Process new standing passengers boarding at stations.
 * Always tries to maintain the target NPC count for the difficulty.
 *
 * @param currentNPCs - Current standing NPCs
 * @param playerSpot - Player's standing spot
 * @param difficulty - Game difficulty
 * @param isBoardingStation - Whether this is a major boarding station (higher chance)
 * @returns Updated NPCs and boarding message
 */
// eslint-disable-next-line complexity
function processNewStandingBoarders(
  currentNPCs: StandingNPC[],
  playerSpot: number,
  difficulty: Difficulty,
  isBoardingStation: boolean = false
): { npcs: StandingNPC[]; message: string | null } {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const targetCount = config.standingNpcRange[1]; // Max NPCs for this difficulty
  const minCount = config.standingNpcRange[0]; // Min NPCs for this difficulty

  // If we have fewer NPCs than target, try to add more
  const deficit = targetCount - currentNPCs.length;
  if (deficit <= 0) return { npcs: currentNPCs, message: null };

  // Determine boarding chance:
  // - Always board if below minimum
  // - Higher chance at boarding stations
  // - Otherwise use config probability
  const belowMinimum = currentNPCs.length < minCount;
  const boardingChance = isBoardingStation
    ? Math.min(config.boardingConfig.boardingChance + 0.3, 1.0)
    : config.boardingConfig.boardingChance;

  if (!belowMinimum && Math.random() > boardingChance) {
    return { npcs: currentNPCs, message: null };
  }

  // Find available spots
  const occupiedSpots = [playerSpot, ...currentNPCs.map((n) => n.standingSpot)];
  const availableSpots = [0, 1, 2, 3, 4, 5].filter((s) => !occupiedSpots.includes(s));

  if (availableSpots.length === 0) return { npcs: currentNPCs, message: null };

  // Add more NPCs if below minimum, otherwise 1-2
  const numToAdd = belowMinimum
    ? Math.min(minCount - currentNPCs.length, availableSpots.length)
    : Math.min(Math.floor(Math.random() * 2) + 1, deficit, availableSpots.length);

  if (numToAdd <= 0) return { npcs: currentNPCs, message: null };

  const { min: minTime, max: maxTime } = config.npcResponseTime;
  const newNPCs: StandingNPC[] = [];

  // Shuffle available spots for variety
  const shuffledSpots = availableSpots.sort(() => Math.random() - 0.5);

  for (let i = 0; i < numToAdd; i++) {
    const spot = shuffledSpots[i];
    const adjacentSeats = getAdjacentSeats(spot);

    newNPCs.push({
      id: `standing-npc-boarded-${Date.now()}-${i}`,
      watchedSeatId:
        Math.random() < 0.6 && adjacentSeats.length > 0
          ? adjacentSeats[Math.floor(Math.random() * adjacentSeats.length)]
          : null,
      responseTimeBase: minTime + Math.floor(Math.random() * (maxTime - minTime + 1)),
      characterSprite: Math.floor(Math.random() * CHARACTER_COUNT),
      standingSpot: spot,
    });
  }

  return {
    npcs: [...currentNPCs, ...newNPCs],
    message: `${numToAdd} passenger${numToAdd > 1 ? "s" : ""} joined the queue!`,
  };
}

// ==================== INITIALIZATION ====================

/**
 * Generates the initial game state when a game begins.
 * All 6 seats are occupied, with guaranteed early departures.
 *
 * @param boardingStation - Index of the station where the player boards
 * @param destination - Index of the player's destination station
 * @param difficulty - Game difficulty level (defaults to 'normal')
 * @param line - Journey length (defaults to 'short')
 * @returns A complete GameState object with NPCs placed in seats
 */
export function generateInitialState(
  boardingStation: number,
  destination: number,
  difficulty: Difficulty = DEFAULT_DIFFICULTY,
  line: Line = DEFAULT_LINE
): GameState {
  const stations = getStations(line);

  // Create 6 seats, all will be occupied
  const seats: Seat[] = Array.from({ length: TOTAL_SEATS }, (_, i) => ({
    id: i,
    occupant: null,
  }));

  // Shuffle character indices for variety
  const characterIndices = Array.from({ length: CHARACTER_COUNT }, (_, i) => i);
  const shuffledCharacters = characterIndices.sort(() => Math.random() - 0.5);

  // Generate NPC destinations with guaranteed early exits
  const npcDestinations = generateGuaranteedDestinations(
    boardingStation,
    destination,
    stations.length,
    TOTAL_SEATS
  );

  // Create NPCs for all 6 seats
  for (let i = 0; i < TOTAL_SEATS; i++) {
    const npc: NPC = {
      id: `npc-${i}`,
      destination: npcDestinations[i],
      destinationRevealed: false,
      characterSprite: shuffledCharacters[i % CHARACTER_COUNT],
    };
    seats[i].occupant = npc;
  }

  // Assign player a random standing spot
  const playerStandingSpot = Math.floor(Math.random() * 6);

  // Generate standing NPCs (avoiding player's spot)
  const standingNPCs = generateStandingNPCs(difficulty, [playerStandingSpot]);

  return {
    currentStation: boardingStation,
    playerBoardingStation: boardingStation,
    playerDestination: destination,
    playerSeated: false,
    seatId: null,
    playerStandingSpot,
    seats,
    gameStatus: "playing",
    standingNPCs,
    playerWatchedSeatId: null,
    actionsRemaining: ACTIONS_PER_TURN,
    difficulty,
    line,
    lastClaimMessage: null,
    lastBoardingMessage: null,
  };
}

/**
 * Generates NPC destinations with guaranteed early exits.
 * Ensures at least 2 NPCs exit before player's destination.
 * One in first third of journey, one in middle third.
 *
 * @param boardingStation - Player's boarding station
 * @param playerDestination - Player's destination
 * @param totalStations - Total stations in the line
 * @param npcCount - Number of NPCs (always 6)
 * @returns Array of destination indices for NPCs
 */
function generateGuaranteedDestinations(
  boardingStation: number,
  playerDestination: number,
  totalStations: number,
  npcCount: number
): number[] {
  const journeyLength = playerDestination - boardingStation;
  const destinations: number[] = [];

  // Calculate thirds of the journey
  const firstThirdEnd = boardingStation + Math.ceil(journeyLength / 3);
  const middleThirdEnd = boardingStation + Math.ceil((2 * journeyLength) / 3);

  // Guaranteed early exit (first third)
  const earlyExit =
    boardingStation +
    1 +
    Math.floor(Math.random() * Math.max(1, firstThirdEnd - boardingStation - 1));
  destinations.push(Math.min(earlyExit, playerDestination - 1));

  // Guaranteed middle exit (middle third)
  const middleExit =
    firstThirdEnd + Math.floor(Math.random() * Math.max(1, middleThirdEnd - firstThirdEnd));
  destinations.push(Math.min(middleExit, playerDestination - 1));

  // Remaining NPCs get random destinations (can be before or at destination)
  const minDest = boardingStation + 1;
  const maxDest = totalStations - 1;

  for (let i = 2; i < npcCount; i++) {
    // Bias towards later destinations to maintain challenge
    const dest = minDest + Math.floor(Math.random() * (maxDest - minDest + 1));
    destinations.push(dest);
  }

  // Shuffle so guaranteed exits aren't always in seats 0 and 1
  return destinations.sort(() => Math.random() - 0.5);
}

// ==================== LEGACY FUNCTIONS (for backwards compatibility during transition) ====================

/**
 * @deprecated Use askDestination instead
 */
export function revealDestination(state: GameState, seatId: number): GameState {
  return askDestination(state, seatId);
}

/**
 * @deprecated Use watchSeat instead
 */
export function setHoveredSeat(state: GameState, seatId: number | null): GameState {
  if (seatId === null) {
    return unwatchSeat(state);
  }
  // Note: This doesn't cost an action for backwards compatibility
  return {
    ...state,
    playerWatchedSeatId: seatId,
  };
}

/**
 * @deprecated Use playerGrabsSeat instead
 */
export function claimSeat(state: GameState, seatId: number): GameState {
  return playerGrabsSeat(state, seatId);
}

/**
 * @deprecated No longer used - grab competition replaces this
 */
export function previewStationAdvance(state: GameState): {
  departingNpcIds: string[];
  claimingNpcId: string | null;
  claimedSeatId: number | null;
} {
  const newStation = state.currentStation + 1;
  const departingNpcIds: string[] = [];

  state.seats.forEach((seat) => {
    if (seat.occupant && seat.occupant.destination <= newStation) {
      departingNpcIds.push(seat.occupant.id);
    }
  });

  return {
    departingNpcIds,
    claimingNpcId: null,
    claimedSeatId: null,
  };
}
