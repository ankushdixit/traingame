import {
  STATIONS,
  STATIONS_SHORT,
  STATIONS_FULL,
  getDestinationOptions,
  getStations,
  TOTAL_SEATS,
  DIFFICULTY_CONFIGS,
  DEFAULT_DIFFICULTY,
  DEFAULT_LINE,
  BOARDING_STATIONS,
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

    it("has 6 seated NPCs (all seats full)", () => {
      expect(config.seatedNpcRange).toEqual([6, 6]);
    });

    it("has 2-3 standing NPCs range", () => {
      expect(config.standingNpcRange).toEqual([2, 3]);
    });

    it("has NPC response time configuration", () => {
      expect(config.npcResponseTime).toBeDefined();
      expect(config.npcResponseTime.min).toBeLessThanOrEqual(config.npcResponseTime.max);
    });
  });

  describe("normal difficulty", () => {
    const config = DIFFICULTY_CONFIGS["normal"];

    it("has correct name and displayName", () => {
      expect(config.name).toBe("normal");
      expect(config.displayName).toBe("Normal");
    });

    it("has 6 seated NPCs (all seats full)", () => {
      expect(config.seatedNpcRange).toEqual([6, 6]);
    });

    it("has 3-4 standing NPCs range", () => {
      expect(config.standingNpcRange).toEqual([3, 4]);
    });

    it("has NPC response time configuration", () => {
      expect(config.npcResponseTime).toBeDefined();
      expect(config.npcResponseTime.min).toBeLessThanOrEqual(config.npcResponseTime.max);
    });
  });

  describe("rush difficulty", () => {
    const config = DIFFICULTY_CONFIGS["rush"];

    it("has correct name and displayName", () => {
      expect(config.name).toBe("rush");
      expect(config.displayName).toBe("Rush Hour");
    });

    it("has 6 seated NPCs (all seats full)", () => {
      expect(config.seatedNpcRange).toEqual([6, 6]);
    });

    it("has 5-6 standing NPCs range", () => {
      expect(config.standingNpcRange).toEqual([5, 6]);
    });

    it("has NPC response time configuration", () => {
      expect(config.npcResponseTime).toBeDefined();
      expect(config.npcResponseTime.min).toBeLessThanOrEqual(config.npcResponseTime.max);
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

describe("STATIONS_SHORT constant", () => {
  it("contains exactly 6 stations", () => {
    expect(STATIONS_SHORT).toHaveLength(6);
  });

  it("has Churchgate as first station", () => {
    expect(STATIONS_SHORT[0]).toBe("Churchgate");
  });

  it("has Dadar as last station", () => {
    expect(STATIONS_SHORT[STATIONS_SHORT.length - 1]).toBe("Dadar");
  });
});

describe("STATIONS_FULL constant", () => {
  it("contains exactly 15 stations", () => {
    expect(STATIONS_FULL).toHaveLength(15);
  });

  it("has Churchgate as first station", () => {
    expect(STATIONS_FULL[0]).toBe("Churchgate");
  });

  it("has Borivali as last station", () => {
    expect(STATIONS_FULL[STATIONS_FULL.length - 1]).toBe("Borivali");
  });

  it("starts with the same stations as STATIONS_SHORT", () => {
    expect(STATIONS_FULL.slice(0, 6)).toEqual([...STATIONS_SHORT]);
  });

  it("contains all expected stations in order", () => {
    expect(STATIONS_FULL).toEqual([
      "Churchgate",
      "Marine Lines",
      "Charni Road",
      "Grant Road",
      "Mumbai Central",
      "Dadar",
      "Matunga Road",
      "Mahim",
      "Bandra",
      "Khar Road",
      "Santacruz",
      "Vile Parle",
      "Andheri",
      "Jogeshwari",
      "Borivali",
    ]);
  });
});

describe("getStations", () => {
  it("returns short line stations for 'short' line", () => {
    const stations = getStations("short");
    expect(stations).toHaveLength(6);
    expect(stations[0]).toBe("Churchgate");
    expect(stations[stations.length - 1]).toBe("Dadar");
  });

  it("returns full line stations for 'full' line", () => {
    const stations = getStations("full");
    expect(stations).toHaveLength(15);
    expect(stations[0]).toBe("Churchgate");
    expect(stations[stations.length - 1]).toBe("Borivali");
  });
});

describe("getDestinationOptions with line parameter", () => {
  it("returns correct destinations for short line from Churchgate", () => {
    const options = getDestinationOptions(0, "short");
    expect(options).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns correct destinations for full line from Churchgate", () => {
    const options = getDestinationOptions(0, "full");
    expect(options).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
    expect(options).toHaveLength(14);
  });

  it("returns correct destinations for full line from Dadar (index 5)", () => {
    const options = getDestinationOptions(5, "full");
    expect(options).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14]);
    expect(options).toHaveLength(9);
  });

  it("returns empty array for last station on full line", () => {
    const options = getDestinationOptions(14, "full");
    expect(options).toEqual([]);
  });

  it("defaults to short line when line parameter is omitted", () => {
    const options = getDestinationOptions(0);
    expect(options).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("DEFAULT_LINE", () => {
  it("is set to short", () => {
    expect(DEFAULT_LINE).toBe("short");
  });
});

describe("BOARDING_STATIONS", () => {
  it("contains major boarding stations", () => {
    expect(BOARDING_STATIONS.has("Dadar")).toBe(true);
    expect(BOARDING_STATIONS.has("Bandra")).toBe(true);
    expect(BOARDING_STATIONS.has("Andheri")).toBe(true);
  });

  it("has exactly 3 major stations", () => {
    expect(BOARDING_STATIONS.size).toBe(3);
  });

  it("does not contain non-major stations", () => {
    expect(BOARDING_STATIONS.has("Churchgate")).toBe(false);
    expect(BOARDING_STATIONS.has("Marine Lines")).toBe(false);
    expect(BOARDING_STATIONS.has("Borivali")).toBe(false);
  });
});

describe("DIFFICULTY_CONFIGS boarding config", () => {
  it("all difficulties have boarding config", () => {
    const difficulties: Difficulty[] = ["easy", "normal", "rush"];
    difficulties.forEach((difficulty) => {
      const config = DIFFICULTY_CONFIGS[difficulty];
      expect(config.boardingConfig).toBeDefined();
      expect(config.boardingConfig.minBoard).toBeGreaterThanOrEqual(0);
      expect(config.boardingConfig.maxBoard).toBeGreaterThanOrEqual(config.boardingConfig.minBoard);
      expect(config.boardingConfig.boardingChance).toBeGreaterThan(0);
      expect(config.boardingConfig.boardingChance).toBeLessThanOrEqual(1);
    });
  });

  it("harder difficulties have higher boarding chances", () => {
    expect(DIFFICULTY_CONFIGS.easy.boardingConfig.boardingChance).toBeLessThan(
      DIFFICULTY_CONFIGS.normal.boardingConfig.boardingChance
    );
    expect(DIFFICULTY_CONFIGS.normal.boardingConfig.boardingChance).toBeLessThan(
      DIFFICULTY_CONFIGS.rush.boardingConfig.boardingChance
    );
  });
});
