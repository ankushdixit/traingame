import { render, screen, fireEvent } from "@testing-library/react";
import { TrainSeat } from "../TrainSeat";

describe("TrainSeat", () => {
  const defaultProps = {
    displayState: "empty" as const,
    isClickable: true,
    onClick: jest.fn(),
    onKeyDown: jest.fn(),
    testId: "seat-0",
    seatNumber: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders with testId", () => {
      render(<TrainSeat {...defaultProps}>Content</TrainSeat>);

      expect(screen.getByTestId("seat-0")).toBeInTheDocument();
    });

    it("renders children content", () => {
      render(<TrainSeat {...defaultProps}>Test Child</TrainSeat>);

      expect(screen.getByText("Test Child")).toBeInTheDocument();
    });

    it("sets data-state attribute", () => {
      render(
        <TrainSeat {...defaultProps} displayState="occupied">
          Content
        </TrainSeat>
      );

      expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "occupied");
    });
  });

  describe("color classes by state", () => {
    it("has stone gradient for empty state", () => {
      render(
        <TrainSeat {...defaultProps} displayState="empty">
          Content
        </TrainSeat>
      );

      expect(screen.getByTestId("seat-0")).toHaveClass(
        "bg-gradient-to-b",
        "from-stone-100",
        "to-stone-200"
      );
    });

    it("has rose gradient for occupied state", () => {
      render(
        <TrainSeat {...defaultProps} displayState="occupied">
          Content
        </TrainSeat>
      );

      expect(screen.getByTestId("seat-0")).toHaveClass(
        "bg-gradient-to-b",
        "from-rose-100",
        "to-rose-200"
      );
    });

    it("has rose gradient for occupied-known state", () => {
      render(
        <TrainSeat {...defaultProps} displayState="occupied-known">
          Content
        </TrainSeat>
      );

      expect(screen.getByTestId("seat-0")).toHaveClass(
        "bg-gradient-to-b",
        "from-rose-100",
        "to-rose-200"
      );
    });

    it("has purple gradient for watched state", () => {
      render(
        <TrainSeat {...defaultProps} displayState="watched">
          Content
        </TrainSeat>
      );

      expect(screen.getByTestId("seat-0")).toHaveClass(
        "bg-gradient-to-b",
        "from-purple-100",
        "to-purple-200"
      );
    });

    it("has amber gradient for player state", () => {
      render(
        <TrainSeat {...defaultProps} displayState="player">
          Content
        </TrainSeat>
      );

      expect(screen.getByTestId("seat-0")).toHaveClass(
        "bg-gradient-to-b",
        "from-amber-200",
        "to-amber-300"
      );
    });

    it("has ring styling for player state", () => {
      render(
        <TrainSeat {...defaultProps} displayState="player">
          Content
        </TrainSeat>
      );

      const seat = screen.getByTestId("seat-0");
      expect(seat).toHaveClass("ring-4");
      expect(seat).toHaveClass("ring-amber-400");
    });
  });

  describe("interaction states", () => {
    it("has hover scale effect when clickable", () => {
      render(
        <TrainSeat {...defaultProps} isClickable={true} displayState="empty">
          Content
        </TrainSeat>
      );

      expect(screen.getByTestId("seat-0")).toHaveClass("hover:scale-105");
    });
  });

  describe("clickable behavior", () => {
    it("has cursor-pointer when clickable", () => {
      render(
        <TrainSeat {...defaultProps} isClickable={true}>
          Content
        </TrainSeat>
      );

      expect(screen.getByTestId("seat-0")).toHaveClass("cursor-pointer");
    });

    it("does not have cursor-pointer when not clickable", () => {
      render(
        <TrainSeat {...defaultProps} isClickable={false}>
          Content
        </TrainSeat>
      );

      expect(screen.getByTestId("seat-0")).not.toHaveClass("cursor-pointer");
    });

    it("is a button element", () => {
      render(
        <TrainSeat {...defaultProps} isClickable={true}>
          Content
        </TrainSeat>
      );

      expect(screen.getByTestId("seat-0")).toHaveAttribute("type", "button");
    });

    it("is disabled when not clickable and not player seat", () => {
      render(
        <TrainSeat {...defaultProps} isClickable={false} displayState="occupied">
          Content
        </TrainSeat>
      );

      expect(screen.getByTestId("seat-0")).toBeDisabled();
    });
  });

  describe("event handlers", () => {
    it("calls onClick when clicked", () => {
      const onClick = jest.fn();
      render(
        <TrainSeat {...defaultProps} onClick={onClick}>
          Content
        </TrainSeat>
      );

      fireEvent.click(screen.getByTestId("seat-0"));
      expect(onClick).toHaveBeenCalled();
    });

    it("calls onKeyDown when key is pressed", () => {
      const onKeyDown = jest.fn();
      render(
        <TrainSeat {...defaultProps} onKeyDown={onKeyDown}>
          Content
        </TrainSeat>
      );

      fireEvent.keyDown(screen.getByTestId("seat-0"), { key: "Enter" });
      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  describe("visual structure", () => {
    it("has bench seat shape classes", () => {
      render(<TrainSeat {...defaultProps}>Content</TrainSeat>);

      const seat = screen.getByTestId("seat-0");
      expect(seat).toHaveClass("rounded-t-xl");
      expect(seat).toHaveClass("border-2");
      expect(seat).toHaveClass("shadow-md");
    });

    it("has seat dimensions", () => {
      render(<TrainSeat {...defaultProps}>Content</TrainSeat>);

      const seat = screen.getByTestId("seat-0");
      expect(seat).toHaveClass("h-28");
      expect(seat).toHaveClass("w-24");
    });

    it("displays seat number", () => {
      render(
        <TrainSeat {...defaultProps} seatNumber={5}>
          Content
        </TrainSeat>
      );

      // Seat number is displayed as #6 (seatNumber + 1)
      expect(screen.getByText("#6")).toBeInTheDocument();
    });
  });
});
