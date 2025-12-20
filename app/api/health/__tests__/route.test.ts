/**
 * Health Check API Tests
 *
 * Note: We mock NextResponse because the Web APIs (Request, Response)
 * are not available in the Jest/jsdom environment.
 */

// Mock NextResponse before importing the route
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => data,
      headers: new Map([["content-type", "application/json"]]),
    })),
  },
}));

import { GET } from "../route";

describe("Health Check API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns ok status with 200 status code", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("ok");
  });

  it("includes valid ISO 8601 timestamp in response", async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.timestamp).toBeDefined();
    // Verify it's a valid ISO 8601 date
    const parsedDate = new Date(data.timestamp);
    expect(parsedDate.getTime()).not.toBeNaN();
    // Verify the format is ISO 8601
    expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
  });

  it("returns correct response structure", async () => {
    const response = await GET();
    const data = await response.json();

    // Verify exact shape matches spec: { status: "ok", timestamp: "<ISO date>" }
    expect(Object.keys(data).sort()).toEqual(["status", "timestamp"]);
  });

  it("returns application/json content type", async () => {
    const response = await GET();

    expect(response.headers.get("content-type")).toBe("application/json");
  });
});
