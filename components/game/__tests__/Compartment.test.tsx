import { render, screen } from "@testing-library/react";
import { Compartment } from "../Compartment";
import { Seat } from "@/lib/types";

const defaultProps = {
  isPlayerSeated: false,
  hoveredSeatId: null,
  onRevealDestination: jest.fn(),
  onClaimSeat: jest.fn(),
  onHoverNear: jest.fn(),
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
    render(<Compartment seats={seats} playerSeatId={null} {...defaultProps} />);

    for (let i = 0; i < 6; i++) {
      expect(screen.getByTestId(`seat-${i}`)).toBeInTheDocument();
    }
  });

  it("renders seats in 2 rows of 3 with aisle between", () => {
    const seats = createSeats(6);
    render(<Compartment seats={seats} playerSeatId={null} {...defaultProps} />);

    const compartment = screen.getByTestId("compartment");
    // Get only direct children (top row, aisle, bottom row)
    const children = Array.from(compartment.children);

    expect(children).toHaveLength(3);
    // First row has 3 seats
    expect(children[0].children).toHaveLength(3);
    // Aisle between rows
    expect(screen.getByTestId("aisle")).toBeInTheDocument();
    // Second row has 3 seats
    expect(children[2].children).toHaveLength(3);
  });

  it("passes isPlayerSeat=true only to player's seat", () => {
    const seats = createSeats(6);
    render(<Compartment seats={seats} playerSeatId={2} {...defaultProps} />);

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
    render(<Compartment seats={seats} playerSeatId={null} {...defaultProps} />);

    for (let i = 0; i < 6; i++) {
      expect(screen.getByTestId(`seat-${i}`)).toHaveAttribute("data-state", "empty");
    }
  });

  it("correctly renders mixed occupied and empty seats", () => {
    const seats: Seat[] = [
      { id: 0, occupant: { id: "npc-0", destination: 3, destinationRevealed: false } },
      { id: 1, occupant: null },
      { id: 2, occupant: { id: "npc-1", destination: 4, destinationRevealed: true } },
      { id: 3, occupant: null },
      { id: 4, occupant: { id: "npc-2", destination: 5, destinationRevealed: false } },
      { id: 5, occupant: null },
    ];
    render(<Compartment seats={seats} playerSeatId={null} {...defaultProps} />);

    expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "occupied");
    expect(screen.getByTestId("seat-1")).toHaveAttribute("data-state", "empty");
    expect(screen.getByTestId("seat-2")).toHaveAttribute("data-state", "occupied-known");
    expect(screen.getByTestId("seat-3")).toHaveAttribute("data-state", "empty");
    expect(screen.getByTestId("seat-4")).toHaveAttribute("data-state", "occupied");
    expect(screen.getByTestId("seat-5")).toHaveAttribute("data-state", "empty");
  });

  it("has compartment testid", () => {
    const seats = createSeats(6);
    render(<Compartment seats={seats} playerSeatId={null} {...defaultProps} />);

    expect(screen.getByTestId("compartment")).toBeInTheDocument();
  });

  it("passes isPlayerSeated prop to all seats", () => {
    const seats = createSeats(6);
    render(
      <Compartment
        seats={seats}
        playerSeatId={null}
        isPlayerSeated={true}
        hoveredSeatId={null}
        onRevealDestination={jest.fn()}
        onClaimSeat={jest.fn()}
        onHoverNear={jest.fn()}
      />
    );

    // When player is seated, seats should not have clickable cursor
    for (let i = 0; i < 6; i++) {
      expect(screen.getByTestId(`seat-${i}`)).not.toHaveClass("cursor-pointer");
    }
  });

  it("passes hoveredSeatId correctly to seats", () => {
    const seats: Seat[] = [
      { id: 0, occupant: { id: "npc-0", destination: 3, destinationRevealed: false } },
      { id: 1, occupant: { id: "npc-1", destination: 4, destinationRevealed: false } },
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
        hoveredSeatId={0}
        onRevealDestination={jest.fn()}
        onClaimSeat={jest.fn()}
        onHoverNear={jest.fn()}
      />
    );

    // Seat 0 is hovered (occupied) - should show hovered state
    expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "hovered");
    // Seat 1 is not hovered
    expect(screen.getByTestId("seat-1")).toHaveAttribute("data-state", "occupied");
  });
});
