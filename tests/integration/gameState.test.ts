/**
 * Integration Tests for Game State
 *
 * Tests that generated game state structure matches TypeScript types
 * and can be used with game components.
 */

import { generateInitialState, advanceStation, processNewBoarders } from "@/lib/gameLogic";
import { GameState, NPC, Seat, Difficulty, Line } from "@/lib/types";
import { STATIONS, TOTAL_SEATS, DIFFICULTY_CONFIGS, getStations } from "@/lib/constants";

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

  describe("difficulty integration", () => {
    it("stores difficulty in game state", () => {
      const difficulties: Difficulty[] = ["easy", "normal", "rush"];
      for (const difficulty of difficulties) {
        const state = generateInitialState(0, 5, difficulty);
        expect(state.difficulty).toBe(difficulty);
      }
    });

    it("defaults to normal difficulty when not specified", () => {
      const state = generateInitialState(0, 5);
      expect(state.difficulty).toBe("normal");
    });

    it("easy difficulty has more empty seats", () => {
      const easyStates = Array.from({ length: 10 }, () => generateInitialState(0, 5, "easy"));
      const rushStates = Array.from({ length: 10 }, () => generateInitialState(0, 5, "rush"));

      const avgEasyEmpty =
        easyStates.reduce(
          (sum, state) => sum + state.seats.filter((s) => s.occupant === null).length,
          0
        ) / easyStates.length;

      const avgRushEmpty =
        rushStates.reduce(
          (sum, state) => sum + state.seats.filter((s) => s.occupant === null).length,
          0
        ) / rushStates.length;

      // Easy should have more empty seats than Rush
      expect(avgEasyEmpty).toBeGreaterThan(avgRushEmpty);
    });
  });

  describe("line integration", () => {
    it("stores line in game state", () => {
      const lines: Line[] = ["short", "full"];
      for (const line of lines) {
        const destination = line === "full" ? 14 : 5;
        const state = generateInitialState(0, destination, "normal", line);
        expect(state.line).toBe(line);
      }
    });

    it("defaults to short line when not specified", () => {
      const state = generateInitialState(0, 5);
      expect(state.line).toBe("short");
    });

    it("short line uses 6 stations", () => {
      const state = generateInitialState(0, 5, "normal", "short");
      const stations = getStations(state.line);
      expect(stations.length).toBe(6);
      expect(stations[0]).toBe("Churchgate");
      expect(stations[5]).toBe("Dadar");
    });

    it("full line uses 15 stations", () => {
      const state = generateInitialState(0, 14, "normal", "full");
      const stations = getStations(state.line);
      expect(stations.length).toBe(15);
      expect(stations[0]).toBe("Churchgate");
      expect(stations[14]).toBe("Borivali");
    });

    it("NPCs can have destinations beyond Dadar on full line", () => {
      let foundBeyondDadar = false;
      for (let i = 0; i < 50; i++) {
        const state = generateInitialState(0, 14, "normal", "full");
        state.seats.forEach((seat) => {
          if (seat.occupant !== null && seat.occupant.destination > 5) {
            foundBeyondDadar = true;
          }
        });
        if (foundBeyondDadar) break;
      }
      expect(foundBeyondDadar).toBe(true);
    });

    it("handles all valid full line boarding/destination combinations", () => {
      const fullStations = getStations("full");
      // Test a sample of combinations to avoid too long test
      const boardingStations = [0, 5, 10];
      for (const boarding of boardingStations) {
        for (let dest = boarding + 1; dest < fullStations.length; dest += 2) {
          const state = generateInitialState(boarding, dest, "normal", "full");
          expect(state.playerBoardingStation).toBe(boarding);
          expect(state.playerDestination).toBe(dest);
          expect(state.gameStatus).toBe("playing");
        }
      }
    });
  });

  describe("full journey simulation", () => {
    it("completes a short line journey from Churchgate to Dadar", () => {
      let state = generateInitialState(0, 5, "normal", "short");
      expect(state.currentStation).toBe(0);
      expect(state.line).toBe("short");

      // Simulate player claiming a seat
      const emptySeat = state.seats.find((s) => s.occupant === null);
      if (emptySeat) {
        state = { ...state, playerSeated: true, seatId: emptySeat.id };
      }

      // Advance through all stations
      while (state.currentStation < 5) {
        state = advanceStation(state);
      }

      expect(state.currentStation).toBe(5);
      expect(state.gameStatus).toBe(state.playerSeated ? "won" : "lost");
    });

    it("completes a full line journey from Churchgate to Borivali", () => {
      let state = generateInitialState(0, 14, "normal", "full");
      expect(state.currentStation).toBe(0);
      expect(state.line).toBe("full");

      // Simulate player claiming a seat
      const emptySeat = state.seats.find((s) => s.occupant === null);
      if (emptySeat) {
        state = { ...state, playerSeated: true, seatId: emptySeat.id };
      }

      // Advance through all stations
      while (state.currentStation < 14) {
        state = advanceStation(state);
      }

      expect(state.currentStation).toBe(14);
      expect(state.gameStatus).toBe(state.playerSeated ? "won" : "lost");
    });

    it("processes new boarders at major stations on full line", () => {
      // Start from Dadar (station 5) heading to Borivali with all empty seats
      // Mock random to control boarding behavior
      jest.spyOn(Math, "random").mockReturnValue(0.1);

      let state = generateInitialState(4, 14, "normal", "full");

      // Clear all seats for testing and advance to Dadar
      state = {
        ...state,
        currentStation: 5, // Dadar
        seats: state.seats.map((s) => ({ ...s, occupant: null })),
      };

      // Process boarding at Dadar
      state = processNewBoarders(state, "Dadar");

      // Should have some passengers on full line at major station
      const occupiedSeats = state.seats.filter((s) => s.occupant !== null);
      expect(occupiedSeats.length).toBeGreaterThan(0);

      jest.spyOn(Math, "random").mockRestore();
    });

    it("does not process new boarders on short line", () => {
      let state = generateInitialState(0, 5, "easy", "short");

      // Clear all seats for testing
      state = {
        ...state,
        seats: state.seats.map((s) => ({ ...s, occupant: null })),
      };

      // Mock random to ensure boarding would happen on full line
      jest.spyOn(Math, "random").mockReturnValue(0.1);

      // Process boarding at Dadar (final station of short line)
      state = processNewBoarders(state, "Dadar");

      // Should have no passengers since short line doesn't allow boarding
      const occupiedSeats = state.seats.filter((s) => s.occupant !== null);
      expect(occupiedSeats.length).toBe(0);

      jest.spyOn(Math, "random").mockRestore();
    });
  });
});
