import { generateInitialState } from "../gameLogic";
import { STATIONS, TOTAL_SEATS, MIN_NPCS, MAX_NPCS } from "../constants";

describe("generateInitialState", () => {
  describe("seat generation", () => {
    it("always returns exactly 6 seats", () => {
      for (let i = 0; i < 20; i++) {
        const state = generateInitialState(0, 5);
        expect(state.seats).toHaveLength(TOTAL_SEATS);
      }
    });

    it("assigns unique sequential IDs to seats (0-5)", () => {
      const state = generateInitialState(0, 5);
      const seatIds = state.seats.map((seat) => seat.id);
      expect(seatIds).toEqual([0, 1, 2, 3, 4, 5]);
    });
  });

  describe("NPC generation", () => {
    it("generates between 3-4 NPCs (test multiple runs)", () => {
      const npcCounts: number[] = [];
      for (let i = 0; i < 50; i++) {
        const state = generateInitialState(0, 5);
        const npcCount = state.seats.filter((seat) => seat.occupant !== null).length;
        npcCounts.push(npcCount);
      }

      // All counts should be 3 or 4
      expect(npcCounts.every((count) => count >= MIN_NPCS && count <= MAX_NPCS)).toBe(true);

      // Should see both 3 and 4 over 50 runs (statistically likely)
      expect(npcCounts.includes(MIN_NPCS)).toBe(true);
      expect(npcCounts.includes(MAX_NPCS)).toBe(true);
    });

    it("ensures at least 2 empty seats at start", () => {
      for (let i = 0; i < 20; i++) {
        const state = generateInitialState(0, 5);
        const emptySeats = state.seats.filter((seat) => seat.occupant === null).length;
        expect(emptySeats).toBeGreaterThanOrEqual(2);
      }
    });

    it("ensures at most 3 empty seats at start", () => {
      for (let i = 0; i < 20; i++) {
        const state = generateInitialState(0, 5);
        const emptySeats = state.seats.filter((seat) => seat.occupant === null).length;
        expect(emptySeats).toBeLessThanOrEqual(3);
      }
    });

    it("gives each NPC a unique ID", () => {
      for (let i = 0; i < 10; i++) {
        const state = generateInitialState(0, 5);
        const npcIds = state.seats
          .filter((seat) => seat.occupant !== null)
          .map((seat) => seat.occupant!.id);
        const uniqueIds = new Set(npcIds);
        expect(uniqueIds.size).toBe(npcIds.length);
      }
    });

    it("sets destinationRevealed to false for all NPCs", () => {
      const state = generateInitialState(0, 5);
      state.seats.forEach((seat) => {
        if (seat.occupant !== null) {
          expect(seat.occupant.destinationRevealed).toBe(false);
        }
      });
    });
  });

  describe("NPC destination validation", () => {
    it("all NPC destinations are after the boarding station", () => {
      for (let boardingStation = 0; boardingStation < STATIONS.length - 1; boardingStation++) {
        for (let i = 0; i < 10; i++) {
          const state = generateInitialState(boardingStation, STATIONS.length - 1);
          state.seats.forEach((seat) => {
            if (seat.occupant !== null) {
              expect(seat.occupant.destination).toBeGreaterThan(boardingStation);
            }
          });
        }
      }
    });

    it("all NPC destinations are at or before Dadar (final station)", () => {
      for (let i = 0; i < 20; i++) {
        const state = generateInitialState(0, 5);
        state.seats.forEach((seat) => {
          if (seat.occupant !== null) {
            expect(seat.occupant.destination).toBeLessThanOrEqual(STATIONS.length - 1);
          }
        });
      }
    });

    it("generates valid destinations from Mumbai Central (second to last station)", () => {
      for (let i = 0; i < 20; i++) {
        const state = generateInitialState(4, 5); // Mumbai Central -> Dadar
        state.seats.forEach((seat) => {
          if (seat.occupant !== null) {
            // Only valid destination is Dadar (index 5)
            expect(seat.occupant.destination).toBe(5);
          }
        });
      }
    });
  });

  describe("player state initialization", () => {
    it("player starts standing (playerSeated is false)", () => {
      const state = generateInitialState(0, 5);
      expect(state.playerSeated).toBe(false);
    });

    it("player seatId is null when standing", () => {
      const state = generateInitialState(0, 5);
      expect(state.seatId).toBeNull();
    });

    it("correctly stores player boarding station", () => {
      const state = generateInitialState(2, 5);
      expect(state.playerBoardingStation).toBe(2);
    });

    it("correctly stores player destination", () => {
      const state = generateInitialState(0, 3);
      expect(state.playerDestination).toBe(3);
    });

    it("sets currentStation to boarding station", () => {
      const state = generateInitialState(1, 4);
      expect(state.currentStation).toBe(1);
    });
  });

  describe("game status initialization", () => {
    it("gameStatus starts as 'playing'", () => {
      const state = generateInitialState(0, 5);
      expect(state.gameStatus).toBe("playing");
    });
  });

  describe("remaining stations calculation", () => {
    it("correctly calculates remaining stations for Churchgate to Dadar", () => {
      const state = generateInitialState(0, 5);
      const remainingStations = state.playerDestination - state.currentStation;
      expect(remainingStations).toBe(5);
    });

    it("correctly calculates remaining stations for Marine Lines to Grant Road", () => {
      const state = generateInitialState(1, 3);
      const remainingStations = state.playerDestination - state.currentStation;
      expect(remainingStations).toBe(2);
    });

    it("correctly calculates remaining stations for Mumbai Central to Dadar", () => {
      const state = generateInitialState(4, 5);
      const remainingStations = state.playerDestination - state.currentStation;
      expect(remainingStations).toBe(1);
    });
  });

  describe("randomization", () => {
    it("produces different NPC seat assignments across runs", () => {
      const seatConfigs: string[] = [];
      for (let i = 0; i < 30; i++) {
        const state = generateInitialState(0, 5);
        const config = state.seats.map((seat) => (seat.occupant ? "1" : "0")).join("");
        seatConfigs.push(config);
      }
      // Should have at least 2 different configurations over 30 runs
      const uniqueConfigs = new Set(seatConfigs);
      expect(uniqueConfigs.size).toBeGreaterThan(1);
    });

    it("produces different NPC destinations across runs (when range allows)", () => {
      const destinationSets: string[] = [];
      for (let i = 0; i < 30; i++) {
        const state = generateInitialState(0, 5);
        const destinations = state.seats
          .filter((seat) => seat.occupant !== null)
          .map((seat) => seat.occupant!.destination)
          .sort()
          .join(",");
        destinationSets.push(destinations);
      }
      // Should have multiple different destination combinations
      const uniqueSets = new Set(destinationSets);
      expect(uniqueSets.size).toBeGreaterThan(1);
    });
  });

  describe("edge cases", () => {
    it("handles boarding at first station (Churchgate)", () => {
      const state = generateInitialState(0, 5);
      expect(state.currentStation).toBe(0);
      expect(state.playerBoardingStation).toBe(0);
      state.seats.forEach((seat) => {
        if (seat.occupant !== null) {
          expect(seat.occupant.destination).toBeGreaterThan(0);
        }
      });
    });

    it("handles boarding at second to last station (Mumbai Central)", () => {
      const state = generateInitialState(4, 5);
      expect(state.currentStation).toBe(4);
      expect(state.playerBoardingStation).toBe(4);
      // All NPCs must exit at Dadar
      state.seats.forEach((seat) => {
        if (seat.occupant !== null) {
          expect(seat.occupant.destination).toBe(5);
        }
      });
    });

    it("handles various destination selections", () => {
      // Player destination can be any station after boarding
      const state1 = generateInitialState(0, 1);
      expect(state1.playerDestination).toBe(1);

      const state2 = generateInitialState(0, 3);
      expect(state2.playerDestination).toBe(3);

      const state3 = generateInitialState(2, 4);
      expect(state3.playerDestination).toBe(4);
    });
  });
});
