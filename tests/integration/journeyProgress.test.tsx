/**
 * Integration Tests for Journey Progress Indicator
 *
 * Tests the progress indicator updates correctly when game state changes.
 */

import { render, screen } from "@testing-library/react";
import { JourneyProgress } from "@/components/game/JourneyProgress";
import { GameHeader } from "@/components/game/GameHeader";
import { generateInitialState, advanceStation } from "@/lib/gameLogic";
import { STATIONS } from "@/lib/constants";

// Mock SoundContext since GameHeader includes SoundToggle
jest.mock("@/contexts/SoundContext", () => ({
  useSound: () => ({
    isMuted: false,
    toggleMute: jest.fn(),
    playSound: jest.fn(),
  }),
}));

describe("Journey Progress Integration", () => {
  describe("progress indicator with game state", () => {
    it("renders correctly with state from generateInitialState", () => {
      const state = generateInitialState(0, 5);

      render(
        <>
          <GameHeader
            currentStation={state.currentStation}
            playerDestination={state.playerDestination}
            difficulty={state.difficulty}
            playerSeated={state.playerSeated}
          />
          <JourneyProgress
            stations={STATIONS}
            currentStation={state.currentStation}
            destination={state.playerDestination}
            boardingStation={state.playerBoardingStation}
          />
        </>
      );

      // Journey progress is rendered
      expect(screen.getByTestId("journey-progress")).toBeInTheDocument();

      // All station dots are rendered
      const dots = screen.getAllByTestId(/^station-dot-\d+$/);
      expect(dots).toHaveLength(6);

      // Current station (0) is highlighted
      const currentDot = screen.getByTestId("station-dot-0");
      expect(currentDot).toHaveClass("bg-blue-500");

      // Destination (5) is marked
      const destDot = screen.getByTestId("station-dot-5");
      expect(destDot).toHaveClass("bg-red-500");
    });
  });

  describe("progress updates when station advances", () => {
    it("updates current station marker when advancing", () => {
      let state = generateInitialState(0, 5);

      const { rerender } = render(
        <JourneyProgress
          stations={STATIONS}
          currentStation={state.currentStation}
          destination={state.playerDestination}
          boardingStation={state.playerBoardingStation}
        />
      );

      // Initial: station 0 is current
      let currentDot = screen.getByTestId("station-dot-0");
      expect(currentDot).toHaveClass("bg-blue-500");

      // Advance station
      state = advanceStation(state);

      rerender(
        <JourneyProgress
          stations={STATIONS}
          currentStation={state.currentStation}
          destination={state.playerDestination}
          boardingStation={state.playerBoardingStation}
        />
      );

      // After advance: station 1 is current, station 0 is passed
      const passedDot = screen.getByTestId("station-dot-0");
      expect(passedDot).toHaveClass("bg-emerald-500");

      currentDot = screen.getByTestId("station-dot-1");
      expect(currentDot).toHaveClass("bg-blue-500");
    });

    it("shows urgency when one station from destination", () => {
      let state = generateInitialState(0, 5);

      const { rerender } = render(
        <JourneyProgress
          stations={STATIONS}
          currentStation={state.currentStation}
          destination={state.playerDestination}
          boardingStation={state.playerBoardingStation}
        />
      );

      // Initially no urgency (5 stations away)
      let currentDot = screen.getByTestId("station-dot-0");
      expect(currentDot).not.toHaveClass("animate-pulse");

      // Advance to station 4 (1 station from destination 5)
      state = advanceStation(state); // 1
      state = advanceStation(state); // 2
      state = advanceStation(state); // 3
      state = advanceStation(state); // 4

      rerender(
        <JourneyProgress
          stations={STATIONS}
          currentStation={state.currentStation}
          destination={state.playerDestination}
          boardingStation={state.playerBoardingStation}
        />
      );

      // Now urgency should be visible (pulse animation)
      currentDot = screen.getByTestId("station-dot-4");
      expect(currentDot).toHaveClass("animate-pulse");
    });

    it("urgency disappears when at destination", () => {
      let state = generateInitialState(4, 5); // Start 1 station away

      const { rerender } = render(
        <JourneyProgress
          stations={STATIONS}
          currentStation={state.currentStation}
          destination={state.playerDestination}
          boardingStation={state.playerBoardingStation}
        />
      );

      // Urgency is visible
      let currentDot = screen.getByTestId("station-dot-4");
      expect(currentDot).toHaveClass("animate-pulse");

      // Advance to destination
      state = advanceStation(state);

      rerender(
        <JourneyProgress
          stations={STATIONS}
          currentStation={state.currentStation}
          destination={state.playerDestination}
          boardingStation={state.playerBoardingStation}
        />
      );

      // Urgency should be gone (at destination)
      currentDot = screen.getByTestId("station-dot-5");
      expect(currentDot).not.toHaveClass("animate-pulse");
    });
  });

  describe("complete journey simulation", () => {
    it("tracks full journey from Churchgate to Dadar", () => {
      let state = generateInitialState(0, 5);

      const { rerender } = render(
        <JourneyProgress
          stations={STATIONS}
          currentStation={state.currentStation}
          destination={state.playerDestination}
          boardingStation={state.playerBoardingStation}
        />
      );

      // Verify initial state
      const dots = screen.getAllByTestId(/^station-dot-\d+$/);
      expect(dots).toHaveLength(6);

      let currentDot = screen.getByTestId("station-dot-0");
      expect(currentDot).toHaveClass("bg-blue-500");

      // Advance through each station
      for (let i = 1; i <= 5; i++) {
        state = advanceStation(state);

        rerender(
          <JourneyProgress
            stations={STATIONS}
            currentStation={state.currentStation}
            destination={state.playerDestination}
            boardingStation={state.playerBoardingStation}
          />
        );

        // Current station is marked
        currentDot = screen.getByTestId(`station-dot-${i}`);
        expect(currentDot).toHaveClass("bg-blue-500");

        // Previous stations are passed (emerald)
        for (let j = 0; j < i; j++) {
          const passedDot = screen.getByTestId(`station-dot-${j}`);
          expect(passedDot).toHaveClass("bg-emerald-500");
        }

        // Check urgency at station 4 (1 away from 5)
        if (i === 4) {
          expect(currentDot).toHaveClass("animate-pulse");
        }
      }
    });
  });

  describe("different boarding/destination combinations", () => {
    it.each([
      [0, 5, 5], // Churchgate to Dadar, 5 stations journey
      [0, 3, 3], // Churchgate to Grant Road, 3 stations
      [1, 5, 4], // Marine Lines to Dadar, 4 stations
      [2, 4, 2], // Charni Road to Mumbai Central, 2 stations
      [4, 5, 1], // Mumbai Central to Dadar, 1 station (immediate urgency)
    ])(
      "correctly renders journey from station %i to %i (%i stops)",
      (boarding, destination, stopsCount) => {
        const state = generateInitialState(boarding, destination);

        render(
          <JourneyProgress
            stations={STATIONS}
            currentStation={state.currentStation}
            destination={state.playerDestination}
            boardingStation={state.playerBoardingStation}
          />
        );

        // Boarding station is current
        const currentDot = screen.getByTestId(`station-dot-${boarding}`);
        expect(currentDot).toHaveClass("bg-blue-500");

        // Destination is marked
        const destDot = screen.getByTestId(`station-dot-${destination}`);
        expect(destDot).toHaveClass("bg-red-500");

        // Check urgency for 1-stop journeys
        if (stopsCount === 1) {
          expect(currentDot).toHaveClass("animate-pulse");
        } else {
          expect(currentDot).not.toHaveClass("animate-pulse");
        }
      }
    );
  });
});
