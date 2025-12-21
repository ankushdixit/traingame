import { render, screen, fireEvent } from "@testing-library/react";
import { SeatPopover } from "../SeatPopover";
import { Seat } from "@/lib/types";

const defaultHandlers = {
  isHovered: false,
  onRevealDestination: jest.fn(),
  onClaimSeat: jest.fn(),
  onHoverNear: jest.fn(),
  onClose: jest.fn(),
};

describe("SeatPopover", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when player is seated", () => {
    it("returns null and renders nothing", () => {
      const seat: Seat = { id: 0, occupant: null };
      const { container } = render(
        <SeatPopover seat={seat} isPlayerSeated={true} {...defaultHandlers} />
      );

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("when seat is empty", () => {
    it("shows 'Claim Seat' button", () => {
      const seat: Seat = { id: 0, occupant: null };
      render(<SeatPopover seat={seat} isPlayerSeated={false} {...defaultHandlers} />);

      expect(screen.getByTestId("seat-popover")).toBeInTheDocument();
      expect(screen.getByTestId("claim-seat-button")).toHaveTextContent("🎯 Claim Seat!");
    });

    it("calls onClaimSeat when 'Claim Seat' button is clicked", () => {
      const onClaimSeat = jest.fn();
      const seat: Seat = { id: 0, occupant: null };
      render(
        <SeatPopover
          seat={seat}
          isPlayerSeated={false}
          isHovered={false}
          onRevealDestination={jest.fn()}
          onClaimSeat={onClaimSeat}
          onHoverNear={jest.fn()}
          onClose={jest.fn()}
        />
      );

      fireEvent.click(screen.getByTestId("claim-seat-button"));

      expect(onClaimSeat).toHaveBeenCalled();
    });
  });

  describe("when seat is occupied with unrevealed destination", () => {
    it("shows 'Ask destination?' button", () => {
      const seat: Seat = {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      };
      render(<SeatPopover seat={seat} isPlayerSeated={false} {...defaultHandlers} />);

      expect(screen.getByTestId("seat-popover")).toBeInTheDocument();
      expect(screen.getByTestId("ask-destination-button")).toHaveTextContent("🗣️ Ask Destination");
    });

    it("calls onRevealDestination when 'Ask destination?' button is clicked", () => {
      const onRevealDestination = jest.fn();
      const seat: Seat = {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      };
      render(
        <SeatPopover
          seat={seat}
          isPlayerSeated={false}
          isHovered={false}
          onRevealDestination={onRevealDestination}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
          onClose={jest.fn()}
        />
      );

      fireEvent.click(screen.getByTestId("ask-destination-button"));

      expect(onRevealDestination).toHaveBeenCalled();
    });

    it("shows 'Hover Near' button for occupied seat", () => {
      const seat: Seat = {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      };
      render(<SeatPopover seat={seat} isPlayerSeated={false} {...defaultHandlers} />);

      expect(screen.getByTestId("hover-near-button")).toBeInTheDocument();
    });

    it("calls onHoverNear when 'Hover Near' button is clicked", () => {
      const onHoverNear = jest.fn();
      const seat: Seat = {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      };
      render(
        <SeatPopover
          seat={seat}
          isPlayerSeated={false}
          isHovered={false}
          onRevealDestination={jest.fn()}
          onClaimSeat={jest.fn()}
          onHoverNear={onHoverNear}
          onClose={jest.fn()}
        />
      );

      fireEvent.click(screen.getByTestId("hover-near-button"));

      expect(onHoverNear).toHaveBeenCalled();
    });
  });

  describe("when seat is occupied with revealed destination", () => {
    it("shows the ask button as disabled with 'Asked' text", () => {
      const seat: Seat = {
        id: 2,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: true, characterSprite: 0 },
      };
      render(<SeatPopover seat={seat} isPlayerSeated={false} {...defaultHandlers} />);

      expect(screen.getByTestId("seat-popover")).toBeInTheDocument();
      expect(screen.getByTestId("ask-destination-button")).toHaveTextContent("✓ Asked");
      expect(screen.getByTestId("ask-destination-button")).toBeDisabled();
    });

    it("shows the Watch Seat button", () => {
      const seat: Seat = {
        id: 2,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: true, characterSprite: 0 },
      };
      render(<SeatPopover seat={seat} isPlayerSeated={false} {...defaultHandlers} />);

      expect(screen.getByTestId("hover-near-button")).toBeInTheDocument();
      expect(screen.getByTestId("hover-near-button")).toHaveTextContent("👁️ Watch Seat");
    });
  });

  describe("when seat is hovered", () => {
    it("shows 'Watching' for already hovered seat", () => {
      const seat: Seat = {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      };
      render(
        <SeatPopover
          seat={seat}
          isPlayerSeated={false}
          isHovered={true}
          onRevealDestination={jest.fn()}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
          onClose={jest.fn()}
        />
      );

      expect(screen.getByText("👁️ Watching")).toBeInTheDocument();
    });

    it("disables 'Hover Near' button when already hovered", () => {
      const seat: Seat = {
        id: 1,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      };
      render(
        <SeatPopover
          seat={seat}
          isPlayerSeated={false}
          isHovered={true}
          onRevealDestination={jest.fn()}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
          onClose={jest.fn()}
        />
      );

      expect(screen.getByTestId("hover-near-button")).toBeDisabled();
    });
  });

  describe("closing behavior", () => {
    it("calls onClose when clicking outside", () => {
      const onClose = jest.fn();
      const seat: Seat = { id: 0, occupant: null };
      render(
        <div>
          <div data-testid="outside">Outside</div>
          <SeatPopover
            seat={seat}
            isPlayerSeated={false}
            isHovered={false}
            onRevealDestination={jest.fn()}
            onClaimSeat={jest.fn()}
            onHoverNear={jest.fn()}
            onClose={onClose}
          />
        </div>
      );

      fireEvent.mouseDown(screen.getByTestId("outside"));

      expect(onClose).toHaveBeenCalled();
    });

    it("calls onClose when pressing Escape", () => {
      const onClose = jest.fn();
      const seat: Seat = { id: 0, occupant: null };
      render(
        <SeatPopover
          seat={seat}
          isPlayerSeated={false}
          isHovered={false}
          onRevealDestination={jest.fn()}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
          onClose={onClose}
        />
      );

      fireEvent.keyDown(document, { key: "Escape" });

      expect(onClose).toHaveBeenCalled();
    });

    it("does not call onClose when clicking inside popover", () => {
      const onClose = jest.fn();
      const seat: Seat = { id: 0, occupant: null };
      render(
        <SeatPopover
          seat={seat}
          isPlayerSeated={false}
          isHovered={false}
          onRevealDestination={jest.fn()}
          onClaimSeat={jest.fn()}
          onHoverNear={jest.fn()}
          onClose={onClose}
        />
      );

      fireEvent.mouseDown(screen.getByTestId("seat-popover"));

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("destination display", () => {
    it("shows disabled 'Asked' button when destination is revealed", () => {
      const destinations = [
        { index: 0, name: "Churchgate" },
        { index: 1, name: "Marine Lines" },
        { index: 2, name: "Charni Road" },
        { index: 3, name: "Grant Road" },
        { index: 4, name: "Mumbai Central" },
        { index: 5, name: "Dadar" },
      ];

      destinations.forEach(({ index }) => {
        const seat: Seat = {
          id: index,
          occupant: {
            id: `npc-${index}`,
            destination: index,
            destinationRevealed: true,
            characterSprite: index,
          },
        };
        const { unmount } = render(
          <SeatPopover seat={seat} isPlayerSeated={false} {...defaultHandlers} />
        );

        expect(screen.getByTestId("ask-destination-button")).toHaveTextContent("✓ Asked");
        expect(screen.getByTestId("ask-destination-button")).toBeDisabled();

        unmount();
      });
    });
  });
});
