/**
 * Integration Tests for Game View
 *
 * Tests the complete game view rendering with generated state.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { Compartment } from "@/components/game/Compartment";
import { GameHeader } from "@/components/game/GameHeader";
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
  onAskDestination: jest.fn(),
  onWatchSeat: jest.fn(),
  onGrabSeat: jest.fn(),
  playerWatchedSeatId: null,
  playerStandingSpot: 0,
  actionsRemaining: 2,
  isGrabPhase: false,
  line: "short" as const,
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
            playerSeated={state.playerSeated}
          />
          <Compartment
            seats={state.seats}
            playerSeatId={state.seatId}
            isPlayerSeated={state.playerSeated}
            standingArea={<div>Aisle</div>}
            statusBar={<div>Status</div>}
            {...defaultHandlers}
          />
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

      // Player status is shown in header
      expect(screen.getByTestId("player-status")).toBeInTheDocument();
      expect(screen.getByTestId("player-status")).toHaveTextContent(/Standing/);
    });

    it("correctly reflects occupied seats from generated state", () => {
      const state = generateInitialState(0, 5);

      render(
        <Compartment
          seats={state.seats}
          playerSeatId={state.seatId}
          isPlayerSeated={state.playerSeated}
          standingArea={<div>Aisle</div>}
          statusBar={<div>Status</div>}
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

      // All seats start full, so simulate player sitting after claiming a seat
      const seatedState = {
        ...state,
        playerSeated: true,
        seatId: 0,
      };

      render(
        <>
          <GameHeader
            currentStation={seatedState.currentStation}
            playerDestination={seatedState.playerDestination}
            difficulty={seatedState.difficulty}
            playerSeated={seatedState.playerSeated}
          />
          <Compartment
            seats={seatedState.seats}
            playerSeatId={seatedState.seatId}
            isPlayerSeated={seatedState.playerSeated}
            standingArea={<div>Aisle</div>}
            statusBar={<div>Status</div>}
            {...defaultHandlers}
          />
        </>
      );

      // Player's seat should be highlighted
      expect(screen.getByTestId(`seat-0`)).toHaveAttribute("data-state", "player");

      // Player status should show seated
      expect(screen.getByTestId("player-status")).toHaveTextContent(/Seated/);
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
          standingArea={<div>Aisle</div>}
          statusBar={<div>Status</div>}
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
      [0, 5, "Churchgate"],
      [1, 5, "Marine Lines"],
      [2, 5, "Charni Road"],
      [3, 5, "Grant Road"],
      [4, 5, "Mumbai Central"],
    ])(
      "displays correct current station for boarding=%i, destination=%i",
      (boarding, destination, expectedCurrent) => {
        render(
          <GameHeader
            currentStation={boarding}
            playerDestination={destination}
            difficulty="normal"
            playerSeated={false}
          />
        );

        expect(screen.getByTestId("current-station")).toHaveTextContent(expectedCurrent);
        expect(screen.getByTestId("player-status")).toHaveTextContent(/Standing/);
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
              playerSeated={state.playerSeated}
            />
            <Compartment
              seats={state.seats}
              playerSeatId={state.seatId}
              isPlayerSeated={state.playerSeated}
              standingArea={<div>Aisle</div>}
              statusBar={<div>Status</div>}
              {...defaultHandlers}
            />
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
          playerWatchedSeatId={null}
          playerStandingSpot={0}
          actionsRemaining={2}
          isGrabPhase={false}
          line="short"
          standingArea={<div>Aisle</div>}
          statusBar={<div>Status</div>}
          onAskDestination={onRevealDestination}
          onWatchSeat={jest.fn()}
          onGrabSeat={jest.fn()}
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
          playerWatchedSeatId={null}
          playerStandingSpot={0}
          actionsRemaining={2}
          isGrabPhase={false}
          line="short"
          standingArea={<div>Aisle</div>}
          statusBar={<div>Status</div>}
          onAskDestination={onRevealDestination}
          onWatchSeat={jest.fn()}
          onGrabSeat={jest.fn()}
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
          playerWatchedSeatId={null}
          playerStandingSpot={0}
          actionsRemaining={2}
          isGrabPhase={false}
          line="short"
          standingArea={<div>Aisle</div>}
          statusBar={<div>Status</div>}
          onAskDestination={onRevealDestination}
          onWatchSeat={jest.fn()}
          onGrabSeat={jest.fn()}
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
          playerWatchedSeatId={null}
          playerStandingSpot={0}
          actionsRemaining={2}
          isGrabPhase={false}
          line="short"
          standingArea={<div>Aisle</div>}
          statusBar={<div>Status</div>}
          onAskDestination={onRevealDestination}
          onWatchSeat={jest.fn()}
          onGrabSeat={jest.fn()}
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
          playerWatchedSeatId={null}
          playerStandingSpot={0}
          actionsRemaining={2}
          isGrabPhase={false}
          line="short"
          standingArea={<div>Aisle</div>}
          statusBar={<div>Status</div>}
          onAskDestination={onRevealDestination}
          onWatchSeat={jest.fn()}
          onGrabSeat={jest.fn()}
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
          standingArea={<div>Aisle</div>}
          statusBar={<div>Status</div>}
          {...defaultHandlers}
        />
      );

      // First seat revealed, second not revealed
      expect(screen.getByTestId(`seat-${seat1Id}`)).toHaveAttribute("data-state", "occupied-known");
      expect(screen.getByTestId(`seat-${seat2Id}`)).toHaveAttribute("data-state", "occupied");
    });
  });
});
