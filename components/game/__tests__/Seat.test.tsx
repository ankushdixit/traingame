import { render, screen } from "@testing-library/react";
import { Seat } from "../Seat";
import { Seat as SeatType } from "@/lib/types";

describe("Seat", () => {
  describe("empty seat", () => {
    it("displays 'Empty' for seat with no occupant", () => {
      const seat: SeatType = { id: 0, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={false} />);

      expect(screen.getByText("Empty")).toBeInTheDocument();
    });

    it("has empty state data attribute", () => {
      const seat: SeatType = { id: 0, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={false} />);

      expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "empty");
    });

    it("has green styling for empty seat", () => {
      const seat: SeatType = { id: 0, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={false} />);

      expect(screen.getByTestId("seat-0")).toHaveClass("bg-green-100");
    });
  });

  describe("occupied seat", () => {
    it("displays 'Passenger' for seat with occupant", () => {
      const seat: SeatType = {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false },
      };
      render(<Seat seat={seat} isPlayerSeat={false} />);

      expect(screen.getByText("Passenger")).toBeInTheDocument();
    });

    it("has occupied state data attribute", () => {
      const seat: SeatType = {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false },
      };
      render(<Seat seat={seat} isPlayerSeat={false} />);

      expect(screen.getByTestId("seat-1")).toHaveAttribute("data-state", "occupied");
    });

    it("has gray styling for occupied seat", () => {
      const seat: SeatType = {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false },
      };
      render(<Seat seat={seat} isPlayerSeat={false} />);

      expect(screen.getByTestId("seat-1")).toHaveClass("bg-gray-200");
    });
  });

  describe("occupied seat with revealed destination", () => {
    it("displays 'Passenger' for seat with revealed destination", () => {
      const seat: SeatType = {
        id: 2,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: true },
      };
      render(<Seat seat={seat} isPlayerSeat={false} />);

      expect(screen.getByText("Passenger")).toBeInTheDocument();
    });

    it("has occupied-known state data attribute", () => {
      const seat: SeatType = {
        id: 2,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: true },
      };
      render(<Seat seat={seat} isPlayerSeat={false} />);

      expect(screen.getByTestId("seat-2")).toHaveAttribute("data-state", "occupied-known");
    });

    it("has blue styling for seat with known destination", () => {
      const seat: SeatType = {
        id: 2,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: true },
      };
      render(<Seat seat={seat} isPlayerSeat={false} />);

      expect(screen.getByTestId("seat-2")).toHaveClass("bg-blue-100");
    });
  });

  describe("player seat", () => {
    it("displays 'You' when player is seated", () => {
      const seat: SeatType = { id: 3, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={true} />);

      expect(screen.getByText("You")).toBeInTheDocument();
    });

    it("has player state data attribute", () => {
      const seat: SeatType = { id: 3, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={true} />);

      expect(screen.getByTestId("seat-3")).toHaveAttribute("data-state", "player");
    });

    it("has yellow styling for player seat", () => {
      const seat: SeatType = { id: 3, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={true} />);

      expect(screen.getByTestId("seat-3")).toHaveClass("bg-yellow-200");
    });

    it("has ring styling for player seat", () => {
      const seat: SeatType = { id: 3, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={true} />);

      expect(screen.getByTestId("seat-3")).toHaveClass("ring-2", "ring-yellow-400");
    });
  });

  describe("seat testid", () => {
    it("uses seat id in testid", () => {
      const seat: SeatType = { id: 5, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={false} />);

      expect(screen.getByTestId("seat-5")).toBeInTheDocument();
    });
  });
});
