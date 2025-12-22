import { render, screen } from "@testing-library/react";
import { Compartment } from "../Compartment";
import { Seat } from "@/lib/types";

const defaultProps = {
  isPlayerSeated: false,
  playerWatchedSeatId: null,
  playerStandingSpot: 0,
  actionsRemaining: 2,
  isGrabPhase: false,
  line: "short" as const,
  onAskDestination: jest.fn(),
  onWatchSeat: jest.fn(),
  onGrabSeat: jest.fn(),
};

describe("Compartment", () => {
  const createSeats = (count: number): Seat[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      occupant: null,
    }));
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders exactly 6 Seat components", () => {
    const seats = createSeats(6);
    render(
      <Compartment
        seats={seats}
        playerSeatId={null}
        standingArea={<div>Aisle</div>}
        statusBar={<div>Status</div>}
        {...defaultProps}
      />
    );

    for (let i = 0; i < 6; i++) {
      expect(screen.getByTestId(`seat-${i}`)).toBeInTheDocument();
    }
  });

  it("renders seats in 2 rows of 3 with standing area between", () => {
    const seats = createSeats(6);
    render(
      <Compartment
        seats={seats}
        playerSeatId={null}
        standingArea={<div data-testid="test-standing-area">Aisle</div>}
        statusBar={<div>Status</div>}
        {...defaultProps}
      />
    );

    // All 6 seats should be present
    for (let i = 0; i < 6; i++) {
      expect(screen.getByTestId(`seat-${i}`)).toBeInTheDocument();
    }

    // Standing area should be rendered
    expect(screen.getByTestId("test-standing-area")).toBeInTheDocument();
  });

  it("passes isPlayerSeat=true only to player's seat", () => {
    const seats = createSeats(6);
    render(
      <Compartment
        seats={seats}
        playerSeatId={2}
        standingArea={<div>Aisle</div>}
        statusBar={<div>Status</div>}
        {...defaultProps}
      />
    );

    // Player's seat should have player state
    expect(screen.getByTestId("seat-2")).toHaveAttribute("data-state", "player");

    // Other seats should be empty
    expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "empty");
    expect(screen.getByTestId("seat-1")).toHaveAttribute("data-state", "empty");
    expect(screen.getByTestId("seat-3")).toHaveAttribute("data-state", "empty");
    expect(screen.getByTestId("seat-4")).toHaveAttribute("data-state", "empty");
    expect(screen.getByTestId("seat-5")).toHaveAttribute("data-state", "empty");
  });

  it("renders all seats as empty when playerSeatId is null", () => {
    const seats = createSeats(6);
    render(
      <Compartment
        seats={seats}
        playerSeatId={null}
        standingArea={<div>Aisle</div>}
        statusBar={<div>Status</div>}
        {...defaultProps}
      />
    );

    for (let i = 0; i < 6; i++) {
      expect(screen.getByTestId(`seat-${i}`)).toHaveAttribute("data-state", "empty");
    }
  });

  it("correctly renders mixed occupied and empty seats", () => {
    const seats: Seat[] = [
      {
        id: 0,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      },
      { id: 1, occupant: null },
      {
        id: 2,
        occupant: { id: "npc-1", destination: 4, destinationRevealed: true, characterSprite: 1 },
      },
      { id: 3, occupant: null },
      {
        id: 4,
        occupant: { id: "npc-2", destination: 5, destinationRevealed: false, characterSprite: 2 },
      },
      { id: 5, occupant: null },
    ];
    render(
      <Compartment
        seats={seats}
        playerSeatId={null}
        standingArea={<div>Aisle</div>}
        statusBar={<div>Status</div>}
        {...defaultProps}
      />
    );

    expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "occupied");
    expect(screen.getByTestId("seat-1")).toHaveAttribute("data-state", "empty");
    expect(screen.getByTestId("seat-2")).toHaveAttribute("data-state", "occupied-known");
    expect(screen.getByTestId("seat-3")).toHaveAttribute("data-state", "empty");
    expect(screen.getByTestId("seat-4")).toHaveAttribute("data-state", "occupied");
    expect(screen.getByTestId("seat-5")).toHaveAttribute("data-state", "empty");
  });

  it("has compartment testid", () => {
    const seats = createSeats(6);
    render(
      <Compartment
        seats={seats}
        playerSeatId={null}
        standingArea={<div>Aisle</div>}
        statusBar={<div>Status</div>}
        {...defaultProps}
      />
    );

    expect(screen.getByTestId("compartment")).toBeInTheDocument();
  });

  it("passes isPlayerSeated prop to all seats", () => {
    const seats = createSeats(6);
    render(
      <Compartment
        seats={seats}
        playerSeatId={null}
        isPlayerSeated={true}
        playerWatchedSeatId={null}
        playerStandingSpot={0}
        actionsRemaining={2}
        isGrabPhase={false}
        line="short"
        standingArea={<div>Aisle</div>}
        statusBar={<div>Status</div>}
        onAskDestination={jest.fn()}
        onWatchSeat={jest.fn()}
        onGrabSeat={jest.fn()}
      />
    );

    // When player is seated, seats should not have clickable cursor
    for (let i = 0; i < 6; i++) {
      expect(screen.getByTestId(`seat-${i}`)).not.toHaveClass("cursor-pointer");
    }
  });

  it("passes playerWatchedSeatId correctly to seats", () => {
    const seats: Seat[] = [
      {
        id: 0,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      },
      {
        id: 1,
        occupant: { id: "npc-1", destination: 4, destinationRevealed: false, characterSprite: 1 },
      },
      { id: 2, occupant: null },
      { id: 3, occupant: null },
      { id: 4, occupant: null },
      { id: 5, occupant: null },
    ];
    render(
      <Compartment
        seats={seats}
        playerSeatId={null}
        isPlayerSeated={false}
        playerWatchedSeatId={0}
        playerStandingSpot={0}
        actionsRemaining={2}
        isGrabPhase={false}
        line="short"
        standingArea={<div>Aisle</div>}
        statusBar={<div>Status</div>}
        onAskDestination={jest.fn()}
        onWatchSeat={jest.fn()}
        onGrabSeat={jest.fn()}
      />
    );

    // Seat 0 is watched (occupied) - should show watched state
    expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "watched");
    // Seat 1 is not watched
    expect(screen.getByTestId("seat-1")).toHaveAttribute("data-state", "occupied");
  });
});
