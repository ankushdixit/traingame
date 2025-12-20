/**
 * Integration Tests for Game View
 *
 * Tests the complete game view rendering with generated state.
 */

import { render, screen } from "@testing-library/react";
import { Compartment } from "@/components/game/Compartment";
import { GameHeader } from "@/components/game/GameHeader";
import { PlayerStatus } from "@/components/game/PlayerStatus";
import { generateInitialState } from "@/lib/gameLogic";
import { STATIONS } from "@/lib/constants";

describe("Game View Integration", () => {
  describe("full game view with generated state", () => {
    it("renders all components with state from generateInitialState", () => {
      const state = generateInitialState(0, 5);

      render(
        <>
          <GameHeader
            currentStation={state.currentStation}
            playerDestination={state.playerDestination}
          />
          <Compartment seats={state.seats} playerSeatId={state.seatId} />
          <PlayerStatus isSeated={state.playerSeated} />
        </>
      );

      // Header is rendered
      expect(screen.getByTestId("game-header")).toBeInTheDocument();
      expect(screen.getByTestId("current-station")).toHaveTextContent("Churchgate");

      // Compartment is rendered with 6 seats
      expect(screen.getByTestId("compartment")).toBeInTheDocument();
      for (let i = 0; i < 6; i++) {
        expect(screen.getByTestId(`seat-${i}`)).toBeInTheDocument();
      }

      // Player status is rendered
      expect(screen.getByTestId("player-status")).toBeInTheDocument();
      expect(screen.getByTestId("standing-status")).toBeInTheDocument();
    });

    it("correctly reflects occupied seats from generated state", () => {
      const state = generateInitialState(0, 5);

      render(<Compartment seats={state.seats} playerSeatId={state.seatId} />);

      const occupiedCount = state.seats.filter((s) => s.occupant !== null).length;
      const emptyCount = state.seats.filter((s) => s.occupant === null).length;

      // Count seats by state in rendered output
      let renderedOccupied = 0;
      let renderedEmpty = 0;

      for (let i = 0; i < 6; i++) {
        const seatState = screen.getByTestId(`seat-${i}`).getAttribute("data-state");
        if (seatState === "occupied") {
          renderedOccupied++;
        } else if (seatState === "empty") {
          renderedEmpty++;
        }
      }

      expect(renderedOccupied).toBe(occupiedCount);
      expect(renderedEmpty).toBe(emptyCount);
    });
  });

  describe("state changes reflect in UI", () => {
    it("player seat is highlighted when playerSeatId is set", () => {
      const state = generateInitialState(0, 5);

      // Find an empty seat
      const emptySeat = state.seats.find((s) => s.occupant === null);
      expect(emptySeat).toBeDefined();

      // Simulate player sitting
      const seatedState = {
        ...state,
        playerSeated: true,
        seatId: emptySeat!.id,
      };

      render(
        <>
          <Compartment seats={seatedState.seats} playerSeatId={seatedState.seatId} />
          <PlayerStatus isSeated={seatedState.playerSeated} />
        </>
      );

      // Player's seat should be highlighted
      expect(screen.getByTestId(`seat-${emptySeat!.id}`)).toHaveAttribute("data-state", "player");

      // Player status should show seated
      expect(screen.getByTestId("seated-status")).toHaveTextContent("You are seated!");
    });

    it("revealed destination shows different state", () => {
      const state = generateInitialState(0, 5);

      // Find an occupied seat and reveal its destination
      const occupiedSeat = state.seats.find((s) => s.occupant !== null);
      expect(occupiedSeat).toBeDefined();

      const revealedSeats = state.seats.map((s) =>
        s.id === occupiedSeat!.id
          ? { ...s, occupant: { ...s.occupant!, destinationRevealed: true } }
          : s
      );

      render(<Compartment seats={revealedSeats} playerSeatId={null} />);

      expect(screen.getByTestId(`seat-${occupiedSeat!.id}`)).toHaveAttribute(
        "data-state",
        "occupied-known"
      );
    });
  });

  describe("header accuracy with various boarding stations", () => {
    it.each([
      [0, 5, "Churchgate", "Next: Marine Lines", "Dadar", 5],
      [1, 5, "Marine Lines", "Next: Charni Road", "Dadar", 4],
      [2, 5, "Charni Road", "Next: Grant Road", "Dadar", 3],
      [3, 5, "Grant Road", "Next: Mumbai Central", "Dadar", 2],
      [4, 5, "Mumbai Central", "Final: Dadar", "Dadar", 1],
    ])(
      "displays correct info for boarding=%i, destination=%i",
      (boarding, destination, expectedCurrent, expectedNext, expectedDest, expectedRemaining) => {
        render(<GameHeader currentStation={boarding} playerDestination={destination} />);

        expect(screen.getByTestId("current-station")).toHaveTextContent(expectedCurrent);
        expect(screen.getByTestId("next-station")).toHaveTextContent(expectedNext);
        expect(screen.getByTestId("destination")).toHaveTextContent(
          `Your destination: ${expectedDest}`
        );
        expect(screen.getByTestId("remaining-stations")).toHaveTextContent(
          `${expectedRemaining} station`
        );
      }
    );
  });

  describe("game view handles all boarding/destination combinations", () => {
    it("renders correctly for each valid boarding station", () => {
      for (let boarding = 0; boarding < STATIONS.length - 1; boarding++) {
        const destination = STATIONS.length - 1; // Always to Dadar
        const state = generateInitialState(boarding, destination);

        const { unmount } = render(
          <>
            <GameHeader
              currentStation={state.currentStation}
              playerDestination={state.playerDestination}
            />
            <Compartment seats={state.seats} playerSeatId={state.seatId} />
            <PlayerStatus isSeated={state.playerSeated} />
          </>
        );

        expect(screen.getByTestId("current-station")).toHaveTextContent(STATIONS[boarding]);
        expect(screen.getByTestId("compartment")).toBeInTheDocument();

        unmount();
      }
    });
  });
});
