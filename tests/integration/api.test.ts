/**
 * Integration Tests
 *
 * Tests API endpoints via HTTP requests.
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

import { GET } from "@/app/api/health/route";

describe("Health Check API Integration Tests", () => {
  it("returns full HTTP response cycle with correct status code", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
  });

  it("returns correct headers in response", async () => {
    const response = await GET();

    const contentType = response.headers.get("content-type");
    expect(contentType).toBe("application/json");
  });

  it("returns correct JSON body structure", async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toEqual({
      status: "ok",
      timestamp: expect.any(String),
    });
  });

  it("responds within performance threshold", async () => {
    const startTime = performance.now();
    await GET();
    const endTime = performance.now();

    const responseTime = endTime - startTime;
    // Response time should be under 100ms as per spec
    expect(responseTime).toBeLessThan(100);
  });
});
