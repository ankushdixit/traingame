import { render, screen, fireEvent } from "@testing-library/react";
import { NextStationButton } from "../NextStationButton";

describe("NextStationButton", () => {
  const defaultProps = {
    onAdvance: jest.fn(),
    disabled: false,
    nextStationName: "Marine Lines",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("button text", () => {
    it("shows 'Next Station: [station]' for all stations", () => {
      render(<NextStationButton {...defaultProps} nextStationName="Marine Lines" />);

      expect(screen.getByTestId("next-station-button")).toHaveTextContent(
        "🚃 Next Station: Marine Lines"
      );
    });

    it("shows correct next station name for each station", () => {
      const expectedStations = [
        { current: 0, next: "Marine Lines" },
        { current: 1, next: "Charni Road" },
        { current: 2, next: "Grant Road" },
        { current: 3, next: "Mumbai Central" },
        { current: 4, next: "Dadar" },
      ];

      expectedStations.forEach(({ next }) => {
        const { unmount } = render(<NextStationButton {...defaultProps} nextStationName={next} />);

        expect(screen.getByTestId("next-station-button")).toHaveTextContent(
          `🚃 Next Station: ${next}`
        );
        unmount();
      });
    });
  });

  describe("click behavior", () => {
    it("calls onAdvance when clicked", () => {
      const onAdvance = jest.fn();
      render(<NextStationButton {...defaultProps} onAdvance={onAdvance} />);

      fireEvent.click(screen.getByTestId("next-station-button"));

      expect(onAdvance).toHaveBeenCalledTimes(1);
    });

    it("does not call onAdvance when disabled", () => {
      const onAdvance = jest.fn();
      render(<NextStationButton {...defaultProps} onAdvance={onAdvance} disabled={true} />);

      fireEvent.click(screen.getByTestId("next-station-button"));

      expect(onAdvance).not.toHaveBeenCalled();
    });
  });

  describe("disabled state", () => {
    it("is enabled by default", () => {
      render(<NextStationButton {...defaultProps} disabled={false} />);

      expect(screen.getByTestId("next-station-button")).toBeEnabled();
    });

    it("is disabled when disabled prop is true", () => {
      render(<NextStationButton {...defaultProps} disabled={true} />);

      expect(screen.getByTestId("next-station-button")).toBeDisabled();
    });

    it("has stone styling when disabled", () => {
      render(<NextStationButton {...defaultProps} disabled={true} />);

      expect(screen.getByTestId("next-station-button")).toHaveClass("bg-stone-300");
      expect(screen.getByTestId("next-station-button")).toHaveClass("cursor-not-allowed");
    });

    it("has blue gradient styling when enabled", () => {
      render(<NextStationButton {...defaultProps} disabled={false} />);

      expect(screen.getByTestId("next-station-button")).toHaveClass(
        "bg-gradient-to-r",
        "from-blue-500",
        "to-blue-600"
      );
    });

    it("shows 'Moving...' text when disabled", () => {
      render(<NextStationButton {...defaultProps} disabled={true} />);

      expect(screen.getByTestId("next-station-button")).toHaveTextContent("Moving...");
    });

    it("shows loading spinner when disabled", () => {
      render(<NextStationButton {...defaultProps} disabled={true} />);

      const button = screen.getByTestId("next-station-button");
      const spinner = button.querySelector("svg.animate-spin");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("testid", () => {
    it("has next-station-button testid", () => {
      render(<NextStationButton {...defaultProps} />);

      expect(screen.getByTestId("next-station-button")).toBeInTheDocument();
    });
  });
});
