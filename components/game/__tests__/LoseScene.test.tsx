import { render, screen } from "@testing-library/react";
import { LoseScene } from "../LoseScene";

describe("LoseScene", () => {
  const defaultProps = {
    destination: "Mumbai Central",
    stationsStanding: 2,
    totalStations: 5,
    difficulty: "normal" as const,
  };

  it("renders lose scene container", () => {
    render(<LoseScene {...defaultProps} />);

    expect(screen.getByTestId("lose-scene")).toBeInTheDocument();
  });

  it("renders sad player character", () => {
    render(<LoseScene {...defaultProps} />);

    expect(screen.getByTestId("lose-character")).toBeInTheDocument();
    expect(screen.getByTestId("player-character-sad")).toBeInTheDocument();
  });

  it("displays lose title with red color", () => {
    render(<LoseScene {...defaultProps} />);

    const title = screen.getByTestId("game-end-title");
    expect(title).toHaveTextContent("You Lost!");
    expect(title).toHaveClass("text-red-600");
  });

  it("displays lose message with destination", () => {
    render(<LoseScene {...defaultProps} destination="Dadar" />);

    expect(screen.getByTestId("game-end-message")).toHaveTextContent(
      "You arrived at Dadar still standing!"
    );
  });

  describe("close message", () => {
    it("shows 'So close!' when one station away", () => {
      render(<LoseScene {...defaultProps} stationsStanding={4} totalStations={5} />);

      expect(screen.getByTestId("close-message")).toHaveTextContent(
        "So close! Just one more station..."
      );
    });

    it("shows stations survived message for earlier loss", () => {
      render(<LoseScene {...defaultProps} stationsStanding={2} totalStations={5} />);

      expect(screen.getByTestId("close-message")).toHaveTextContent(
        "You survived 2 stations standing!"
      );
    });

    it("handles singular station grammatically", () => {
      render(<LoseScene {...defaultProps} stationsStanding={1} totalStations={5} />);

      expect(screen.getByTestId("close-message")).toHaveTextContent(
        "You survived 1 station standing!"
      );
    });

    it("handles zero stations standing", () => {
      render(<LoseScene {...defaultProps} stationsStanding={0} totalStations={5} />);

      expect(screen.getByTestId("close-message")).toHaveTextContent(
        "You survived 0 stations standing!"
      );
    });

    it("shows close message when exactly at totalStations - 1", () => {
      render(<LoseScene {...defaultProps} stationsStanding={4} totalStations={5} />);

      expect(screen.getByTestId("close-message")).toHaveTextContent("So close!");
    });
  });

  describe("game stats", () => {
    it("renders game stats component", () => {
      render(<LoseScene {...defaultProps} />);

      expect(screen.getByTestId("game-stats")).toBeInTheDocument();
    });

    it("passes correct difficulty to stats", () => {
      render(<LoseScene {...defaultProps} difficulty="easy" />);

      expect(screen.getByTestId("stats-difficulty")).toHaveTextContent("Easy");
    });

    it("passes correct stations standing to stats", () => {
      render(<LoseScene {...defaultProps} stationsStanding={3} />);

      expect(screen.getByTestId("stats-stations")).toHaveTextContent("3");
    });

    it("does not show seated status in stats", () => {
      render(<LoseScene {...defaultProps} />);

      expect(screen.queryByTestId("stats-status")).not.toBeInTheDocument();
    });
  });

  it("does not show confetti", () => {
    render(<LoseScene {...defaultProps} />);

    expect(screen.queryByTestId("confetti-container")).not.toBeInTheDocument();
  });
});
