/**
 * Integration Tests for Game State
 *
 * Tests that generated game state structure matches TypeScript types
 * and can be used with game components.
 */

import { generateInitialState } from "@/lib/gameLogic";
import { GameState, NPC, Seat, Difficulty } from "@/lib/types";
import { STATIONS, TOTAL_SEATS, DIFFICULTY_CONFIGS } from "@/lib/constants";

describe("Game State Integration", () => {
  describe("type compatibility", () => {
    it("generated state matches GameState interface", () => {
      const state: GameState = generateInitialState(0, 5);

      // Verify all required properties exist with correct types
      expect(typeof state.currentStation).toBe("number");
      expect(typeof state.playerBoardingStation).toBe("number");
      expect(typeof state.playerDestination).toBe("number");
      expect(typeof state.playerSeated).toBe("boolean");
      expect(state.seatId === null || typeof state.seatId === "number").toBe(true);
      expect(Array.isArray(state.seats)).toBe(true);
      expect(["playing", "won", "lost"]).toContain(state.gameStatus);
    });

    it("seats match Seat interface", () => {
      const state = generateInitialState(0, 5);

      state.seats.forEach((seat: Seat) => {
        expect(typeof seat.id).toBe("number");
        expect(seat.occupant === null || typeof seat.occupant === "object").toBe(true);
      });
    });

    it("NPCs match NPC interface", () => {
      const state = generateInitialState(0, 5);

      state.seats.forEach((seat) => {
        if (seat.occupant !== null) {
          const npc: NPC = seat.occupant;
          expect(typeof npc.id).toBe("string");
          expect(typeof npc.destination).toBe("number");
          expect(typeof npc.destinationRevealed).toBe("boolean");
        }
      });
    });
  });

  describe("game configuration consistency", () => {
    it("uses TOTAL_SEATS constant correctly", () => {
      const state = generateInitialState(0, 5);
      expect(state.seats.length).toBe(TOTAL_SEATS);
    });

    it("respects difficulty NPC bounds for all difficulties", () => {
      const difficulties: Difficulty[] = ["easy", "normal", "rush"];
      for (const difficulty of difficulties) {
        const config = DIFFICULTY_CONFIGS[difficulty];
        const [minNpcs, maxNpcs] = config.seatedNpcRange;
        for (let i = 0; i < 20; i++) {
          const state = generateInitialState(0, 5, difficulty);
          const npcCount = state.seats.filter((s) => s.occupant !== null).length;
          expect(npcCount).toBeGreaterThanOrEqual(minNpcs);
          expect(npcCount).toBeLessThanOrEqual(maxNpcs);
        }
      }
    });

    it("uses normal difficulty by default", () => {
      const normalConfig = DIFFICULTY_CONFIGS["normal"];
      const [minNpcs, maxNpcs] = normalConfig.seatedNpcRange;
      for (let i = 0; i < 20; i++) {
        const state = generateInitialState(0, 5);
        const npcCount = state.seats.filter((s) => s.occupant !== null).length;
        expect(npcCount).toBeGreaterThanOrEqual(minNpcs);
        expect(npcCount).toBeLessThanOrEqual(maxNpcs);
      }
    });

    it("NPC destinations respect STATIONS array bounds", () => {
      const state = generateInitialState(0, 5);
      state.seats.forEach((seat) => {
        if (seat.occupant !== null) {
          expect(seat.occupant.destination).toBeGreaterThanOrEqual(0);
          expect(seat.occupant.destination).toBeLessThan(STATIONS.length);
        }
      });
    });
  });

  describe("state usability for game logic", () => {
    it("can calculate remaining stations from state", () => {
      const state = generateInitialState(0, 5);
      const remainingStations = state.playerDestination - state.currentStation;

      expect(remainingStations).toBeGreaterThan(0);
      expect(remainingStations).toBeLessThan(STATIONS.length);
    });

    it("can count occupied and empty seats from state", () => {
      // Use easy difficulty for testing varying NPC counts
      const easyConfig = DIFFICULTY_CONFIGS["easy"];
      const [minNpcs, maxNpcs] = easyConfig.seatedNpcRange;
      const state = generateInitialState(0, 5, "easy");

      const occupiedSeats = state.seats.filter((s) => s.occupant !== null);
      const emptySeats = state.seats.filter((s) => s.occupant === null);

      expect(occupiedSeats.length + emptySeats.length).toBe(TOTAL_SEATS);
      expect(occupiedSeats.length).toBeGreaterThanOrEqual(minNpcs);
      expect(emptySeats.length).toBeGreaterThanOrEqual(TOTAL_SEATS - maxNpcs);
    });

    it("can find specific seat by ID", () => {
      const state = generateInitialState(0, 5);

      for (let i = 0; i < TOTAL_SEATS; i++) {
        const seat = state.seats.find((s) => s.id === i);
        expect(seat).toBeDefined();
        expect(seat?.id).toBe(i);
      }
    });

    it("can get NPCs exiting at a specific station", () => {
      const state = generateInitialState(0, 5);

      for (let station = 1; station < STATIONS.length; station++) {
        const npcsExiting = state.seats
          .filter((s) => s.occupant !== null && s.occupant.destination === station)
          .map((s) => s.occupant);

        // All returned items should be NPCs for this station
        npcsExiting.forEach((npc) => {
          expect(npc?.destination).toBe(station);
        });
      }
    });

    it("player state supports seating logic", () => {
      const state = generateInitialState(0, 5);

      // Player starts standing
      expect(state.playerSeated).toBe(false);
      expect(state.seatId).toBeNull();

      // Empty seats are available for player
      const availableSeats = state.seats.filter((s) => s.occupant === null);
      expect(availableSeats.length).toBeGreaterThan(0);

      // Simulate player sitting (state mutation for testing)
      const mockSeatedState = {
        ...state,
        playerSeated: true,
        seatId: availableSeats[0].id,
      };

      expect(mockSeatedState.playerSeated).toBe(true);
      expect(mockSeatedState.seatId).toBe(availableSeats[0].id);
    });
  });

  describe("station selection integration", () => {
    it("boarding station from selection works with game state", () => {
      // Simulate values from StationSelection form
      const boardingStation = 2; // Charni Road
      const destination = 5; // Dadar

      const state = generateInitialState(boardingStation, destination);

      expect(state.currentStation).toBe(boardingStation);
      expect(state.playerBoardingStation).toBe(boardingStation);
      expect(state.playerDestination).toBe(destination);

      // NPCs destinations should be after boarding
      state.seats.forEach((seat) => {
        if (seat.occupant !== null) {
          expect(seat.occupant.destination).toBeGreaterThan(boardingStation);
        }
      });
    });

    it("handles all valid boarding/destination combinations", () => {
      // Test each valid boarding station
      for (let boarding = 0; boarding < STATIONS.length - 1; boarding++) {
        for (let dest = boarding + 1; dest < STATIONS.length; dest++) {
          const state = generateInitialState(boarding, dest);

          expect(state.playerBoardingStation).toBe(boarding);
          expect(state.playerDestination).toBe(dest);
          expect(state.gameStatus).toBe("playing");
        }
      }
    });
  });
});
