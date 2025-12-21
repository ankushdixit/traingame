import {
  STATIONS,
  getDestinationOptions,
  TOTAL_SEATS,
  DIFFICULTY_CONFIGS,
  DEFAULT_DIFFICULTY,
} from "../constants";
import { Difficulty } from "../types";

describe("STATIONS constant", () => {
  it("contains exactly 6 stations", () => {
    expect(STATIONS).toHaveLength(6);
  });

  it("has Churchgate as first station", () => {
    expect(STATIONS[0]).toBe("Churchgate");
  });

  it("has Dadar as last station", () => {
    expect(STATIONS[STATIONS.length - 1]).toBe("Dadar");
  });

  it("contains all expected stations in order", () => {
    expect(STATIONS).toEqual([
      "Churchgate",
      "Marine Lines",
      "Charni Road",
      "Grant Road",
      "Mumbai Central",
      "Dadar",
    ]);
  });
});

describe("getDestinationOptions", () => {
  it("returns all stations after Churchgate (index 0)", () => {
    const options = getDestinationOptions(0);
    expect(options).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns all stations after Marine Lines (index 1)", () => {
    const options = getDestinationOptions(1);
    expect(options).toEqual([2, 3, 4, 5]);
  });

  it("returns only Dadar after Mumbai Central (index 4)", () => {
    const options = getDestinationOptions(4);
    expect(options).toEqual([5]);
  });

  it("returns empty array for Dadar (last station, index 5)", () => {
    const options = getDestinationOptions(5);
    expect(options).toEqual([]);
  });

  it("returns correct number of destinations for each boarding station", () => {
    expect(getDestinationOptions(0)).toHaveLength(5); // Churchgate -> 5 destinations
    expect(getDestinationOptions(1)).toHaveLength(4); // Marine Lines -> 4 destinations
    expect(getDestinationOptions(2)).toHaveLength(3); // Charni Road -> 3 destinations
    expect(getDestinationOptions(3)).toHaveLength(2); // Grant Road -> 2 destinations
    expect(getDestinationOptions(4)).toHaveLength(1); // Mumbai Central -> 1 destination
  });
});

describe("TOTAL_SEATS constant", () => {
  it("equals 6", () => {
    expect(TOTAL_SEATS).toBe(6);
  });
});

describe("DIFFICULTY_CONFIGS", () => {
  it("contains all three difficulty levels", () => {
    expect(Object.keys(DIFFICULTY_CONFIGS)).toEqual(["easy", "normal", "rush"]);
  });

  describe("easy difficulty", () => {
    const config = DIFFICULTY_CONFIGS["easy"];

    it("has correct name and displayName", () => {
      expect(config.name).toBe("easy");
      expect(config.displayName).toBe("Easy");
    });

    it("has 3-4 seated NPCs range", () => {
      expect(config.seatedNpcRange).toEqual([3, 4]);
    });

    it("has 0-0 standing NPCs range", () => {
      expect(config.standingNpcRange).toEqual([0, 0]);
    });

    it("has low NPC claim chance", () => {
      expect(config.npcClaimChance).toBe(0.2);
    });
  });

  describe("normal difficulty", () => {
    const config = DIFFICULTY_CONFIGS["normal"];

    it("has correct name and displayName", () => {
      expect(config.name).toBe("normal");
      expect(config.displayName).toBe("Normal");
    });

    it("has exactly 5 seated NPCs", () => {
      expect(config.seatedNpcRange).toEqual([5, 5]);
    });

    it("has 1-2 standing NPCs range", () => {
      expect(config.standingNpcRange).toEqual([1, 2]);
    });

    it("has medium NPC claim chance", () => {
      expect(config.npcClaimChance).toBe(0.5);
    });
  });

  describe("rush difficulty", () => {
    const config = DIFFICULTY_CONFIGS["rush"];

    it("has correct name and displayName", () => {
      expect(config.name).toBe("rush");
      expect(config.displayName).toBe("Rush Hour");
    });

    it("has exactly 6 seated NPCs", () => {
      expect(config.seatedNpcRange).toEqual([6, 6]);
    });

    it("has 2-3 standing NPCs range", () => {
      expect(config.standingNpcRange).toEqual([2, 3]);
    });

    it("has high NPC claim chance", () => {
      expect(config.npcClaimChance).toBe(0.8);
    });
  });

  it("all configurations have valid NPC ranges within seat limits", () => {
    const difficulties: Difficulty[] = ["easy", "normal", "rush"];
    difficulties.forEach((difficulty) => {
      const config = DIFFICULTY_CONFIGS[difficulty];
      expect(config.seatedNpcRange[0]).toBeGreaterThanOrEqual(0);
      expect(config.seatedNpcRange[0]).toBeLessThanOrEqual(config.seatedNpcRange[1]);
      expect(config.seatedNpcRange[1]).toBeLessThanOrEqual(TOTAL_SEATS);
    });
  });
});

describe("DEFAULT_DIFFICULTY", () => {
  it("is set to normal", () => {
    expect(DEFAULT_DIFFICULTY).toBe("normal");
  });

  it("references a valid difficulty in DIFFICULTY_CONFIGS", () => {
    expect(DIFFICULTY_CONFIGS[DEFAULT_DIFFICULTY]).toBeDefined();
  });
});
