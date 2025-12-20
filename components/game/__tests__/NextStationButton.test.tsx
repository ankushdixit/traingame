import { render, screen, fireEvent } from "@testing-library/react";
import { NextStationButton } from "../NextStationButton";

describe("NextStationButton", () => {
  const defaultProps = {
    currentStation: 0,
    onAdvance: jest.fn(),
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("button text", () => {
    it("shows 'Next: [station]' for non-final stations", () => {
      render(<NextStationButton {...defaultProps} currentStation={0} />);

      expect(screen.getByTestId("next-station-button")).toHaveTextContent("Next: Marine Lines");
    });

    it("shows correct next station name for each station", () => {
      const expectedStations = [
        { current: 0, next: "Marine Lines" },
        { current: 1, next: "Charni Road" },
        { current: 2, next: "Grant Road" },
        { current: 3, next: "Mumbai Central" },
      ];

      expectedStations.forEach(({ current, next }) => {
        const { unmount } = render(
          <NextStationButton {...defaultProps} currentStation={current} />
        );

        expect(screen.getByTestId("next-station-button")).toHaveTextContent(`Next: ${next}`);
        unmount();
      });
    });

    it("shows 'Arrive at [station]' for final station", () => {
      render(<NextStationButton {...defaultProps} currentStation={4} />);

      expect(screen.getByTestId("next-station-button")).toHaveTextContent("Arrive at Dadar");
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

    it("has gray styling when disabled", () => {
      render(<NextStationButton {...defaultProps} disabled={true} />);

      expect(screen.getByTestId("next-station-button")).toHaveClass("bg-gray-300");
      expect(screen.getByTestId("next-station-button")).toHaveClass("cursor-not-allowed");
    });

    it("has blue styling when enabled", () => {
      render(<NextStationButton {...defaultProps} disabled={false} />);

      expect(screen.getByTestId("next-station-button")).toHaveClass("bg-blue-500");
    });
  });

  describe("testid", () => {
    it("has next-station-button testid", () => {
      render(<NextStationButton {...defaultProps} />);

      expect(screen.getByTestId("next-station-button")).toBeInTheDocument();
    });
  });
});
