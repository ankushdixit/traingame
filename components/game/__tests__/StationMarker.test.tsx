import { render, screen } from "@testing-library/react";
import { StationMarker } from "../StationMarker";

describe("StationMarker", () => {
  const defaultProps = {
    name: "Test Station",
    isCurrent: false,
    isDestination: false,
    isPassed: false,
    isBoarding: false,
    isUrgent: false,
  };

  describe("rendering", () => {
    it("renders station marker", () => {
      render(<StationMarker {...defaultProps} />);

      expect(screen.getByTestId("station-marker")).toBeInTheDocument();
    });

    it("renders marker dot", () => {
      render(<StationMarker {...defaultProps} />);

      expect(screen.getByTestId("marker-dot")).toBeInTheDocument();
    });

    it("sets title attribute to station name for hover", () => {
      render(<StationMarker {...defaultProps} name="Marine Lines" />);

      expect(screen.getByTestId("station-marker")).toHaveAttribute("title", "Marine Lines");
    });
  });

  describe("current station styling", () => {
    it("has data-current attribute when current", () => {
      render(<StationMarker {...defaultProps} isCurrent={true} />);

      expect(screen.getByTestId("marker-dot")).toHaveAttribute("data-current", "true");
    });

    it("displays train emoji when current", () => {
      render(<StationMarker {...defaultProps} isCurrent={true} />);

      expect(screen.getByRole("img", { name: "train" })).toBeInTheDocument();
    });

    it("has larger size when current", () => {
      render(<StationMarker {...defaultProps} isCurrent={true} />);

      const markerDot = screen.getByTestId("marker-dot");
      expect(markerDot).toHaveClass("h-8", "w-8");
    });

    it("has blue styling when current", () => {
      render(<StationMarker {...defaultProps} isCurrent={true} />);

      const markerDot = screen.getByTestId("marker-dot");
      expect(markerDot).toHaveClass("bg-blue-500", "border-blue-600");
    });
  });

  describe("destination station styling", () => {
    it("has data-destination attribute when destination", () => {
      render(<StationMarker {...defaultProps} isDestination={true} />);

      expect(screen.getByTestId("marker-dot")).toHaveAttribute("data-destination", "true");
    });

    it("displays flag emoji when destination and not current", () => {
      render(<StationMarker {...defaultProps} isDestination={true} />);

      expect(screen.getByRole("img", { name: "destination flag" })).toBeInTheDocument();
    });

    it("does not display flag emoji when destination and current", () => {
      render(<StationMarker {...defaultProps} isDestination={true} isCurrent={true} />);

      expect(screen.queryByRole("img", { name: "destination flag" })).not.toBeInTheDocument();
    });

    it("has green styling when destination and not current", () => {
      render(<StationMarker {...defaultProps} isDestination={true} />);

      const markerDot = screen.getByTestId("marker-dot");
      expect(markerDot).toHaveClass("bg-green-500", "border-green-600");
    });
  });

  describe("passed station styling", () => {
    it("has data-passed attribute when passed", () => {
      render(<StationMarker {...defaultProps} isPassed={true} />);

      expect(screen.getByTestId("marker-dot")).toHaveAttribute("data-passed", "true");
    });

    it("has dimmed styling when passed", () => {
      render(<StationMarker {...defaultProps} isPassed={true} />);

      const markerDot = screen.getByTestId("marker-dot");
      expect(markerDot).toHaveClass("bg-gray-300", "border-gray-400");
    });
  });

  describe("future station styling", () => {
    it("has white background for future stations", () => {
      render(<StationMarker {...defaultProps} />);

      const markerDot = screen.getByTestId("marker-dot");
      expect(markerDot).toHaveClass("bg-white", "border-gray-400");
    });

    it("has small size for non-current stations", () => {
      render(<StationMarker {...defaultProps} />);

      const markerDot = screen.getByTestId("marker-dot");
      expect(markerDot).toHaveClass("h-4", "w-4");
    });
  });

  describe("urgency styling", () => {
    it("has data-urgent attribute when urgent", () => {
      render(<StationMarker {...defaultProps} isDestination={true} isUrgent={true} />);

      expect(screen.getByTestId("marker-dot")).toHaveAttribute("data-urgent", "true");
    });

    it("has urgency animation when urgent", () => {
      render(<StationMarker {...defaultProps} isDestination={true} isUrgent={true} />);

      const markerDot = screen.getByTestId("marker-dot");
      expect(markerDot).toHaveClass("animate-urgent", "ring-2", "ring-red-400");
    });
  });

  describe("station label visibility", () => {
    it("shows label when current station", () => {
      render(<StationMarker {...defaultProps} name="Churchgate" isCurrent={true} />);

      expect(screen.getByTestId("station-label")).toHaveTextContent("Churchgate");
    });

    it("shows label when destination station", () => {
      render(<StationMarker {...defaultProps} name="Dadar" isDestination={true} />);

      expect(screen.getByTestId("station-label")).toHaveTextContent("Dadar");
    });

    it("shows label when boarding station", () => {
      render(<StationMarker {...defaultProps} name="Marine Lines" isBoarding={true} />);

      expect(screen.getByTestId("station-label")).toHaveTextContent("Marine Lines");
    });

    it("does not show label for regular future stations", () => {
      render(<StationMarker {...defaultProps} name="Grant Road" />);

      expect(screen.queryByTestId("station-label")).not.toBeInTheDocument();
    });

    it("does not show label for passed stations", () => {
      render(<StationMarker {...defaultProps} name="Charni Road" isPassed={true} />);

      expect(screen.queryByTestId("station-label")).not.toBeInTheDocument();
    });
  });

  describe("combined states", () => {
    it("prioritizes current styling over destination styling", () => {
      render(<StationMarker {...defaultProps} isCurrent={true} isDestination={true} />);

      const markerDot = screen.getByTestId("marker-dot");
      // Should have blue (current) styling, not green (destination)
      expect(markerDot).toHaveClass("bg-blue-500");
      expect(markerDot).not.toHaveClass("bg-green-500");
    });

    it("displays train emoji when current and destination", () => {
      render(<StationMarker {...defaultProps} isCurrent={true} isDestination={true} />);

      // Should show train, not flag
      expect(screen.getByRole("img", { name: "train" })).toBeInTheDocument();
      expect(screen.queryByRole("img", { name: "destination flag" })).not.toBeInTheDocument();
    });
  });
});
