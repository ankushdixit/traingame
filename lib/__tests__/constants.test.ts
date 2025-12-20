import { STATIONS, getDestinationOptions } from "../constants";

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
