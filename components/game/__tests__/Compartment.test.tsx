import { render, screen } from "@testing-library/react";
import { Compartment } from "../Compartment";
import { Seat } from "@/lib/types";

describe("Compartment", () => {
  const createSeats = (count: number): Seat[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      occupant: null,
    }));
  };

  it("renders exactly 6 Seat components", () => {
    const seats = createSeats(6);
    render(<Compartment seats={seats} playerSeatId={null} />);

    for (let i = 0; i < 6; i++) {
      expect(screen.getByTestId(`seat-${i}`)).toBeInTheDocument();
    }
  });

  it("renders seats in 2 rows of 3", () => {
    const seats = createSeats(6);
    render(<Compartment seats={seats} playerSeatId={null} />);

    const compartment = screen.getByTestId("compartment");
    // Get only direct children (the row divs)
    const rows = Array.from(compartment.children);

    expect(rows).toHaveLength(2);
    expect(rows[0].children).toHaveLength(3);
    expect(rows[1].children).toHaveLength(3);
  });

  it("passes isPlayerSeat=true only to player's seat", () => {
    const seats = createSeats(6);
    render(<Compartment seats={seats} playerSeatId={2} />);

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
    render(<Compartment seats={seats} playerSeatId={null} />);

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
    render(<Compartment seats={seats} playerSeatId={null} />);

    expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "occupied");
    expect(screen.getByTestId("seat-1")).toHaveAttribute("data-state", "empty");
    expect(screen.getByTestId("seat-2")).toHaveAttribute("data-state", "occupied-known");
    expect(screen.getByTestId("seat-3")).toHaveAttribute("data-state", "empty");
    expect(screen.getByTestId("seat-4")).toHaveAttribute("data-state", "occupied");
    expect(screen.getByTestId("seat-5")).toHaveAttribute("data-state", "empty");
  });

  it("has compartment testid", () => {
    const seats = createSeats(6);
    render(<Compartment seats={seats} playerSeatId={null} />);

    expect(screen.getByTestId("compartment")).toBeInTheDocument();
  });
});
