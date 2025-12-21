/**
 * Integration Tests for Game View
 *
 * Tests the complete game view rendering with generated state.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { Compartment } from "@/components/game/Compartment";
import { GameHeader } from "@/components/game/GameHeader";
import { PlayerStatus } from "@/components/game/PlayerStatus";
import { generateInitialState, revealDestination } from "@/lib/gameLogic";
import { STATIONS } from "@/lib/constants";

// Mock SoundContext since GameHeader includes SoundToggle
jest.mock("@/contexts/SoundContext", () => ({
  useSound: () => ({
    isMuted: false,
    toggleMute: jest.fn(),
    playSound: jest.fn(),
  }),
}));

const defaultHandlers = {
  onRevealDestination: jest.fn(),
  onClaimSeat: jest.fn(),
  onHoverNear: jest.fn(),
  hoveredSeatId: null,
};

describe("Game View Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("full game view with generated state", () => {
    it("renders all components with state from generateInitialState", () => {
      const state = generateInitialState(0, 5);

      render(
        <>
          <GameHeader
            currentStation={state.currentStation}
            playerDestination={state.playerDestination}
            difficulty={state.difficulty}
          />
          <Compartment
            seats={state.seats}
            playerSeatId={state.seatId}
            isPlayerSeated={state.playerSeated}
            {...defaultHandlers}
          />
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

      render(
        <Compartment
          seats={state.seats}
          playerSeatId={state.seatId}
          isPlayerSeated={state.playerSeated}
          {...defaultHandlers}
        />
      );

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
          <Compartment
            seats={seatedState.seats}
            playerSeatId={seatedState.seatId}
            isPlayerSeated={seatedState.playerSeated}
            {...defaultHandlers}
          />
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

      render(
        <Compartment
          seats={revealedSeats}
          playerSeatId={null}
          isPlayerSeated={false}
          {...defaultHandlers}
        />
      );

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
        render(
          <GameHeader
            currentStation={boarding}
            playerDestination={destination}
            difficulty="normal"
          />
        );

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
              difficulty={state.difficulty}
            />
            <Compartment
              seats={state.seats}
              playerSeatId={state.seatId}
              isPlayerSeated={state.playerSeated}
              {...defaultHandlers}
            />
            <PlayerStatus isSeated={state.playerSeated} />
          </>
        );

        expect(screen.getByTestId("current-station")).toHaveTextContent(STATIONS[boarding]);
        expect(screen.getByTestId("compartment")).toBeInTheDocument();

        unmount();
      }
    });
  });

  describe("reveal destination flow integration", () => {
    it("full reveal flow: click seat → click ask → state updates", () => {
      let state = generateInitialState(0, 5);

      // Find an occupied seat
      const occupiedSeat = state.seats.find((s) => s.occupant !== null);
      expect(occupiedSeat).toBeDefined();
      const seatId = occupiedSeat!.id;

      const onRevealDestination = jest.fn((id: number) => {
        state = revealDestination(state, id);
      });

      const { rerender } = render(
        <Compartment
          seats={state.seats}
          playerSeatId={null}
          isPlayerSeated={false}
          hoveredSeatId={null}
          onRevealDestination={onRevealDestination}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
        />
      );

      // Initial state: seat is occupied but destination not revealed
      expect(screen.getByTestId(`seat-${seatId}`)).toHaveAttribute("data-state", "occupied");

      // Click the seat to open popover
      fireEvent.click(screen.getByTestId(`seat-${seatId}`));

      // Popover should show "Ask destination?" button
      expect(screen.getByTestId("ask-destination-button")).toBeInTheDocument();

      // Click the button
      fireEvent.click(screen.getByTestId("ask-destination-button"));

      // Handler should be called with seat id
      expect(onRevealDestination).toHaveBeenCalledWith(seatId);

      // Rerender with updated state
      rerender(
        <Compartment
          seats={state.seats}
          playerSeatId={null}
          isPlayerSeated={false}
          hoveredSeatId={null}
          onRevealDestination={onRevealDestination}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
        />
      );

      // Now the seat should show "occupied-known" state
      expect(screen.getByTestId(`seat-${seatId}`)).toHaveAttribute("data-state", "occupied-known");

      // And the destination should be displayed in the speech bubble
      expect(screen.getByTestId("speech-bubble")).toBeInTheDocument();
    });

    it("revealed state persists across interactions", () => {
      let state = generateInitialState(0, 5);

      // Find first two occupied seats
      const occupiedSeats = state.seats.filter((s) => s.occupant !== null);
      expect(occupiedSeats.length).toBeGreaterThanOrEqual(2);

      const seat1Id = occupiedSeats[0].id;
      const seat2Id = occupiedSeats[1].id;

      const onRevealDestination = jest.fn((id: number) => {
        state = revealDestination(state, id);
      });

      const { rerender } = render(
        <Compartment
          seats={state.seats}
          playerSeatId={null}
          isPlayerSeated={false}
          hoveredSeatId={null}
          onRevealDestination={onRevealDestination}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
        />
      );

      // Reveal first seat's destination
      fireEvent.click(screen.getByTestId(`seat-${seat1Id}`));
      fireEvent.click(screen.getByTestId("ask-destination-button"));

      rerender(
        <Compartment
          seats={state.seats}
          playerSeatId={null}
          isPlayerSeated={false}
          hoveredSeatId={null}
          onRevealDestination={onRevealDestination}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
        />
      );

      // First seat should be revealed
      expect(screen.getByTestId(`seat-${seat1Id}`)).toHaveAttribute("data-state", "occupied-known");

      // Reveal second seat's destination
      fireEvent.click(screen.getByTestId(`seat-${seat2Id}`));
      fireEvent.click(screen.getByTestId("ask-destination-button"));

      rerender(
        <Compartment
          seats={state.seats}
          playerSeatId={null}
          isPlayerSeated={false}
          hoveredSeatId={null}
          onRevealDestination={onRevealDestination}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
        />
      );

      // Both seats should now be revealed
      expect(screen.getByTestId(`seat-${seat1Id}`)).toHaveAttribute("data-state", "occupied-known");
      expect(screen.getByTestId(`seat-${seat2Id}`)).toHaveAttribute("data-state", "occupied-known");
    });

    it("multiple NPCs can have different reveal states", () => {
      let state = generateInitialState(0, 5);

      // Find first two occupied seats
      const occupiedSeats = state.seats.filter((s) => s.occupant !== null);
      expect(occupiedSeats.length).toBeGreaterThanOrEqual(2);

      const seat1Id = occupiedSeats[0].id;
      const seat2Id = occupiedSeats[1].id;

      // Reveal only the first seat
      state = revealDestination(state, seat1Id);

      render(
        <Compartment
          seats={state.seats}
          playerSeatId={null}
          isPlayerSeated={false}
          {...defaultHandlers}
        />
      );

      // First seat revealed, second not revealed
      expect(screen.getByTestId(`seat-${seat1Id}`)).toHaveAttribute("data-state", "occupied-known");
      expect(screen.getByTestId(`seat-${seat2Id}`)).toHaveAttribute("data-state", "occupied");
    });
  });
});
