import { render, screen } from "@testing-library/react";
import { JourneyProgress } from "../JourneyProgress";

// Sample station arrays for testing
const SHORT_STATIONS = [
  "Churchgate",
  "Marine Lines",
  "Charni Road",
  "Grant Road",
  "Mumbai Central",
  "Dadar",
] as const;

const LONG_STATIONS = [
  "Station 1",
  "Station 2",
  "Station 3",
  "Station 4",
  "Station 5",
  "Station 6",
  "Station 7",
  "Station 8",
  "Station 9",
  "Station 10",
  "Station 11",
  "Station 12",
  "Station 13",
  "Station 14",
  "Station 15",
] as const;

describe("JourneyProgress", () => {
  const defaultProps = {
    stations: SHORT_STATIONS,
    currentStation: 0,
    destination: 5,
    boardingStation: 0,
  };

  describe("rendering", () => {
    it("renders journey progress container", () => {
      render(<JourneyProgress {...defaultProps} />);

      expect(screen.getByTestId("journey-progress")).toBeInTheDocument();
    });

    it("has aria-label for accessibility", () => {
      render(<JourneyProgress {...defaultProps} />);

      expect(screen.getByTestId("journey-progress")).toHaveAttribute(
        "aria-label",
        "Journey progress indicator"
      );
    });

    it("renders progress line", () => {
      render(<JourneyProgress {...defaultProps} />);

      expect(screen.getByTestId("progress-line")).toBeInTheDocument();
    });
  });

  describe("station dot count", () => {
    it("renders correct number of station dots for 6 stations", () => {
      render(<JourneyProgress {...defaultProps} />);

      const dots = screen.getAllByTestId(/^station-dot-\d+$/);
      expect(dots).toHaveLength(6);
    });

    it("renders correct number of station dots for 15 stations", () => {
      render(<JourneyProgress {...defaultProps} stations={LONG_STATIONS} destination={14} />);

      const dots = screen.getAllByTestId(/^station-dot-\d+$/);
      expect(dots).toHaveLength(15);
    });
  });

  describe("current station highlighting", () => {
    it("highlights first station when current is 0", () => {
      render(<JourneyProgress {...defaultProps} currentStation={0} />);

      const dot = screen.getByTestId("station-dot-0");
      expect(dot).toHaveClass("bg-blue-500");
    });

    it("highlights correct station when current is 3", () => {
      render(<JourneyProgress {...defaultProps} currentStation={3} />);

      const dot = screen.getByTestId("station-dot-3");
      expect(dot).toHaveClass("bg-blue-500");
    });
  });

  describe("destination marking", () => {
    it("marks destination station correctly", () => {
      render(<JourneyProgress {...defaultProps} destination={5} />);

      const dot = screen.getByTestId("station-dot-5");
      expect(dot).toHaveClass("bg-red-500");
    });

    it("marks different destination correctly", () => {
      render(<JourneyProgress {...defaultProps} destination={3} />);

      const dot = screen.getByTestId("station-dot-3");
      expect(dot).toHaveClass("bg-red-500");
    });
  });

  describe("passed stations", () => {
    it("marks no stations as passed when at first station", () => {
      render(<JourneyProgress {...defaultProps} currentStation={0} />);

      const dot1 = screen.getByTestId("station-dot-1");
      expect(dot1).not.toHaveClass("bg-emerald-500");
    });

    it("marks previous stations as passed when at station 3", () => {
      render(<JourneyProgress {...defaultProps} currentStation={3} />);

      // Stations 0, 1, 2 should be passed (emerald)
      const dot0 = screen.getByTestId("station-dot-0");
      const dot1 = screen.getByTestId("station-dot-1");
      const dot2 = screen.getByTestId("station-dot-2");

      expect(dot0).toHaveClass("bg-emerald-500");
      expect(dot1).toHaveClass("bg-emerald-500");
      expect(dot2).toHaveClass("bg-emerald-500");
    });
  });

  describe("progress line width", () => {
    it("has 0% width when at first station", () => {
      render(<JourneyProgress {...defaultProps} currentStation={0} />);

      const progressLine = screen.getByTestId("progress-line");
      expect(progressLine).toHaveStyle({ width: "0%" });
    });

    it("has 100% width when at last station", () => {
      render(<JourneyProgress {...defaultProps} currentStation={5} />);

      const progressLine = screen.getByTestId("progress-line");
      expect(progressLine).toHaveStyle({ width: "100%" });
    });

    it("has 60% width when at station 3 of 6", () => {
      render(<JourneyProgress {...defaultProps} currentStation={3} />);

      const progressLine = screen.getByTestId("progress-line");
      expect(progressLine).toHaveStyle({ width: "60%" });
    });
  });

  describe("urgency indicator", () => {
    it("does not apply pulse animation when more than 1 station away", () => {
      render(<JourneyProgress {...defaultProps} currentStation={3} destination={5} />);

      const currentDot = screen.getByTestId("station-dot-3");
      expect(currentDot).not.toHaveClass("animate-pulse");
    });

    it("applies pulse animation when exactly 1 station away", () => {
      render(<JourneyProgress {...defaultProps} currentStation={4} destination={5} />);

      const currentDot = screen.getByTestId("station-dot-4");
      expect(currentDot).toHaveClass("animate-pulse");
    });

    it("does not show urgency when at destination", () => {
      render(<JourneyProgress {...defaultProps} currentStation={5} destination={5} />);

      const currentDot = screen.getByTestId("station-dot-5");
      expect(currentDot).not.toHaveClass("animate-pulse");
    });
  });

  describe("station labels", () => {
    it("shows all station names", () => {
      render(<JourneyProgress {...defaultProps} />);

      expect(screen.getByText("Churchgate")).toBeInTheDocument();
      expect(screen.getByText("Marine Lines")).toBeInTheDocument();
      expect(screen.getByText("Charni Road")).toBeInTheDocument();
      expect(screen.getByText("Grant Road")).toBeInTheDocument();
      expect(screen.getByText("Mumbai Central")).toBeInTheDocument();
      expect(screen.getByText("Dadar")).toBeInTheDocument();
    });

    it("highlights current station label", () => {
      render(<JourneyProgress {...defaultProps} currentStation={2} />);

      const charniRoad = screen.getByText("Charni Road");
      expect(charniRoad).toHaveClass("text-blue-600", "font-bold");
    });

    it("highlights destination station label", () => {
      render(<JourneyProgress {...defaultProps} destination={5} />);

      const dadar = screen.getByText("Dadar");
      expect(dadar).toHaveClass("text-red-600", "font-bold");
    });
  });

  describe("scaling for different journey lengths", () => {
    it("renders correctly with 6 station journey", () => {
      render(<JourneyProgress {...defaultProps} />);

      const dots = screen.getAllByTestId(/^station-dot-\d+$/);
      expect(dots).toHaveLength(6);
    });

    it("renders correctly with 15 station journey", () => {
      render(
        <JourneyProgress
          stations={LONG_STATIONS}
          currentStation={7}
          destination={14}
          boardingStation={0}
        />
      );

      const dots = screen.getAllByTestId(/^station-dot-\d+$/);
      expect(dots).toHaveLength(15);

      // Verify current station
      const currentDot = screen.getByTestId("station-dot-7");
      expect(currentDot).toHaveClass("bg-blue-500");

      // Verify destination
      const destinationDot = screen.getByTestId("station-dot-14");
      expect(destinationDot).toHaveClass("bg-red-500");

      // Verify passed stations
      for (let i = 0; i < 7; i++) {
        const passedDot = screen.getByTestId(`station-dot-${i}`);
        expect(passedDot).toHaveClass("bg-emerald-500");
      }
    });

    it("handles boundary stations correctly at extremes", () => {
      render(
        <JourneyProgress {...defaultProps} boardingStation={0} currentStation={0} destination={1} />
      );

      const currentDot = screen.getByTestId("station-dot-0");
      expect(currentDot).toHaveClass("bg-blue-500");
      expect(currentDot).toHaveClass("animate-pulse"); // 1 station away from destination

      const destinationDot = screen.getByTestId("station-dot-1");
      expect(destinationDot).toHaveClass("bg-red-500");
    });
  });

  describe("edge cases", () => {
    it("handles current station at destination", () => {
      render(<JourneyProgress {...defaultProps} currentStation={5} destination={5} />);

      const dot = screen.getByTestId("station-dot-5");
      // Current station takes precedence in styling
      expect(dot).toHaveClass("bg-blue-500");
    });

    it("handles second-to-last station as boarding station", () => {
      render(
        <JourneyProgress {...defaultProps} boardingStation={4} currentStation={4} destination={5} />
      );

      const currentDot = screen.getByTestId("station-dot-4");
      expect(currentDot).toHaveClass("bg-blue-500");
      expect(currentDot).toHaveClass("animate-pulse"); // 1 station away
    });
  });

  describe("station icons", () => {
    it("shows train icon on current station", () => {
      render(<JourneyProgress {...defaultProps} currentStation={2} />);

      const dot = screen.getByTestId("station-dot-2");
      expect(dot).toHaveTextContent("🚃");
    });

    it("shows flag icon on destination station when not current", () => {
      render(<JourneyProgress {...defaultProps} currentStation={2} destination={5} />);

      const dot = screen.getByTestId("station-dot-5");
      expect(dot).toHaveTextContent("🚩");
    });

    it("shows train icon (not flag) when current station is destination", () => {
      render(<JourneyProgress {...defaultProps} currentStation={5} destination={5} />);

      const dot = screen.getByTestId("station-dot-5");
      expect(dot).toHaveTextContent("🚃");
      expect(dot).not.toHaveTextContent("🚩");
    });
  });

  describe("boarding indicator", () => {
    it("shows Start indicator at boarding station", () => {
      render(<JourneyProgress {...defaultProps} boardingStation={0} />);

      expect(screen.getByText("📍 Start")).toBeInTheDocument();
    });

    it("shows Start indicator at non-zero boarding station", () => {
      render(<JourneyProgress {...defaultProps} boardingStation={2} currentStation={3} />);

      expect(screen.getByText("📍 Start")).toBeInTheDocument();
    });
  });
});
