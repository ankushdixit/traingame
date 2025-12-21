import {
  generateInitialState,
  revealDestination,
  claimSeat,
  advanceStation,
  setHoveredSeat,
  generateStandingNPCs,
  processStandingNPCClaims,
  previewStationAdvance,
} from "../gameLogic";
import { STATIONS, TOTAL_SEATS, DIFFICULTY_CONFIGS, DEFAULT_DIFFICULTY } from "../constants";
import { GameState, Seat, Difficulty, StandingNPC } from "../types";

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
    playerStandingSpot: 0,
    seats,
    gameStatus: "playing",
    standingNPCs: [],
    hoveredSeatId: null,
    difficulty: "normal",
    lastClaimMessage: null,
  });

  it("sets destinationRevealed to true for the specified seat", () => {
    const seats: Seat[] = [
      {
        id: 0,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      },
      { id: 1, occupant: null },
      {
        id: 2,
        occupant: { id: "npc-1", destination: 4, destinationRevealed: false, characterSprite: 1 },
      },
    ];
    const state = createTestState(seats);

    const newState = revealDestination(state, 0);

    expect(newState.seats[0].occupant!.destinationRevealed).toBe(true);
  });

  it("does not modify other seats", () => {
    const seats: Seat[] = [
      {
        id: 0,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      },
      { id: 1, occupant: null },
      {
        id: 2,
        occupant: { id: "npc-1", destination: 4, destinationRevealed: false, characterSprite: 1 },
      },
    ];
    const state = createTestState(seats);

    const newState = revealDestination(state, 0);

    expect(newState.seats[1].occupant).toBeNull();
    expect(newState.seats[2].occupant!.destinationRevealed).toBe(false);
  });

  it("returns new state object (immutable update)", () => {
    const seats: Seat[] = [
      {
        id: 0,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      },
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
      {
        id: 0,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      },
    ];
    const state = createTestState(seats);

    revealDestination(state, 0);

    expect(state.seats[0].occupant!.destinationRevealed).toBe(false);
  });

  it("handles empty seat gracefully", () => {
    const seats: Seat[] = [
      { id: 0, occupant: null },
      {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      },
    ];
    const state = createTestState(seats);

    const newState = revealDestination(state, 0);

    // Empty seat should remain unchanged
    expect(newState.seats[0].occupant).toBeNull();
  });

  it("handles already revealed destination", () => {
    const seats: Seat[] = [
      {
        id: 0,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: true, characterSprite: 0 },
      },
    ];
    const state = createTestState(seats);

    const newState = revealDestination(state, 0);

    expect(newState.seats[0].occupant!.destinationRevealed).toBe(true);
  });

  it("preserves other state properties", () => {
    const seats: Seat[] = [
      {
        id: 0,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      },
    ];
    const state: GameState = {
      currentStation: 2,
      playerBoardingStation: 1,
      playerDestination: 5,
      playerSeated: true,
      seatId: 1,
      playerStandingSpot: 0,
      seats,
      gameStatus: "playing",
      standingNPCs: [],
      hoveredSeatId: null,
      difficulty: "normal",
      lastClaimMessage: null,
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
      {
        id: 0,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      },
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
    playerStandingSpot: 0,
    seats,
    gameStatus: "playing",
    standingNPCs: [],
    hoveredSeatId: null,
    difficulty: "normal",
    lastClaimMessage: null,
  });

  it("sets playerSeated to true", () => {
    const seats: Seat[] = [
      { id: 0, occupant: null },
      {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      },
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
      {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: true, characterSprite: 0 },
      },
    ];
    const state: GameState = {
      currentStation: 2,
      playerBoardingStation: 1,
      playerDestination: 5,
      playerSeated: false,
      seatId: null,
      playerStandingSpot: 0,
      seats,
      gameStatus: "playing",
      standingNPCs: [],
      hoveredSeatId: null,
      difficulty: "normal",
      lastClaimMessage: null,
    };

    const newState = claimSeat(state, 0);

    expect(newState.currentStation).toBe(2);
    expect(newState.playerBoardingStation).toBe(1);
    expect(newState.playerDestination).toBe(5);
    expect(newState.seats).toBe(state.seats);
    expect(newState.gameStatus).toBe("playing");
  });

  it("clears hoveredSeatId when claiming a seat", () => {
    const seats: Seat[] = [{ id: 0, occupant: null }];
    const state: GameState = {
      ...createTestState(seats),
      hoveredSeatId: 1,
    };

    const newState = claimSeat(state, 0);

    expect(newState.hoveredSeatId).toBeNull();
  });

  it("preserves seats array unchanged", () => {
    const seats: Seat[] = [
      { id: 0, occupant: null },
      {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      },
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
    playerStandingSpot: 0,
    seats,
    gameStatus: "playing",
    standingNPCs: [],
    hoveredSeatId: null,
    difficulty: "easy", // Use easy to avoid standing NPC claims by default
    lastClaimMessage: null,
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
        {
          id: 0,
          occupant: { id: "npc-0", destination: 1, destinationRevealed: false, characterSprite: 0 },
        },
        { id: 1, occupant: null },
      ];
      const state = createTestState(seats, { currentStation: 0 });

      const newState = advanceStation(state);

      expect(newState.seats[0].occupant).toBeNull();
    });

    it("removes NPC whose destination is before new station", () => {
      const seats: Seat[] = [
        {
          id: 0,
          occupant: { id: "npc-0", destination: 1, destinationRevealed: false, characterSprite: 0 },
        },
        { id: 1, occupant: null },
      ];
      const state = createTestState(seats, { currentStation: 1 });

      const newState = advanceStation(state);

      // Station advances to 2, NPC with dest 1 should be removed
      expect(newState.seats[0].occupant).toBeNull();
    });

    it("keeps NPC whose destination is after new station", () => {
      const seats: Seat[] = [
        {
          id: 0,
          occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
        },
        { id: 1, occupant: null },
      ];
      const state = createTestState(seats, { currentStation: 0 });

      const newState = advanceStation(state);

      expect(newState.seats[0].occupant).not.toBeNull();
      expect(newState.seats[0].occupant!.id).toBe("npc-0");
    });

    it("removes multiple NPCs at same station", () => {
      const seats: Seat[] = [
        {
          id: 0,
          occupant: { id: "npc-0", destination: 1, destinationRevealed: false, characterSprite: 0 },
        },
        {
          id: 1,
          occupant: { id: "npc-1", destination: 1, destinationRevealed: true, characterSprite: 1 },
        },
        {
          id: 2,
          occupant: { id: "npc-2", destination: 3, destinationRevealed: false, characterSprite: 2 },
        },
      ];
      const state = createTestState(seats, { currentStation: 0 });

      const newState = advanceStation(state);

      expect(newState.seats[0].occupant).toBeNull();
      expect(newState.seats[1].occupant).toBeNull();
      expect(newState.seats[2].occupant).not.toBeNull();
    });

    it("clears revealed destination info when NPC exits", () => {
      const seats: Seat[] = [
        {
          id: 0,
          occupant: { id: "npc-0", destination: 1, destinationRevealed: true, characterSprite: 0 },
        },
      ];
      const state = createTestState(seats, { currentStation: 0 });

      const newState = advanceStation(state);

      // NPC is removed, so seat is empty
      expect(newState.seats[0].occupant).toBeNull();
    });

    it("keeps empty seats empty", () => {
      const seats: Seat[] = [
        { id: 0, occupant: null },
        {
          id: 1,
          occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
        },
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
        {
          id: 0,
          occupant: { id: "npc-0", destination: 1, destinationRevealed: false, characterSprite: 0 },
        },
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

    it("resets hoveredSeatId after station advance", () => {
      const seats: Seat[] = [{ id: 0, occupant: null }];
      const state = createTestState(seats, {
        hoveredSeatId: 0,
      });

      const newState = advanceStation(state);

      expect(newState.hoveredSeatId).toBeNull();
    });
  });
});

describe("generateStandingNPCs", () => {
  describe("easy difficulty", () => {
    it("generates 0 standing NPCs on easy difficulty", () => {
      for (let i = 0; i < 20; i++) {
        const npcs = generateStandingNPCs("easy");
        expect(npcs).toHaveLength(0);
      }
    });
  });

  describe("normal difficulty", () => {
    it("generates 1-2 standing NPCs on normal difficulty", () => {
      const counts: number[] = [];
      for (let i = 0; i < 50; i++) {
        const npcs = generateStandingNPCs("normal");
        counts.push(npcs.length);
      }
      expect(counts.every((c) => c >= 1 && c <= 2)).toBe(true);
      // Should see both 1 and 2 over 50 runs
      expect(counts.includes(1)).toBe(true);
      expect(counts.includes(2)).toBe(true);
    });
  });

  describe("rush difficulty", () => {
    it("generates 2-3 standing NPCs on rush difficulty", () => {
      const counts: number[] = [];
      for (let i = 0; i < 50; i++) {
        const npcs = generateStandingNPCs("rush");
        counts.push(npcs.length);
      }
      expect(counts.every((c) => c >= 2 && c <= 3)).toBe(true);
      // Should see both 2 and 3 over 50 runs
      expect(counts.includes(2)).toBe(true);
      expect(counts.includes(3)).toBe(true);
    });
  });

  describe("NPC properties", () => {
    it("gives each standing NPC a unique ID", () => {
      const npcs = generateStandingNPCs("rush");
      const ids = npcs.map((npc) => npc.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("assigns IDs with 'standing-npc-' prefix", () => {
      const npcs = generateStandingNPCs("rush");
      npcs.forEach((npc) => {
        expect(npc.id).toMatch(/^standing-npc-\d+$/);
      });
    });

    it("sets targetSeatId to null initially", () => {
      const npcs = generateStandingNPCs("rush");
      npcs.forEach((npc) => {
        expect(npc.targetSeatId).toBeNull();
      });
    });

    it("sets claimPriority between 0 and 1", () => {
      for (let i = 0; i < 20; i++) {
        const npcs = generateStandingNPCs("rush");
        npcs.forEach((npc) => {
          expect(npc.claimPriority).toBeGreaterThanOrEqual(0);
          expect(npc.claimPriority).toBeLessThanOrEqual(1);
        });
      }
    });

    it("sets characterSprite between 0 and 7 (8 available characters)", () => {
      for (let i = 0; i < 20; i++) {
        const npcs = generateStandingNPCs("rush");
        npcs.forEach((npc) => {
          expect(npc.characterSprite).toBeGreaterThanOrEqual(0);
          expect(npc.characterSprite).toBeLessThanOrEqual(7);
        });
      }
    });

    it("assigns standingSpot between 0 and 5", () => {
      const npcs = generateStandingNPCs("rush");
      npcs.forEach((npc) => {
        expect(npc.standingSpot).toBeGreaterThanOrEqual(0);
        expect(npc.standingSpot).toBeLessThanOrEqual(5);
      });
    });

    it("assigns unique standingSpots to each NPC", () => {
      const npcs = generateStandingNPCs("rush");
      const spots = npcs.map((npc) => npc.standingSpot);
      const uniqueSpots = new Set(spots);
      expect(uniqueSpots.size).toBe(spots.length);
    });

    it("respects reserved spots", () => {
      const reservedSpots = [0, 2, 4];
      const npcs = generateStandingNPCs("rush", reservedSpots);
      npcs.forEach((npc) => {
        expect(reservedSpots).not.toContain(npc.standingSpot);
      });
    });
  });
});

describe("generateInitialState standing NPCs", () => {
  it("includes standingNPCs in initial state", () => {
    const state = generateInitialState(0, 5, "normal");
    expect(state.standingNPCs).toBeDefined();
    expect(Array.isArray(state.standingNPCs)).toBe(true);
  });

  it("generates 0 standing NPCs on easy difficulty", () => {
    for (let i = 0; i < 20; i++) {
      const state = generateInitialState(0, 5, "easy");
      expect(state.standingNPCs).toHaveLength(0);
    }
  });

  it("generates 1-2 standing NPCs on normal difficulty", () => {
    const counts: number[] = [];
    for (let i = 0; i < 50; i++) {
      const state = generateInitialState(0, 5, "normal");
      counts.push(state.standingNPCs.length);
    }
    expect(counts.every((c) => c >= 1 && c <= 2)).toBe(true);
  });

  it("generates 2-3 standing NPCs on rush difficulty", () => {
    const counts: number[] = [];
    for (let i = 0; i < 50; i++) {
      const state = generateInitialState(0, 5, "rush");
      counts.push(state.standingNPCs.length);
    }
    expect(counts.every((c) => c >= 2 && c <= 3)).toBe(true);
  });

  it("initializes hoveredSeatId to null", () => {
    const state = generateInitialState(0, 5, "normal");
    expect(state.hoveredSeatId).toBeNull();
  });

  it("stores difficulty in state", () => {
    const state = generateInitialState(0, 5, "rush");
    expect(state.difficulty).toBe("rush");
  });

  it("initializes lastClaimMessage to null", () => {
    const state = generateInitialState(0, 5, "normal");
    expect(state.lastClaimMessage).toBeNull();
  });

  it("assigns playerStandingSpot between 0 and 5", () => {
    for (let i = 0; i < 20; i++) {
      const state = generateInitialState(0, 5, "normal");
      expect(state.playerStandingSpot).toBeGreaterThanOrEqual(0);
      expect(state.playerStandingSpot).toBeLessThanOrEqual(5);
    }
  });

  it("standing NPCs do not occupy player's standing spot", () => {
    for (let i = 0; i < 20; i++) {
      const state = generateInitialState(0, 5, "rush");
      state.standingNPCs.forEach((npc) => {
        expect(npc.standingSpot).not.toBe(state.playerStandingSpot);
      });
    }
  });
});

describe("setHoveredSeat", () => {
  const createTestState = (): GameState => ({
    currentStation: 0,
    playerBoardingStation: 0,
    playerDestination: 5,
    playerSeated: false,
    seatId: null,
    playerStandingSpot: 0,
    seats: [{ id: 0, occupant: null }],
    gameStatus: "playing",
    standingNPCs: [],
    hoveredSeatId: null,
    difficulty: "normal",
    lastClaimMessage: null,
  });

  it("sets hoveredSeatId to the specified seat", () => {
    const state = createTestState();
    const newState = setHoveredSeat(state, 2);
    expect(newState.hoveredSeatId).toBe(2);
  });

  it("clears hoveredSeatId when set to null", () => {
    const state = { ...createTestState(), hoveredSeatId: 2 };
    const newState = setHoveredSeat(state, null);
    expect(newState.hoveredSeatId).toBeNull();
  });

  it("returns new state object (immutable update)", () => {
    const state = createTestState();
    const newState = setHoveredSeat(state, 1);
    expect(newState).not.toBe(state);
  });

  it("does not mutate original state", () => {
    const state = createTestState();
    setHoveredSeat(state, 1);
    expect(state.hoveredSeatId).toBeNull();
  });

  it("preserves other state properties", () => {
    const state: GameState = {
      ...createTestState(),
      currentStation: 2,
      playerSeated: true,
      seatId: 0,
    };
    const newState = setHoveredSeat(state, 3);
    expect(newState.currentStation).toBe(2);
    expect(newState.playerSeated).toBe(true);
    expect(newState.seatId).toBe(0);
  });
});

describe("processStandingNPCClaims", () => {
  const createTestState = (overrides: Partial<GameState> = {}): GameState => ({
    currentStation: 1,
    playerBoardingStation: 0,
    playerDestination: 5,
    playerSeated: false,
    seatId: null,
    playerStandingSpot: 0,
    seats: [
      { id: 0, occupant: null },
      { id: 1, occupant: null },
      {
        id: 2,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      },
    ],
    gameStatus: "playing",
    standingNPCs: [
      {
        id: "standing-0",
        targetSeatId: null,
        claimPriority: 0.5,
        characterSprite: 0,
        standingSpot: 1,
      },
    ],
    hoveredSeatId: null,
    difficulty: "rush", // High claim chance
    lastClaimMessage: null,
    ...overrides,
  });

  describe("player priority", () => {
    it("does not claim seat when player is hovering near it", () => {
      // Force high claim chance
      jest.spyOn(Math, "random").mockReturnValue(0.1); // Below rush's 0.8 threshold

      const state = createTestState({ hoveredSeatId: 0 });
      const newlyEmptySeats = [0];

      const newState = processStandingNPCClaims(state, newlyEmptySeats);

      // Standing NPC should still be present (didn't claim)
      expect(newState.standingNPCs).toHaveLength(1);
      expect(newState.seats[0].occupant).toBeNull();
      expect(newState.lastClaimMessage).toBeNull();

      jest.spyOn(Math, "random").mockRestore();
    });

    it("claims seat when player is not hovering near it", () => {
      // Force successful claim
      jest.spyOn(Math, "random").mockReturnValue(0.1);

      const state = createTestState({ hoveredSeatId: 1 }); // Hovering seat 1, not seat 0
      const newlyEmptySeats = [0];

      const newState = processStandingNPCClaims(state, newlyEmptySeats);

      // Standing NPC should have claimed seat 0
      expect(newState.standingNPCs).toHaveLength(0);
      expect(newState.seats[0].occupant).not.toBeNull();
      expect(newState.lastClaimMessage).toBe("A passenger grabbed the seat!");

      jest.spyOn(Math, "random").mockRestore();
    });
  });

  describe("claim probability", () => {
    it("claims seat when random roll is below difficulty threshold", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.1); // Below 0.8

      const state = createTestState();
      const newlyEmptySeats = [0];

      const newState = processStandingNPCClaims(state, newlyEmptySeats);

      expect(newState.standingNPCs).toHaveLength(0);
      expect(newState.seats[0].occupant).not.toBeNull();

      jest.spyOn(Math, "random").mockRestore();
    });

    it("does not claim seat when random roll is above difficulty threshold", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.9); // Above 0.8

      const state = createTestState();
      const newlyEmptySeats = [0];

      const newState = processStandingNPCClaims(state, newlyEmptySeats);

      expect(newState.standingNPCs).toHaveLength(1);
      expect(newState.seats[0].occupant).toBeNull();

      jest.spyOn(Math, "random").mockRestore();
    });

    it("uses easy difficulty threshold (0.2) correctly", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.3); // Above 0.2

      const state = createTestState({ difficulty: "easy" });
      const newlyEmptySeats = [0];

      const newState = processStandingNPCClaims(state, newlyEmptySeats);

      expect(newState.standingNPCs).toHaveLength(1);
      expect(newState.seats[0].occupant).toBeNull();

      jest.spyOn(Math, "random").mockRestore();
    });

    it("uses normal difficulty threshold (0.5) correctly", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.4); // Below 0.5

      const state = createTestState({ difficulty: "normal" });
      const newlyEmptySeats = [0];

      const newState = processStandingNPCClaims(state, newlyEmptySeats);

      expect(newState.standingNPCs).toHaveLength(0);
      expect(newState.seats[0].occupant).not.toBeNull();

      jest.spyOn(Math, "random").mockRestore();
    });
  });

  describe("standing NPC management", () => {
    it("removes claiming NPC from standingNPCs array", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.1);

      const standingNPCs: StandingNPC[] = [
        {
          id: "standing-0",
          targetSeatId: null,
          claimPriority: 0.5,
          characterSprite: 0,
          standingSpot: 1,
        },
        {
          id: "standing-1",
          targetSeatId: null,
          claimPriority: 0.5,
          characterSprite: 1,
          standingSpot: 2,
        },
      ];
      const state = createTestState({ standingNPCs });
      const newlyEmptySeats = [0];

      const newState = processStandingNPCClaims(state, newlyEmptySeats);

      expect(newState.standingNPCs).toHaveLength(1);
      expect(newState.standingNPCs[0].id).toBe("standing-1");

      jest.spyOn(Math, "random").mockRestore();
    });

    it("only one NPC claims per transition even with multiple empty seats", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.1);

      const standingNPCs: StandingNPC[] = [
        {
          id: "standing-0",
          targetSeatId: null,
          claimPriority: 0.5,
          characterSprite: 0,
          standingSpot: 1,
        },
        {
          id: "standing-1",
          targetSeatId: null,
          claimPriority: 0.5,
          characterSprite: 1,
          standingSpot: 2,
        },
      ];
      const state = createTestState({ standingNPCs });
      const newlyEmptySeats = [0, 1]; // Two empty seats

      const newState = processStandingNPCClaims(state, newlyEmptySeats);

      // Only one NPC should claim
      expect(newState.standingNPCs).toHaveLength(1);
      // Only one seat should be claimed
      const claimedSeats = newState.seats.filter(
        (s) => s.occupant !== null && s.occupant.id.startsWith("standing-")
      );
      expect(claimedSeats).toHaveLength(1);

      jest.spyOn(Math, "random").mockRestore();
    });

    it("does nothing when no standing NPCs", () => {
      const state = createTestState({ standingNPCs: [] });
      const newlyEmptySeats = [0];

      const newState = processStandingNPCClaims(state, newlyEmptySeats);

      expect(newState.seats[0].occupant).toBeNull();
      expect(newState.lastClaimMessage).toBeNull();
    });

    it("does nothing when no newly empty seats", () => {
      const state = createTestState();
      const newlyEmptySeats: number[] = [];

      const newState = processStandingNPCClaims(state, newlyEmptySeats);

      expect(newState.standingNPCs).toHaveLength(1);
      expect(newState.lastClaimMessage).toBeNull();
    });
  });

  describe("claimed seat NPC properties", () => {
    it("creates seated NPC with ID from standing NPC", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.1);

      const state = createTestState();
      const newlyEmptySeats = [0];

      const newState = processStandingNPCClaims(state, newlyEmptySeats);

      expect(newState.seats[0].occupant!.id).toBe("standing-0");

      jest.spyOn(Math, "random").mockRestore();
    });

    it("creates seated NPC with valid destination", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.1);

      const state = createTestState();
      const newlyEmptySeats = [0];

      const newState = processStandingNPCClaims(state, newlyEmptySeats);

      expect(newState.seats[0].occupant!.destination).toBeGreaterThan(state.currentStation);
      expect(newState.seats[0].occupant!.destination).toBeLessThanOrEqual(STATIONS.length - 1);

      jest.spyOn(Math, "random").mockRestore();
    });

    it("creates seated NPC with destinationRevealed false", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.1);

      const state = createTestState();
      const newlyEmptySeats = [0];

      const newState = processStandingNPCClaims(state, newlyEmptySeats);

      expect(newState.seats[0].occupant!.destinationRevealed).toBe(false);

      jest.spyOn(Math, "random").mockRestore();
    });

    it("sets lastClaimMessage when claim succeeds", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.1);

      const state = createTestState();
      const newlyEmptySeats = [0];

      const newState = processStandingNPCClaims(state, newlyEmptySeats);

      expect(newState.lastClaimMessage).toBe("A passenger grabbed the seat!");

      jest.spyOn(Math, "random").mockRestore();
    });

    it("clears lastClaimMessage when no claim happens", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.9); // Above threshold

      const state = createTestState({ lastClaimMessage: "Previous message" });
      const newlyEmptySeats = [0];

      const newState = processStandingNPCClaims(state, newlyEmptySeats);

      expect(newState.lastClaimMessage).toBeNull();

      jest.spyOn(Math, "random").mockRestore();
    });
  });
});

describe("advanceStation with standing NPCs", () => {
  const createTestState = (overrides: Partial<GameState> = {}): GameState => ({
    currentStation: 0,
    playerBoardingStation: 0,
    playerDestination: 5,
    playerSeated: false,
    seatId: null,
    playerStandingSpot: 0,
    seats: [
      {
        id: 0,
        occupant: { id: "npc-0", destination: 1, destinationRevealed: false, characterSprite: 0 },
      },
      { id: 1, occupant: null },
    ],
    gameStatus: "playing",
    standingNPCs: [
      {
        id: "standing-0",
        targetSeatId: null,
        claimPriority: 0.5,
        characterSprite: 0,
        standingSpot: 1,
      },
    ],
    hoveredSeatId: null,
    difficulty: "rush",
    lastClaimMessage: null,
    ...overrides,
  });

  it("standing NPC claims seat when NPC exits", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.1);

    const state = createTestState();
    const newState = advanceStation(state);

    // NPC-0 exits at station 1, standing NPC should claim seat 0
    expect(newState.standingNPCs).toHaveLength(0);
    expect(newState.seats[0].occupant).not.toBeNull();
    expect(newState.seats[0].occupant!.id).toBe("standing-0");

    jest.spyOn(Math, "random").mockRestore();
  });

  it("player keeps priority when hovering near opening seat", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.1);

    const state = createTestState({ hoveredSeatId: 0 });
    const newState = advanceStation(state);

    // Standing NPC should not claim since player was hovering
    expect(newState.standingNPCs).toHaveLength(1);
    expect(newState.seats[0].occupant).toBeNull();

    jest.spyOn(Math, "random").mockRestore();
  });

  it("displays claim message when standing NPC grabs seat", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.1);

    const state = createTestState();
    const newState = advanceStation(state);

    expect(newState.lastClaimMessage).toBe("A passenger grabbed the seat!");

    jest.spyOn(Math, "random").mockRestore();
  });

  it("clears hovered seat after station advance", () => {
    const state = createTestState({ hoveredSeatId: 0 });
    const newState = advanceStation(state);
    expect(newState.hoveredSeatId).toBeNull();
  });
});

describe("previewStationAdvance", () => {
  const createTestState = (overrides: Partial<GameState> = {}): GameState => ({
    currentStation: 0,
    playerBoardingStation: 0,
    playerDestination: 5,
    playerSeated: false,
    seatId: null,
    playerStandingSpot: 0,
    seats: [
      {
        id: 0,
        occupant: { id: "npc-0", destination: 1, destinationRevealed: false, characterSprite: 0 },
      },
      { id: 1, occupant: null },
      {
        id: 2,
        occupant: { id: "npc-1", destination: 3, destinationRevealed: false, characterSprite: 1 },
      },
      { id: 3, occupant: null },
      {
        id: 4,
        occupant: { id: "npc-2", destination: 1, destinationRevealed: false, characterSprite: 2 },
      },
      { id: 5, occupant: null },
    ],
    gameStatus: "playing",
    standingNPCs: [
      {
        id: "standing-0",
        targetSeatId: null,
        claimPriority: 0.5,
        characterSprite: 3,
        standingSpot: 1,
      },
    ],
    hoveredSeatId: null,
    difficulty: "rush",
    lastClaimMessage: null,
    ...overrides,
  });

  it("identifies NPCs that will depart at next station", () => {
    const state = createTestState();
    const preview = previewStationAdvance(state);

    // NPCs at seats 0 and 4 have destination 1, which is the next station
    expect(preview.departingNpcIds).toContain("npc-0");
    expect(preview.departingNpcIds).toContain("npc-2");
    expect(preview.departingNpcIds).not.toContain("npc-1");
  });

  it("returns empty departing list when no NPCs leave", () => {
    const state = createTestState({
      seats: [
        {
          id: 0,
          occupant: { id: "npc-0", destination: 5, destinationRevealed: false, characterSprite: 0 },
        },
        { id: 1, occupant: null },
        { id: 2, occupant: null },
        { id: 3, occupant: null },
        { id: 4, occupant: null },
        { id: 5, occupant: null },
      ],
    });
    const preview = previewStationAdvance(state);

    expect(preview.departingNpcIds).toEqual([]);
  });

  it("skips seat that player hovers near when claiming", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.1); // Would normally claim

    // Create state where only seat 0 becomes empty
    const state = createTestState({
      hoveredSeatId: 0,
      seats: [
        {
          id: 0,
          occupant: { id: "npc-0", destination: 1, destinationRevealed: false, characterSprite: 0 },
        },
        { id: 1, occupant: null },
        {
          id: 2,
          occupant: { id: "npc-1", destination: 5, destinationRevealed: false, characterSprite: 1 },
        },
        { id: 3, occupant: null },
        {
          id: 4,
          occupant: { id: "npc-2", destination: 5, destinationRevealed: false, characterSprite: 2 },
        },
        { id: 5, occupant: null },
      ],
    });
    const preview = previewStationAdvance(state);

    // Player is hovering near seat 0, which is the only seat that will become empty
    // So NPC should not claim any seat
    expect(preview.claimingNpcId).toBeNull();
    expect(preview.claimedSeatId).toBeNull();

    jest.spyOn(Math, "random").mockRestore();
  });

  it("identifies claiming NPC when random roll succeeds", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.1); // Below rush hour 0.8 threshold

    const state = createTestState();
    const preview = previewStationAdvance(state);

    expect(preview.claimingNpcId).toBe("standing-0");

    jest.spyOn(Math, "random").mockRestore();
  });

  it("does not identify claiming NPC when random roll fails", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.9); // Above rush hour 0.8 threshold

    const state = createTestState();
    const preview = previewStationAdvance(state);

    expect(preview.claimingNpcId).toBeNull();

    jest.spyOn(Math, "random").mockRestore();
  });

  it("returns null claiming NPC when no standing NPCs exist", () => {
    const state = createTestState({ standingNPCs: [] });
    const preview = previewStationAdvance(state);

    expect(preview.claimingNpcId).toBeNull();
    expect(preview.claimedSeatId).toBeNull();
  });

  it("identifies which seat is being claimed", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.1);

    const state = createTestState();
    const preview = previewStationAdvance(state);

    // Seat 0 or 4 should be claimed (whichever is first in iteration)
    expect([0, 4]).toContain(preview.claimedSeatId);

    jest.spyOn(Math, "random").mockRestore();
  });
});
