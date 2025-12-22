/**
 * Grab competition logic - determines who wins a seat during grab phase
 *
 * Timing bonuses:
 * - Watching the seat: -300ms (head start)
 * - Adjacent to seat: -150ms (closer)
 * - Not adjacent: +150ms (farther away)
 */

import { StandingNPC } from "./types";
import {
  WATCHING_BONUS_MS,
  ADJACENT_BONUS_MS,
  NON_ADJACENT_PENALTY_MS,
  isAdjacentToSeat,
} from "./constants";

export interface GrabCompetitor {
  id: string;
  isPlayer: boolean;
  baseResponseTime: number;
  isWatching: boolean;
  isAdjacent: boolean;
}

export interface GrabResult {
  winnerId: string;
  isPlayerWinner: boolean;
  seatId: number;
  playerEffectiveTime: number | null; // null if player didn't attempt
  npcTimes: { id: string; effectiveTime: number }[];
}

/**
 * Calculate effective grab time with bonuses/penalties
 */
export function calculateEffectiveTime(
  baseTime: number,
  isWatching: boolean,
  isAdjacent: boolean
): number {
  let time = baseTime;

  // Watching bonus (head start)
  if (isWatching) {
    time -= WATCHING_BONUS_MS;
  }

  // Position bonus/penalty
  if (isAdjacent) {
    time -= ADJACENT_BONUS_MS;
  } else {
    time += NON_ADJACENT_PENALTY_MS;
  }

  // Minimum time is 50ms (can't be instant)
  return Math.max(50, time);
}

/**
 * Get all NPCs that can compete for a specific seat
 * ALL standing NPCs can compete (not just adjacent ones)
 */
export function getCompetingNPCs(standingNPCs: StandingNPC[]): StandingNPC[] {
  return standingNPCs;
}

/**
 * Calculate NPC effective times for a seat grab competition
 * All NPCs compete, but non-adjacent ones have a penalty
 */
export function calculateNPCTimes(
  seatId: number,
  standingNPCs: StandingNPC[]
): { id: string; effectiveTime: number }[] {
  return standingNPCs.map((npc) => {
    const isWatching = npc.watchedSeatId === seatId;
    const isAdjacent = isAdjacentToSeat(npc.standingSpot, seatId);
    const effectiveTime = calculateEffectiveTime(npc.responseTimeBase, isWatching, isAdjacent);

    return {
      id: npc.id,
      effectiveTime,
    };
  });
}

/**
 * Resolve a grab competition and determine the winner
 *
 * @param seatId - The seat being grabbed
 * @param playerTapTime - Time in ms when player tapped (null if didn't tap)
 * @param playerPosition - Player's standing spot
 * @param playerWatchedSeatId - Seat player was watching (null if none)
 * @param standingNPCs - All standing NPCs
 * @returns GrabResult with winner information
 */
export function resolveGrabCompetition(
  seatId: number,
  playerTapTime: number | null,
  playerPosition: number,
  playerWatchedSeatId: number | null,
  standingNPCs: StandingNPC[]
): GrabResult {
  // Calculate NPC times
  const npcTimes = calculateNPCTimes(seatId, standingNPCs);

  // Calculate player effective time
  // Player can grab ANY seat, but gets penalty if not adjacent
  let playerEffectiveTime: number | null = null;
  const playerIsAdjacent = isAdjacentToSeat(playerPosition, seatId);
  const playerIsWatching = playerWatchedSeatId === seatId;

  if (playerTapTime !== null) {
    playerEffectiveTime = calculateEffectiveTime(playerTapTime, playerIsWatching, playerIsAdjacent);
  }

  // Find the fastest competitor
  let fastestTime = Infinity;
  let winnerId = "";
  let isPlayerWinner = false;

  // Check NPCs
  for (const npc of npcTimes) {
    if (npc.effectiveTime < fastestTime) {
      fastestTime = npc.effectiveTime;
      winnerId = npc.id;
      isPlayerWinner = false;
    }
  }

  // Check player
  if (playerEffectiveTime !== null && playerEffectiveTime < fastestTime) {
    fastestTime = playerEffectiveTime;
    winnerId = "player";
    isPlayerWinner = true;
  }

  // If no one competed (shouldn't happen), give to first NPC
  if (winnerId === "" && npcTimes.length > 0) {
    winnerId = npcTimes[0].id;
    isPlayerWinner = false;
  }

  return {
    winnerId,
    isPlayerWinner,
    seatId,
    playerEffectiveTime,
    npcTimes,
  };
}

/**
 * Resolve multiple seat competitions (when multiple seats open)
 * Uses position advantage - closest gets priority
 */
export function resolveMultipleSeatCompetitions(
  openSeats: number[],
  playerTapTime: number | null,
  playerTappedSeat: number | null,
  playerPosition: number,
  playerWatchedSeatId: number | null,
  standingNPCs: StandingNPC[]
): GrabResult[] {
  const results: GrabResult[] = [];
  let remainingNPCs = [...standingNPCs];

  for (const seatId of openSeats) {
    // Player only competes for the seat they tapped
    const playerTap = playerTappedSeat === seatId ? playerTapTime : null;

    const result = resolveGrabCompetition(
      seatId,
      playerTap,
      playerPosition,
      playerWatchedSeatId,
      remainingNPCs
    );

    results.push(result);

    // Remove winning NPC from remaining (they got a seat)
    if (!result.isPlayerWinner && result.winnerId) {
      remainingNPCs = remainingNPCs.filter((npc) => npc.id !== result.winnerId);
    }

    // If player won, they're done competing
    if (result.isPlayerWinner) {
      break;
    }
  }

  return results;
}
