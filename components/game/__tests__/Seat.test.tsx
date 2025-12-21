import { render, screen, fireEvent } from "@testing-library/react";
import { Seat } from "../Seat";
import { Seat as SeatType } from "@/lib/types";

const defaultProps = {
  isPlayerSeated: false,
  isHovered: false,
  onRevealDestination: jest.fn(),
  onClaimSeat: jest.fn(),
  onHoverNear: jest.fn(),
};

describe("Seat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("empty seat", () => {
    it("displays 'Empty!' for seat with no occupant", () => {
      const seat: SeatType = { id: 0, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      expect(screen.getByText("Empty!")).toBeInTheDocument();
    });

    it("has empty state data attribute", () => {
      const seat: SeatType = { id: 0, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "empty");
    });

    it("has emerald gradient styling for empty seat", () => {
      const seat: SeatType = { id: 0, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      expect(screen.getByTestId("seat-0")).toHaveClass(
        "bg-gradient-to-b",
        "from-emerald-100",
        "to-emerald-200"
      );
    });
  });

  describe("occupied seat", () => {
    it("displays character illustration for seat with occupant", () => {
      const seat: SeatType = {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      // Check for character SVG via aria-label pattern
      expect(screen.getByRole("img", { name: /Passenger npc-0/i })).toBeInTheDocument();
    });

    it("has occupied state data attribute", () => {
      const seat: SeatType = {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      expect(screen.getByTestId("seat-1")).toHaveAttribute("data-state", "occupied");
    });

    it("has rose gradient styling for occupied seat", () => {
      const seat: SeatType = {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      expect(screen.getByTestId("seat-1")).toHaveClass(
        "bg-gradient-to-b",
        "from-rose-100",
        "to-rose-200"
      );
    });
  });

  describe("occupied seat with revealed destination", () => {
    it("displays character illustration for seat with revealed destination", () => {
      const seat: SeatType = {
        id: 2,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: true, characterSprite: 0 },
      };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      // Check for character SVG via aria-label pattern
      expect(screen.getByRole("img", { name: /Passenger npc-0/i })).toBeInTheDocument();
    });

    it("has occupied-known state data attribute", () => {
      const seat: SeatType = {
        id: 2,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: true, characterSprite: 0 },
      };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      expect(screen.getByTestId("seat-2")).toHaveAttribute("data-state", "occupied-known");
    });

    it("has rose gradient styling for seat with known destination", () => {
      const seat: SeatType = {
        id: 2,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: true, characterSprite: 0 },
      };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      expect(screen.getByTestId("seat-2")).toHaveClass(
        "bg-gradient-to-b",
        "from-rose-100",
        "to-rose-200"
      );
    });

    it("displays destination station in speech bubble", () => {
      const seat: SeatType = {
        id: 2,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: true, characterSprite: 0 },
      };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      expect(screen.getByTestId("speech-bubble")).toBeInTheDocument();
      expect(screen.getByTestId("speech-bubble-destination")).toHaveTextContent("Grant Road");
    });
  });

  describe("player seat", () => {
    it("displays player character when player is seated", () => {
      const seat: SeatType = { id: 3, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={true} {...defaultProps} />);

      expect(screen.getByRole("img", { name: /You - the player character/i })).toBeInTheDocument();
    });

    it("has player state data attribute", () => {
      const seat: SeatType = { id: 3, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={true} {...defaultProps} />);

      expect(screen.getByTestId("seat-3")).toHaveAttribute("data-state", "player");
    });

    it("has amber gradient styling for player seat", () => {
      const seat: SeatType = { id: 3, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={true} {...defaultProps} />);

      expect(screen.getByTestId("seat-3")).toHaveClass(
        "bg-gradient-to-b",
        "from-amber-200",
        "to-amber-300"
      );
    });

    it("has ring styling for player seat", () => {
      const seat: SeatType = { id: 3, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={true} {...defaultProps} />);

      expect(screen.getByTestId("seat-3")).toHaveClass("ring-4", "ring-amber-400");
    });
  });

  describe("seat testid", () => {
    it("uses seat id in testid", () => {
      const seat: SeatType = { id: 5, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      expect(screen.getByTestId("seat-5")).toBeInTheDocument();
    });
  });

  describe("popover interactions", () => {
    it("opens popover when clicking empty seat while standing", () => {
      const seat: SeatType = { id: 0, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      fireEvent.click(screen.getByTestId("seat-0"));

      expect(screen.getByTestId("seat-popover")).toBeInTheDocument();
      expect(screen.getByTestId("claim-seat-button")).toBeInTheDocument();
    });

    it("opens popover when clicking occupied seat while standing", () => {
      const seat: SeatType = {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      fireEvent.click(screen.getByTestId("seat-1"));

      expect(screen.getByTestId("seat-popover")).toBeInTheDocument();
      expect(screen.getByTestId("ask-destination-button")).toBeInTheDocument();
    });

    it("shows revealed destination in popover when already revealed", () => {
      const seat: SeatType = {
        id: 2,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: true, characterSprite: 0 },
      };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      fireEvent.click(screen.getByTestId("seat-2"));

      expect(screen.getByTestId("seat-popover")).toBeInTheDocument();
      expect(screen.getByText(/Grant Road/i)).toBeInTheDocument();
    });

    it("does not open popover when clicking player's own seat", () => {
      const seat: SeatType = { id: 3, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={true} {...defaultProps} />);

      fireEvent.click(screen.getByTestId("seat-3"));

      expect(screen.queryByTestId("seat-popover")).not.toBeInTheDocument();
    });

    it("does not open popover when player is already seated", () => {
      const seat: SeatType = { id: 0, occupant: null };
      render(
        <Seat
          seat={seat}
          isPlayerSeat={false}
          isPlayerSeated={true}
          isHovered={false}
          onRevealDestination={jest.fn()}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
        />
      );

      fireEvent.click(screen.getByTestId("seat-0"));

      expect(screen.queryByTestId("seat-popover")).not.toBeInTheDocument();
    });

    it("calls onRevealDestination when clicking 'Ask destination?' button", () => {
      const onRevealDestination = jest.fn();
      const seat: SeatType = {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      };
      render(
        <Seat
          seat={seat}
          isPlayerSeat={false}
          isPlayerSeated={false}
          isHovered={false}
          onRevealDestination={onRevealDestination}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
        />
      );

      fireEvent.click(screen.getByTestId("seat-1"));
      fireEvent.click(screen.getByTestId("ask-destination-button"));

      expect(onRevealDestination).toHaveBeenCalledWith(1);
    });

    it("calls onClaimSeat when clicking 'Claim Seat' button", () => {
      const onClaimSeat = jest.fn();
      const seat: SeatType = { id: 0, occupant: null };
      render(
        <Seat
          seat={seat}
          isPlayerSeat={false}
          isPlayerSeated={false}
          isHovered={false}
          onRevealDestination={jest.fn()}
          onClaimSeat={onClaimSeat}
          onHoverNear={jest.fn()}
        />
      );

      fireEvent.click(screen.getByTestId("seat-0"));
      fireEvent.click(screen.getByTestId("claim-seat-button"));

      expect(onClaimSeat).toHaveBeenCalledWith(0);
    });

    it("closes popover after clicking action button", () => {
      const seat: SeatType = { id: 0, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      fireEvent.click(screen.getByTestId("seat-0"));
      expect(screen.getByTestId("seat-popover")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("claim-seat-button"));
      expect(screen.queryByTestId("seat-popover")).not.toBeInTheDocument();
    });

    it("has clickable cursor when seat is clickable", () => {
      const seat: SeatType = { id: 0, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      expect(screen.getByTestId("seat-0")).toHaveClass("cursor-pointer");
    });

    it("does not have clickable cursor when player is seated", () => {
      const seat: SeatType = { id: 0, occupant: null };
      render(
        <Seat
          seat={seat}
          isPlayerSeat={false}
          isPlayerSeated={true}
          isHovered={false}
          onRevealDestination={jest.fn()}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
        />
      );

      expect(screen.getByTestId("seat-0")).not.toHaveClass("cursor-pointer");
    });

    it("supports keyboard navigation for clickable seats", () => {
      const seat: SeatType = { id: 0, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      const seatElement = screen.getByTestId("seat-0");
      expect(seatElement).toHaveAttribute("type", "button");
    });

    it("opens popover on Enter key press", () => {
      const seat: SeatType = { id: 0, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      fireEvent.keyDown(screen.getByTestId("seat-0"), { key: "Enter" });

      expect(screen.getByTestId("seat-popover")).toBeInTheDocument();
    });

    it("opens popover on Space key press", () => {
      const seat: SeatType = { id: 0, occupant: null };
      render(<Seat seat={seat} isPlayerSeat={false} {...defaultProps} />);

      fireEvent.keyDown(screen.getByTestId("seat-0"), { key: " " });

      expect(screen.getByTestId("seat-popover")).toBeInTheDocument();
    });

    it("calls onHoverNear when clicking 'Hover Near' button", () => {
      const onHoverNear = jest.fn();
      const seat: SeatType = {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      };
      render(
        <Seat
          seat={seat}
          isPlayerSeat={false}
          isPlayerSeated={false}
          isHovered={false}
          onRevealDestination={jest.fn()}
          onClaimSeat={jest.fn()}
          onHoverNear={onHoverNear}
        />
      );

      fireEvent.click(screen.getByTestId("seat-1"));
      fireEvent.click(screen.getByTestId("hover-near-button"));

      expect(onHoverNear).toHaveBeenCalledWith(1);
    });
  });

  describe("hovered seat", () => {
    it("displays 'Watching...' for hovered occupied seat", () => {
      const seat: SeatType = {
        id: 0,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      };
      render(
        <Seat
          seat={seat}
          isPlayerSeat={false}
          isPlayerSeated={false}
          isHovered={true}
          onRevealDestination={jest.fn()}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
        />
      );

      expect(screen.getByText("Watching...")).toBeInTheDocument();
    });

    it("has hovered state data attribute", () => {
      const seat: SeatType = {
        id: 0,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      };
      render(
        <Seat
          seat={seat}
          isPlayerSeat={false}
          isPlayerSeated={false}
          isHovered={true}
          onRevealDestination={jest.fn()}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
        />
      );

      expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "hovered");
    });

    it("has purple gradient styling for hovered seat", () => {
      const seat: SeatType = {
        id: 0,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      };
      render(
        <Seat
          seat={seat}
          isPlayerSeat={false}
          isPlayerSeated={false}
          isHovered={true}
          onRevealDestination={jest.fn()}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
        />
      );

      expect(screen.getByTestId("seat-0")).toHaveClass(
        "bg-gradient-to-b",
        "from-purple-100",
        "to-purple-200"
      );
    });

    it("does not show hovered state for empty seat", () => {
      const seat: SeatType = { id: 0, occupant: null };
      render(
        <Seat
          seat={seat}
          isPlayerSeat={false}
          isPlayerSeated={false}
          isHovered={true}
          onRevealDestination={jest.fn()}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
        />
      );

      // Empty seats don't get hovered state
      expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "empty");
    });

    it("shows watching indicator when seat is hovered", () => {
      const seat: SeatType = {
        id: 0,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      };
      render(
        <Seat
          seat={seat}
          isPlayerSeat={false}
          isPlayerSeated={false}
          isHovered={true}
          onRevealDestination={jest.fn()}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
        />
      );

      expect(screen.getByText("Watching...")).toBeInTheDocument();
    });
  });
});
