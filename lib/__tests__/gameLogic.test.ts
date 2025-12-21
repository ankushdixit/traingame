import { generateInitialState, revealDestination, claimSeat, advanceStation } from "../gameLogic";
import { STATIONS, TOTAL_SEATS, DIFFICULTY_CONFIGS, DEFAULT_DIFFICULTY } from "../constants";
import { GameState, Seat, Difficulty } from "../types";

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

  describe("NPC generation (easy difficulty)", () => {
    const easyConfig = DIFFICULTY_CONFIGS["easy"];
    const [minNpcs, maxNpcs] = easyConfig.seatedNpcRange;

    it("generates between 3-4 NPCs on easy difficulty (test multiple runs)", () => {
      const npcCounts: number[] = [];
      for (let i = 0; i < 50; i++) {
        const state = generateInitialState(0, 5, "easy");
        const npcCount = state.seats.filter((seat) => seat.occupant !== null).length;
        npcCounts.push(npcCount);
      }

      // All counts should be 3 or 4
      expect(npcCounts.every((count) => count >= minNpcs && count <= maxNpcs)).toBe(true);

      // Should see both 3 and 4 over 50 runs (statistically likely)
      expect(npcCounts.includes(minNpcs)).toBe(true);
      expect(npcCounts.includes(maxNpcs)).toBe(true);
    });

    it("ensures at least 2 empty seats at start on easy difficulty", () => {
      for (let i = 0; i < 20; i++) {
        const state = generateInitialState(0, 5, "easy");
        const emptySeats = state.seats.filter((seat) => seat.occupant === null).length;
        expect(emptySeats).toBeGreaterThanOrEqual(2);
      }
    });

    it("ensures at most 3 empty seats at start on easy difficulty", () => {
      for (let i = 0; i < 20; i++) {
        const state = generateInitialState(0, 5, "easy");
        const emptySeats = state.seats.filter((seat) => seat.occupant === null).length;
        expect(emptySeats).toBeLessThanOrEqual(3);
      }
    });

    it("gives each NPC a unique ID", () => {
      for (let i = 0; i < 10; i++) {
        const state = generateInitialState(0, 5, "easy");
        const npcIds = state.seats
          .filter((seat) => seat.occupant !== null)
          .map((seat) => seat.occupant!.id);
        const uniqueIds = new Set(npcIds);
        expect(uniqueIds.size).toBe(npcIds.length);
      }
    });

    it("sets destinationRevealed to false for all NPCs", () => {
      const state = generateInitialState(0, 5, "easy");
      state.seats.forEach((seat) => {
        if (seat.occupant !== null) {
          expect(seat.occupant.destinationRevealed).toBe(false);
        }
      });
    });
  });

  describe("NPC generation (normal difficulty - default)", () => {
    it("uses normal difficulty by default", () => {
      expect(DEFAULT_DIFFICULTY).toBe("normal");
    });

    it("generates exactly 5 NPCs on normal difficulty", () => {
      for (let i = 0; i < 20; i++) {
        const state = generateInitialState(0, 5, "normal");
        const npcCount = state.seats.filter((seat) => seat.occupant !== null).length;
        expect(npcCount).toBe(5);
      }
    });

    it("generates exactly 5 NPCs when no difficulty specified (default)", () => {
      for (let i = 0; i < 20; i++) {
        const state = generateInitialState(0, 5);
        const npcCount = state.seats.filter((seat) => seat.occupant !== null).length;
        expect(npcCount).toBe(5);
      }
    });

    it("ensures exactly 1 empty seat at start on normal difficulty", () => {
      for (let i = 0; i < 20; i++) {
        const state = generateInitialState(0, 5, "normal");
        const emptySeats = state.seats.filter((seat) => seat.occupant === null).length;
        expect(emptySeats).toBe(1);
      }
    });
  });

  describe("NPC generation (rush difficulty)", () => {
    it("generates exactly 6 NPCs on rush difficulty", () => {
      for (let i = 0; i < 20; i++) {
        const state = generateInitialState(0, 5, "rush");
        const npcCount = state.seats.filter((seat) => seat.occupant !== null).length;
        expect(npcCount).toBe(6);
      }
    });

    it("ensures 0 empty seats at start on rush difficulty", () => {
      for (let i = 0; i < 20; i++) {
        const state = generateInitialState(0, 5, "rush");
        const emptySeats = state.seats.filter((seat) => seat.occupant === null).length;
        expect(emptySeats).toBe(0);
      }
    });
  });

  describe("difficulty configuration validation", () => {
    it("has valid configurations for all difficulties", () => {
      const difficulties: Difficulty[] = ["easy", "normal", "rush"];
      difficulties.forEach((difficulty) => {
        const config = DIFFICULTY_CONFIGS[difficulty];
        expect(config.name).toBe(difficulty);
        expect(config.displayName).toBeTruthy();
        expect(config.seatedNpcRange[0]).toBeLessThanOrEqual(config.seatedNpcRange[1]);
        expect(config.seatedNpcRange[1]).toBeLessThanOrEqual(TOTAL_SEATS);
      });
    });

    it("easy difficulty has 3-4 NPCs configured", () => {
      const config = DIFFICULTY_CONFIGS["easy"];
      expect(config.seatedNpcRange).toEqual([3, 4]);
    });

    it("normal difficulty has exactly 5 NPCs configured", () => {
      const config = DIFFICULTY_CONFIGS["normal"];
      expect(config.seatedNpcRange).toEqual([5, 5]);
    });

    it("rush difficulty has exactly 6 NPCs configured", () => {
      const config = DIFFICULTY_CONFIGS["rush"];
      expect(config.seatedNpcRange).toEqual([6, 6]);
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
    it("produces different NPC seat assignments across runs (easy difficulty)", () => {
      const seatConfigs: string[] = [];
      for (let i = 0; i < 30; i++) {
        const state = generateInitialState(0, 5, "easy");
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
        const state = generateInitialState(0, 5, "easy");
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

    it("produces different NPC seat positions on normal difficulty", () => {
      const seatConfigs: string[] = [];
      for (let i = 0; i < 30; i++) {
        const state = generateInitialState(0, 5, "normal");
        const config = state.seats.map((seat) => (seat.occupant ? "1" : "0")).join("");
        seatConfigs.push(config);
      }
      // On normal difficulty, always 5 NPCs but which seat is empty should vary
      const uniqueConfigs = new Set(seatConfigs);
      expect(uniqueConfigs.size).toBeGreaterThan(1);
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

describe("revealDestination", () => {
  const createTestState = (seats: Seat[]): GameState => ({
    currentStation: 0,
    playerBoardingStation: 0,
    playerDestination: 5,
    playerSeated: false,
    seatId: null,
    seats,
    gameStatus: "playing",
  });

  it("sets destinationRevealed to true for the specified seat", () => {
    const seats: Seat[] = [
      { id: 0, occupant: { id: "npc-0", destination: 3, destinationRevealed: false } },
      { id: 1, occupant: null },
      { id: 2, occupant: { id: "npc-1", destination: 4, destinationRevealed: false } },
    ];
    const state = createTestState(seats);

    const newState = revealDestination(state, 0);

    expect(newState.seats[0].occupant!.destinationRevealed).toBe(true);
  });

  it("does not modify other seats", () => {
    const seats: Seat[] = [
      { id: 0, occupant: { id: "npc-0", destination: 3, destinationRevealed: false } },
      { id: 1, occupant: null },
      { id: 2, occupant: { id: "npc-1", destination: 4, destinationRevealed: false } },
    ];
    const state = createTestState(seats);

    const newState = revealDestination(state, 0);

    expect(newState.seats[1].occupant).toBeNull();
    expect(newState.seats[2].occupant!.destinationRevealed).toBe(false);
  });

  it("returns new state object (immutable update)", () => {
    const seats: Seat[] = [
      { id: 0, occupant: { id: "npc-0", destination: 3, destinationRevealed: false } },
    ];
    const state = createTestState(seats);

    const newState = revealDestination(state, 0);

    expect(newState).not.toBe(state);
    expect(newState.seats).not.toBe(state.seats);
    expect(newState.seats[0]).not.toBe(state.seats[0]);
    expect(newState.seats[0].occupant).not.toBe(state.seats[0].occupant);
  });

  it("does not mutate original state", () => {
    const seats: Seat[] = [
      { id: 0, occupant: { id: "npc-0", destination: 3, destinationRevealed: false } },
    ];
    const state = createTestState(seats);

    revealDestination(state, 0);

    expect(state.seats[0].occupant!.destinationRevealed).toBe(false);
  });

  it("handles empty seat gracefully", () => {
    const seats: Seat[] = [
      { id: 0, occupant: null },
      { id: 1, occupant: { id: "npc-0", destination: 3, destinationRevealed: false } },
    ];
    const state = createTestState(seats);

    const newState = revealDestination(state, 0);

    // Empty seat should remain unchanged
    expect(newState.seats[0].occupant).toBeNull();
  });

  it("handles already revealed destination", () => {
    const seats: Seat[] = [
      { id: 0, occupant: { id: "npc-0", destination: 3, destinationRevealed: true } },
    ];
    const state = createTestState(seats);

    const newState = revealDestination(state, 0);

    expect(newState.seats[0].occupant!.destinationRevealed).toBe(true);
  });

  it("preserves other state properties", () => {
    const seats: Seat[] = [
      { id: 0, occupant: { id: "npc-0", destination: 3, destinationRevealed: false } },
    ];
    const state: GameState = {
      currentStation: 2,
      playerBoardingStation: 1,
      playerDestination: 5,
      playerSeated: true,
      seatId: 1,
      seats,
      gameStatus: "playing",
    };

    const newState = revealDestination(state, 0);

    expect(newState.currentStation).toBe(2);
    expect(newState.playerBoardingStation).toBe(1);
    expect(newState.playerDestination).toBe(5);
    expect(newState.playerSeated).toBe(true);
    expect(newState.seatId).toBe(1);
    expect(newState.gameStatus).toBe("playing");
  });

  it("handles non-existent seat ID gracefully", () => {
    const seats: Seat[] = [
      { id: 0, occupant: { id: "npc-0", destination: 3, destinationRevealed: false } },
    ];
    const state = createTestState(seats);

    const newState = revealDestination(state, 99);

    // State should be unchanged (no seat with ID 99)
    expect(newState.seats[0].occupant!.destinationRevealed).toBe(false);
  });
});

describe("claimSeat", () => {
  const createTestState = (seats: Seat[]): GameState => ({
    currentStation: 0,
    playerBoardingStation: 0,
    playerDestination: 5,
    playerSeated: false,
    seatId: null,
    seats,
    gameStatus: "playing",
  });

  it("sets playerSeated to true", () => {
    const seats: Seat[] = [
      { id: 0, occupant: null },
      { id: 1, occupant: { id: "npc-0", destination: 3, destinationRevealed: false } },
    ];
    const state = createTestState(seats);

    const newState = claimSeat(state, 0);

    expect(newState.playerSeated).toBe(true);
  });

  it("sets seatId to the claimed seat ID", () => {
    const seats: Seat[] = [
      { id: 0, occupant: null },
      { id: 1, occupant: null },
    ];
    const state = createTestState(seats);

    const newState = claimSeat(state, 1);

    expect(newState.seatId).toBe(1);
  });

  it("returns new state object (immutable update)", () => {
    const seats: Seat[] = [{ id: 0, occupant: null }];
    const state = createTestState(seats);

    const newState = claimSeat(state, 0);

    expect(newState).not.toBe(state);
  });

  it("does not mutate original state", () => {
    const seats: Seat[] = [{ id: 0, occupant: null }];
    const state = createTestState(seats);

    claimSeat(state, 0);

    expect(state.playerSeated).toBe(false);
    expect(state.seatId).toBeNull();
  });

  it("preserves other state properties", () => {
    const seats: Seat[] = [
      { id: 0, occupant: null },
      { id: 1, occupant: { id: "npc-0", destination: 3, destinationRevealed: true } },
    ];
    const state: GameState = {
      currentStation: 2,
      playerBoardingStation: 1,
      playerDestination: 5,
      playerSeated: false,
      seatId: null,
      seats,
      gameStatus: "playing",
    };

    const newState = claimSeat(state, 0);

    expect(newState.currentStation).toBe(2);
    expect(newState.playerBoardingStation).toBe(1);
    expect(newState.playerDestination).toBe(5);
    expect(newState.seats).toBe(state.seats);
    expect(newState.gameStatus).toBe("playing");
  });

  it("preserves seats array unchanged", () => {
    const seats: Seat[] = [
      { id: 0, occupant: null },
      { id: 1, occupant: { id: "npc-0", destination: 3, destinationRevealed: false } },
    ];
    const state = createTestState(seats);

    const newState = claimSeat(state, 0);

    expect(newState.seats).toEqual(state.seats);
    expect(newState.seats[0].occupant).toBeNull();
    expect(newState.seats[1].occupant!.destinationRevealed).toBe(false);
  });
});

describe("advanceStation", () => {
  const createTestState = (seats: Seat[], overrides: Partial<GameState> = {}): GameState => ({
    currentStation: 0,
    playerBoardingStation: 0,
    playerDestination: 5,
    playerSeated: false,
    seatId: null,
    seats,
    gameStatus: "playing",
    ...overrides,
  });

  describe("station advancement", () => {
    it("increments currentStation by 1", () => {
      const seats: Seat[] = [{ id: 0, occupant: null }];
      const state = createTestState(seats, { currentStation: 0 });

      const newState = advanceStation(state);

      expect(newState.currentStation).toBe(1);
    });

    it("increments from any station", () => {
      const seats: Seat[] = [{ id: 0, occupant: null }];
      const state = createTestState(seats, { currentStation: 3 });

      const newState = advanceStation(state);

      expect(newState.currentStation).toBe(4);
    });
  });

  describe("NPC removal", () => {
    it("removes NPC whose destination equals new station", () => {
      const seats: Seat[] = [
        { id: 0, occupant: { id: "npc-0", destination: 1, destinationRevealed: false } },
        { id: 1, occupant: null },
      ];
      const state = createTestState(seats, { currentStation: 0 });

      const newState = advanceStation(state);

      expect(newState.seats[0].occupant).toBeNull();
    });

    it("removes NPC whose destination is before new station", () => {
      const seats: Seat[] = [
        { id: 0, occupant: { id: "npc-0", destination: 1, destinationRevealed: false } },
        { id: 1, occupant: null },
      ];
      const state = createTestState(seats, { currentStation: 1 });

      const newState = advanceStation(state);

      // Station advances to 2, NPC with dest 1 should be removed
      expect(newState.seats[0].occupant).toBeNull();
    });

    it("keeps NPC whose destination is after new station", () => {
      const seats: Seat[] = [
        { id: 0, occupant: { id: "npc-0", destination: 3, destinationRevealed: false } },
        { id: 1, occupant: null },
      ];
      const state = createTestState(seats, { currentStation: 0 });

      const newState = advanceStation(state);

      expect(newState.seats[0].occupant).not.toBeNull();
      expect(newState.seats[0].occupant!.id).toBe("npc-0");
    });

    it("removes multiple NPCs at same station", () => {
      const seats: Seat[] = [
        { id: 0, occupant: { id: "npc-0", destination: 1, destinationRevealed: false } },
        { id: 1, occupant: { id: "npc-1", destination: 1, destinationRevealed: true } },
        { id: 2, occupant: { id: "npc-2", destination: 3, destinationRevealed: false } },
      ];
      const state = createTestState(seats, { currentStation: 0 });

      const newState = advanceStation(state);

      expect(newState.seats[0].occupant).toBeNull();
      expect(newState.seats[1].occupant).toBeNull();
      expect(newState.seats[2].occupant).not.toBeNull();
    });

    it("clears revealed destination info when NPC exits", () => {
      const seats: Seat[] = [
        { id: 0, occupant: { id: "npc-0", destination: 1, destinationRevealed: true } },
      ];
      const state = createTestState(seats, { currentStation: 0 });

      const newState = advanceStation(state);

      // NPC is removed, so seat is empty
      expect(newState.seats[0].occupant).toBeNull();
    });

    it("keeps empty seats empty", () => {
      const seats: Seat[] = [
        { id: 0, occupant: null },
        { id: 1, occupant: { id: "npc-0", destination: 3, destinationRevealed: false } },
      ];
      const state = createTestState(seats, { currentStation: 0 });

      const newState = advanceStation(state);

      expect(newState.seats[0].occupant).toBeNull();
    });
  });

  describe("game end conditions", () => {
    it("sets gameStatus to 'won' when player seated at destination", () => {
      const seats: Seat[] = [{ id: 0, occupant: null }];
      const state = createTestState(seats, {
        currentStation: 4,
        playerDestination: 5,
        playerSeated: true,
        seatId: 0,
      });

      const newState = advanceStation(state);

      expect(newState.gameStatus).toBe("won");
    });

    it("sets gameStatus to 'lost' when player standing at destination", () => {
      const seats: Seat[] = [{ id: 0, occupant: null }];
      const state = createTestState(seats, {
        currentStation: 4,
        playerDestination: 5,
        playerSeated: false,
      });

      const newState = advanceStation(state);

      expect(newState.gameStatus).toBe("lost");
    });

    it("keeps gameStatus as 'playing' before destination", () => {
      const seats: Seat[] = [{ id: 0, occupant: null }];
      const state = createTestState(seats, {
        currentStation: 2,
        playerDestination: 5,
        playerSeated: false,
      });

      const newState = advanceStation(state);

      expect(newState.gameStatus).toBe("playing");
    });

    it("triggers game end when passing destination", () => {
      const seats: Seat[] = [{ id: 0, occupant: null }];
      const state = createTestState(seats, {
        currentStation: 3,
        playerDestination: 4,
        playerSeated: true,
        seatId: 0,
      });

      const newState = advanceStation(state);

      expect(newState.currentStation).toBe(4);
      expect(newState.gameStatus).toBe("won");
    });
  });

  describe("immutability", () => {
    it("returns new state object", () => {
      const seats: Seat[] = [{ id: 0, occupant: null }];
      const state = createTestState(seats);

      const newState = advanceStation(state);

      expect(newState).not.toBe(state);
    });

    it("does not mutate original state", () => {
      const seats: Seat[] = [
        { id: 0, occupant: { id: "npc-0", destination: 1, destinationRevealed: false } },
      ];
      const state = createTestState(seats, { currentStation: 0 });

      advanceStation(state);

      expect(state.currentStation).toBe(0);
      expect(state.seats[0].occupant).not.toBeNull();
    });

    it("returns new seats array", () => {
      const seats: Seat[] = [{ id: 0, occupant: null }];
      const state = createTestState(seats);

      const newState = advanceStation(state);

      expect(newState.seats).not.toBe(state.seats);
    });

    it("preserves other state properties", () => {
      const seats: Seat[] = [{ id: 0, occupant: null }];
      const state = createTestState(seats, {
        playerBoardingStation: 1,
        playerDestination: 5,
        playerSeated: true,
        seatId: 0,
      });

      const newState = advanceStation(state);

      expect(newState.playerBoardingStation).toBe(1);
      expect(newState.playerDestination).toBe(5);
      expect(newState.playerSeated).toBe(true);
      expect(newState.seatId).toBe(0);
    });
  });
});
