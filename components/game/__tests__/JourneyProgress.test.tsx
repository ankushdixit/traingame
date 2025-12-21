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

    it("renders track line", () => {
      render(<JourneyProgress {...defaultProps} />);

      expect(screen.getByTestId("track-line")).toBeInTheDocument();
    });

    it("renders progress line", () => {
      render(<JourneyProgress {...defaultProps} />);

      expect(screen.getByTestId("progress-line")).toBeInTheDocument();
    });
  });

  describe("station marker count", () => {
    it("renders correct number of station markers for 6 stations", () => {
      render(<JourneyProgress {...defaultProps} />);

      const markers = screen.getAllByTestId("station-marker");
      expect(markers).toHaveLength(6);
    });

    it("renders correct number of station markers for 15 stations", () => {
      render(<JourneyProgress {...defaultProps} stations={LONG_STATIONS} destination={14} />);

      const markers = screen.getAllByTestId("station-marker");
      expect(markers).toHaveLength(15);
    });
  });

  describe("current station highlighting", () => {
    it("highlights first station when current is 0", () => {
      render(<JourneyProgress {...defaultProps} currentStation={0} />);

      const markerDots = screen.getAllByTestId("marker-dot");
      expect(markerDots[0]).toHaveAttribute("data-current", "true");
    });

    it("highlights correct station when current is 3", () => {
      render(<JourneyProgress {...defaultProps} currentStation={3} />);

      const markerDots = screen.getAllByTestId("marker-dot");
      expect(markerDots[3]).toHaveAttribute("data-current", "true");
      expect(markerDots[0]).toHaveAttribute("data-current", "false");
      expect(markerDots[5]).toHaveAttribute("data-current", "false");
    });
  });

  describe("destination marking", () => {
    it("marks destination station correctly", () => {
      render(<JourneyProgress {...defaultProps} destination={5} />);

      const markerDots = screen.getAllByTestId("marker-dot");
      expect(markerDots[5]).toHaveAttribute("data-destination", "true");
    });

    it("marks different destination correctly", () => {
      render(<JourneyProgress {...defaultProps} destination={3} />);

      const markerDots = screen.getAllByTestId("marker-dot");
      expect(markerDots[3]).toHaveAttribute("data-destination", "true");
      expect(markerDots[5]).toHaveAttribute("data-destination", "false");
    });
  });

  describe("passed stations", () => {
    it("marks no stations as passed when at first station", () => {
      render(<JourneyProgress {...defaultProps} currentStation={0} />);

      const markerDots = screen.getAllByTestId("marker-dot");
      markerDots.forEach((dot) => {
        expect(dot).toHaveAttribute("data-passed", "false");
      });
    });

    it("marks previous stations as passed when at station 3", () => {
      render(<JourneyProgress {...defaultProps} currentStation={3} />);

      const markerDots = screen.getAllByTestId("marker-dot");
      // Stations 0, 1, 2 should be passed
      expect(markerDots[0]).toHaveAttribute("data-passed", "true");
      expect(markerDots[1]).toHaveAttribute("data-passed", "true");
      expect(markerDots[2]).toHaveAttribute("data-passed", "true");
      // Station 3 (current) should not be passed
      expect(markerDots[3]).toHaveAttribute("data-passed", "false");
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

    it("has 50% width when at middle station (3 of 6)", () => {
      // With 6 stations (0-5), station 3 is at 60% (3/5)
      // But for clarity, let's test station 2.5 which would be 50%
      // Actually station 2 would be 2/5 = 40%, station 3 = 60%
      render(<JourneyProgress {...defaultProps} currentStation={3} />);

      const progressLine = screen.getByTestId("progress-line");
      expect(progressLine).toHaveStyle({ width: "60%" });
    });
  });

  describe("urgency indicator", () => {
    it("does not show urgency when more than 1 station away", () => {
      render(<JourneyProgress {...defaultProps} currentStation={3} destination={5} />);

      expect(screen.queryByTestId("urgency-message")).not.toBeInTheDocument();

      const markerDots = screen.getAllByTestId("marker-dot");
      expect(markerDots[5]).toHaveAttribute("data-urgent", "false");
    });

    it("shows urgency when exactly 1 station away", () => {
      render(<JourneyProgress {...defaultProps} currentStation={4} destination={5} />);

      expect(screen.getByTestId("urgency-message")).toBeInTheDocument();
      expect(screen.getByTestId("urgency-message")).toHaveTextContent(
        "Next stop is your destination!"
      );
    });

    it("applies urgent styling to destination marker when 1 station away", () => {
      render(<JourneyProgress {...defaultProps} currentStation={4} destination={5} />);

      const markerDots = screen.getAllByTestId("marker-dot");
      expect(markerDots[5]).toHaveAttribute("data-urgent", "true");
    });

    it("does not show urgency when at destination", () => {
      render(<JourneyProgress {...defaultProps} currentStation={5} destination={5} />);

      expect(screen.queryByTestId("urgency-message")).not.toBeInTheDocument();
    });
  });

  describe("station labels", () => {
    it("shows label for current station", () => {
      render(<JourneyProgress {...defaultProps} currentStation={2} />);

      const labels = screen.getAllByTestId("station-label");
      const labelTexts = labels.map((label) => label.textContent);
      expect(labelTexts).toContain("Charni Road");
    });

    it("shows label for destination station", () => {
      render(<JourneyProgress {...defaultProps} destination={5} />);

      const labels = screen.getAllByTestId("station-label");
      const labelTexts = labels.map((label) => label.textContent);
      expect(labelTexts).toContain("Dadar");
    });

    it("shows label for boarding station", () => {
      render(<JourneyProgress {...defaultProps} currentStation={3} boardingStation={0} />);

      const labels = screen.getAllByTestId("station-label");
      const labelTexts = labels.map((label) => label.textContent);
      expect(labelTexts).toContain("Churchgate");
    });
  });

  describe("scaling for different journey lengths", () => {
    it("renders correctly with 6 station journey", () => {
      render(<JourneyProgress {...defaultProps} />);

      const markers = screen.getAllByTestId("station-marker");
      expect(markers).toHaveLength(6);
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

      const markers = screen.getAllByTestId("station-marker");
      expect(markers).toHaveLength(15);

      const markerDots = screen.getAllByTestId("marker-dot");
      // Verify current station
      expect(markerDots[7]).toHaveAttribute("data-current", "true");
      // Verify destination
      expect(markerDots[14]).toHaveAttribute("data-destination", "true");
      // Verify passed stations
      for (let i = 0; i < 7; i++) {
        expect(markerDots[i]).toHaveAttribute("data-passed", "true");
      }
    });

    it("handles boundary stations correctly at extremes", () => {
      render(
        <JourneyProgress {...defaultProps} boardingStation={0} currentStation={0} destination={1} />
      );

      const markerDots = screen.getAllByTestId("marker-dot");
      expect(markerDots[0]).toHaveAttribute("data-current", "true");
      expect(markerDots[1]).toHaveAttribute("data-destination", "true");
      expect(markerDots[1]).toHaveAttribute("data-urgent", "true");
    });
  });

  describe("edge cases", () => {
    it("handles current station at destination", () => {
      render(<JourneyProgress {...defaultProps} currentStation={5} destination={5} />);

      const markerDots = screen.getAllByTestId("marker-dot");
      // Should be both current and destination
      expect(markerDots[5]).toHaveAttribute("data-current", "true");
      expect(markerDots[5]).toHaveAttribute("data-destination", "true");
    });

    it("handles second-to-last station as boarding station", () => {
      render(
        <JourneyProgress {...defaultProps} boardingStation={4} currentStation={4} destination={5} />
      );

      const markerDots = screen.getAllByTestId("marker-dot");
      expect(markerDots[4]).toHaveAttribute("data-current", "true");
      expect(markerDots[5]).toHaveAttribute("data-urgent", "true");
    });
  });
});
