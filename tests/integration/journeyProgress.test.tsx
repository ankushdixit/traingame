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

      // All stations are rendered
      expect(screen.getAllByTestId("station-marker")).toHaveLength(6);

      // Current station (0) is highlighted
      const markerDots = screen.getAllByTestId("marker-dot");
      expect(markerDots[0]).toHaveAttribute("data-current", "true");

      // Destination (5) is marked
      expect(markerDots[5]).toHaveAttribute("data-destination", "true");
    });

    it("syncs with GameHeader remaining stations count", () => {
      const state = generateInitialState(2, 5);

      render(
        <>
          <GameHeader
            currentStation={state.currentStation}
            playerDestination={state.playerDestination}
            difficulty={state.difficulty}
          />
          <JourneyProgress
            stations={STATIONS}
            currentStation={state.currentStation}
            destination={state.playerDestination}
            boardingStation={state.playerBoardingStation}
          />
        </>
      );

      // Header shows 3 remaining
      expect(screen.getByTestId("remaining-stations")).toHaveTextContent("3 stations remaining");

      // Progress indicator should show 2 passed, 1 current, 3 future (including destination)
      const markerDots = screen.getAllByTestId("marker-dot");

      // Passed: 0, 1
      expect(markerDots[0]).toHaveAttribute("data-passed", "true");
      expect(markerDots[1]).toHaveAttribute("data-passed", "true");

      // Current: 2
      expect(markerDots[2]).toHaveAttribute("data-current", "true");

      // Future (not passed): 3, 4, 5
      expect(markerDots[3]).toHaveAttribute("data-passed", "false");
      expect(markerDots[4]).toHaveAttribute("data-passed", "false");
      expect(markerDots[5]).toHaveAttribute("data-passed", "false");
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
      let markerDots = screen.getAllByTestId("marker-dot");
      expect(markerDots[0]).toHaveAttribute("data-current", "true");
      expect(markerDots[1]).toHaveAttribute("data-current", "false");

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
      markerDots = screen.getAllByTestId("marker-dot");
      expect(markerDots[0]).toHaveAttribute("data-current", "false");
      expect(markerDots[0]).toHaveAttribute("data-passed", "true");
      expect(markerDots[1]).toHaveAttribute("data-current", "true");
    });

    it("updates progress line width when advancing", () => {
      let state = generateInitialState(0, 5);

      const { rerender } = render(
        <JourneyProgress
          stations={STATIONS}
          currentStation={state.currentStation}
          destination={state.playerDestination}
          boardingStation={state.playerBoardingStation}
        />
      );

      // Initial: 0% progress
      let progressLine = screen.getByTestId("progress-line");
      expect(progressLine).toHaveStyle({ width: "0%" });

      // Advance to station 2 (40%)
      state = advanceStation(state);
      state = advanceStation(state);

      rerender(
        <JourneyProgress
          stations={STATIONS}
          currentStation={state.currentStation}
          destination={state.playerDestination}
          boardingStation={state.playerBoardingStation}
        />
      );

      progressLine = screen.getByTestId("progress-line");
      expect(progressLine).toHaveStyle({ width: "40%" });
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
      expect(screen.queryByTestId("urgency-message")).not.toBeInTheDocument();

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

      // Now urgency should be visible
      expect(screen.getByTestId("urgency-message")).toBeInTheDocument();
      expect(screen.getByTestId("urgency-message")).toHaveTextContent(
        "Next stop is your destination!"
      );

      // Destination marker should have urgent styling
      const markerDots = screen.getAllByTestId("marker-dot");
      expect(markerDots[5]).toHaveAttribute("data-urgent", "true");
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
      expect(screen.getByTestId("urgency-message")).toBeInTheDocument();

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

      // Urgency should be gone
      expect(screen.queryByTestId("urgency-message")).not.toBeInTheDocument();
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
      expect(screen.getAllByTestId("station-marker")).toHaveLength(6);
      let markerDots = screen.getAllByTestId("marker-dot");
      expect(markerDots[0]).toHaveAttribute("data-current", "true");

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

        markerDots = screen.getAllByTestId("marker-dot");

        // Current station is marked
        expect(markerDots[i]).toHaveAttribute("data-current", "true");

        // Previous stations are passed
        for (let j = 0; j < i; j++) {
          expect(markerDots[j]).toHaveAttribute("data-passed", "true");
        }

        // Check urgency at station 4 (1 away from 5)
        if (i === 4) {
          expect(screen.getByTestId("urgency-message")).toBeInTheDocument();
        } else {
          expect(screen.queryByTestId("urgency-message")).not.toBeInTheDocument();
        }
      }

      // Final state: at destination
      markerDots = screen.getAllByTestId("marker-dot");
      expect(markerDots[5]).toHaveAttribute("data-current", "true");
      expect(markerDots[5]).toHaveAttribute("data-destination", "true");
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

        const markerDots = screen.getAllByTestId("marker-dot");

        // Boarding station is current
        expect(markerDots[boarding]).toHaveAttribute("data-current", "true");

        // Destination is marked
        expect(markerDots[destination]).toHaveAttribute("data-destination", "true");

        // Check urgency for 1-stop journeys
        if (stopsCount === 1) {
          expect(screen.getByTestId("urgency-message")).toBeInTheDocument();
        } else {
          expect(screen.queryByTestId("urgency-message")).not.toBeInTheDocument();
        }
      }
    );
  });

  describe("labels visibility during journey", () => {
    it("always shows current station label", () => {
      let state = generateInitialState(0, 5);

      const { rerender } = render(
        <JourneyProgress
          stations={STATIONS}
          currentStation={state.currentStation}
          destination={state.playerDestination}
          boardingStation={state.playerBoardingStation}
        />
      );

      // Initial: Churchgate label visible
      expect(screen.getByText("Churchgate")).toBeInTheDocument();

      // Advance to Grant Road
      state = advanceStation(state);
      state = advanceStation(state);
      state = advanceStation(state);

      rerender(
        <JourneyProgress
          stations={STATIONS}
          currentStation={state.currentStation}
          destination={state.playerDestination}
          boardingStation={state.playerBoardingStation}
        />
      );

      // Grant Road label visible
      expect(screen.getByText("Grant Road")).toBeInTheDocument();
    });

    it("always shows destination label", () => {
      const state = generateInitialState(0, 5);

      render(
        <JourneyProgress
          stations={STATIONS}
          currentStation={state.currentStation}
          destination={state.playerDestination}
          boardingStation={state.playerBoardingStation}
        />
      );

      // Dadar label is always visible
      expect(screen.getByText("Dadar")).toBeInTheDocument();
    });

    it("shows boarding station label even after passing it", () => {
      let state = generateInitialState(0, 5);

      // Advance past boarding station
      state = advanceStation(state);
      state = advanceStation(state);

      render(
        <JourneyProgress
          stations={STATIONS}
          currentStation={state.currentStation}
          destination={state.playerDestination}
          boardingStation={state.playerBoardingStation}
        />
      );

      // Churchgate (boarding) label still visible
      expect(screen.getByText("Churchgate")).toBeInTheDocument();
    });
  });
});
