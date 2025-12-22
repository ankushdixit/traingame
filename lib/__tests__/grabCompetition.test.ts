import {
  calculateEffectiveTime,
  getCompetingNPCs,
  calculateNPCTimes,
  resolveGrabCompetition,
  resolveMultipleSeatCompetitions,
} from "../grabCompetition";
import { StandingNPC } from "../types";
import { WATCHING_BONUS_MS, ADJACENT_BONUS_MS, NON_ADJACENT_PENALTY_MS } from "../constants";

describe("grabCompetition", () => {
  const createNPC = (overrides: Partial<StandingNPC> = {}): StandingNPC => ({
    id: "npc-1",
    watchedSeatId: null,
    responseTimeBase: 500,
    characterSprite: 0,
    standingSpot: 0,
    ...overrides,
  });

  describe("calculateEffectiveTime", () => {
    it("returns base time with no bonuses", () => {
      const result = calculateEffectiveTime(500, false, false);
      expect(result).toBe(500 + NON_ADJACENT_PENALTY_MS);
    });

    it("applies watching bonus", () => {
      const result = calculateEffectiveTime(500, true, false);
      expect(result).toBe(500 - WATCHING_BONUS_MS + NON_ADJACENT_PENALTY_MS);
    });

    it("applies adjacent bonus", () => {
      const result = calculateEffectiveTime(500, false, true);
      expect(result).toBe(500 - ADJACENT_BONUS_MS);
    });

    it("applies both watching and adjacent bonuses", () => {
      const result = calculateEffectiveTime(500, true, true);
      expect(result).toBe(500 - WATCHING_BONUS_MS - ADJACENT_BONUS_MS);
    });

    it("has minimum time of 50ms", () => {
      const result = calculateEffectiveTime(10, true, true);
      expect(result).toBe(50);
    });

    it("applies non-adjacent penalty when not adjacent", () => {
      const withPenalty = calculateEffectiveTime(500, false, false);
      const withoutPenalty = calculateEffectiveTime(500, false, true);
      expect(withPenalty).toBeGreaterThan(withoutPenalty);
    });
  });

  describe("getCompetingNPCs", () => {
    it("returns all standing NPCs", () => {
      const npcs = [
        createNPC({ id: "npc-1" }),
        createNPC({ id: "npc-2" }),
        createNPC({ id: "npc-3" }),
      ];

      const result = getCompetingNPCs(npcs);

      expect(result).toHaveLength(3);
      expect(result).toBe(npcs);
    });

    it("returns empty array when no NPCs", () => {
      const result = getCompetingNPCs([]);
      expect(result).toHaveLength(0);
    });
  });

  describe("calculateNPCTimes", () => {
    it("calculates times for all NPCs", () => {
      const npcs = [
        createNPC({ id: "npc-1", standingSpot: 0, responseTimeBase: 400 }),
        createNPC({ id: "npc-2", standingSpot: 2, responseTimeBase: 500 }),
      ];

      const result = calculateNPCTimes(0, npcs);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("npc-1");
      expect(result[1].id).toBe("npc-2");
    });

    it("applies watching bonus to watching NPC", () => {
      const npcs = [
        createNPC({ id: "npc-1", watchedSeatId: 0, responseTimeBase: 500, standingSpot: 0 }),
        createNPC({ id: "npc-2", watchedSeatId: null, responseTimeBase: 500, standingSpot: 0 }),
      ];

      const result = calculateNPCTimes(0, npcs);

      expect(result[0].effectiveTime).toBeLessThan(result[1].effectiveTime);
    });
  });

  describe("resolveGrabCompetition", () => {
    it("player wins when fastest", () => {
      const npcs = [createNPC({ id: "npc-1", responseTimeBase: 600, standingSpot: 0 })];

      const result = resolveGrabCompetition(
        0, // seatId
        100, // playerTapTime - very fast
        0, // playerPosition - adjacent to seat 0
        0, // playerWatchedSeatId - watching seat 0
        npcs
      );

      expect(result.isPlayerWinner).toBe(true);
      expect(result.winnerId).toBe("player");
    });

    it("NPC wins when faster than player", () => {
      const npcs = [
        createNPC({ id: "npc-1", responseTimeBase: 100, standingSpot: 0, watchedSeatId: 0 }),
      ];

      const result = resolveGrabCompetition(
        0, // seatId
        800, // playerTapTime - slow
        3, // playerPosition - not adjacent
        null, // playerWatchedSeatId - not watching
        npcs
      );

      expect(result.isPlayerWinner).toBe(false);
      expect(result.winnerId).toBe("npc-1");
    });

    it("NPC wins when player does not tap", () => {
      const npcs = [createNPC({ id: "npc-1", responseTimeBase: 500, standingSpot: 0 })];

      const result = resolveGrabCompetition(
        0, // seatId
        null, // playerTapTime - didn't tap
        0, // playerPosition
        null, // playerWatchedSeatId
        npcs
      );

      expect(result.isPlayerWinner).toBe(false);
      expect(result.winnerId).toBe("npc-1");
      expect(result.playerEffectiveTime).toBeNull();
    });

    it("fastest NPC wins among multiple NPCs", () => {
      const npcs = [
        createNPC({ id: "npc-slow", responseTimeBase: 800, standingSpot: 4 }),
        createNPC({ id: "npc-fast", responseTimeBase: 200, standingSpot: 0, watchedSeatId: 0 }),
        createNPC({ id: "npc-medium", responseTimeBase: 500, standingSpot: 2 }),
      ];

      const result = resolveGrabCompetition(0, null, 5, null, npcs);

      expect(result.winnerId).toBe("npc-fast");
      expect(result.isPlayerWinner).toBe(false);
    });

    it("returns correct NPC times", () => {
      const npcs = [createNPC({ id: "npc-1", responseTimeBase: 500, standingSpot: 0 })];

      const result = resolveGrabCompetition(0, null, 0, null, npcs);

      expect(result.npcTimes).toHaveLength(1);
      expect(result.npcTimes[0].id).toBe("npc-1");
      expect(typeof result.npcTimes[0].effectiveTime).toBe("number");
    });

    it("gives seat to first NPC when no one competes", () => {
      const npcs = [createNPC({ id: "npc-1", responseTimeBase: 500, standingSpot: 4 })];

      const result = resolveGrabCompetition(0, null, 5, null, npcs);

      expect(result.winnerId).toBe("npc-1");
    });
  });

  describe("resolveMultipleSeatCompetitions", () => {
    it("resolves competition for each open seat", () => {
      const npcs = [
        createNPC({ id: "npc-1", responseTimeBase: 300, standingSpot: 0 }),
        createNPC({ id: "npc-2", responseTimeBase: 400, standingSpot: 2 }),
      ];

      const results = resolveMultipleSeatCompetitions(
        [0, 3], // openSeats
        null, // playerTapTime
        null, // playerTappedSeat
        5, // playerPosition
        null, // playerWatchedSeatId
        npcs
      );

      expect(results).toHaveLength(2);
      expect(results[0].seatId).toBe(0);
      expect(results[1].seatId).toBe(3);
    });

    it("removes winning NPC from subsequent competitions", () => {
      const npcs = [
        createNPC({ id: "npc-1", responseTimeBase: 100, standingSpot: 0, watchedSeatId: 0 }),
      ];

      const results = resolveMultipleSeatCompetitions([0, 3], null, null, 5, null, npcs);

      // First seat should be won by NPC
      expect(results[0].winnerId).toBe("npc-1");
      // Second seat has no NPCs left
      expect(results[1].npcTimes).toHaveLength(0);
    });

    it("player only competes for tapped seat", () => {
      const npcs = [createNPC({ id: "npc-1", responseTimeBase: 800, standingSpot: 0 })];

      const results = resolveMultipleSeatCompetitions(
        [0, 3],
        50, // playerTapTime - fast
        3, // playerTappedSeat - seat 3
        1, // playerPosition - adjacent to seat 3
        3, // playerWatchedSeatId
        npcs
      );

      // Player didn't compete for seat 0
      expect(results[0].playerEffectiveTime).toBeNull();
      // Player competed for seat 3
      expect(results[1].playerEffectiveTime).not.toBeNull();
    });

    it("stops after player wins", () => {
      const npcs = [createNPC({ id: "npc-1", responseTimeBase: 800, standingSpot: 4 })];

      const results = resolveMultipleSeatCompetitions(
        [0, 3],
        50, // playerTapTime - very fast
        0, // playerTappedSeat - seat 0
        0, // playerPosition - adjacent
        0, // playerWatchedSeatId
        npcs
      );

      expect(results[0].isPlayerWinner).toBe(true);
      // Should only have 1 result since player won first seat
      expect(results).toHaveLength(1);
    });
  });
});
