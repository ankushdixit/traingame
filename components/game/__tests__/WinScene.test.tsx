import { render, screen } from "@testing-library/react";
import { WinScene } from "../WinScene";

describe("WinScene", () => {
  const defaultProps = {
    destination: "Mumbai Central",
    stationsStanding: 2,
    difficulty: "normal" as const,
    showConfetti: true,
  };

  it("renders win scene container", () => {
    render(<WinScene {...defaultProps} />);

    expect(screen.getByTestId("win-scene")).toBeInTheDocument();
  });

  it("renders happy player character", () => {
    render(<WinScene {...defaultProps} />);

    expect(screen.getByTestId("win-character")).toBeInTheDocument();
    expect(screen.getByTestId("player-character-happy")).toBeInTheDocument();
  });

  it("displays win title with green color", () => {
    render(<WinScene {...defaultProps} />);

    const title = screen.getByTestId("game-end-title");
    expect(title).toHaveTextContent("You Won!");
    expect(title).toHaveClass("text-green-600");
  });

  it("displays win message with destination", () => {
    render(<WinScene {...defaultProps} destination="Dadar" />);

    expect(screen.getByTestId("game-end-message")).toHaveTextContent(
      "You found a seat before reaching Dadar!"
    );
  });

  it("has celebration animation on title", () => {
    render(<WinScene {...defaultProps} />);

    const title = screen.getByTestId("game-end-title");
    expect(title).toHaveClass("animate-celebrate");
  });

  describe("confetti display", () => {
    it("shows confetti when showConfetti is true", () => {
      render(<WinScene {...defaultProps} showConfetti={true} />);

      expect(screen.getByTestId("confetti-container")).toBeInTheDocument();
    });

    it("hides confetti when showConfetti is false", () => {
      render(<WinScene {...defaultProps} showConfetti={false} />);

      expect(screen.queryByTestId("confetti-container")).not.toBeInTheDocument();
    });

    it("defaults to showing confetti", () => {
      const propsWithoutConfetti = {
        destination: defaultProps.destination,
        stationsStanding: defaultProps.stationsStanding,
        difficulty: defaultProps.difficulty,
      };
      render(<WinScene {...propsWithoutConfetti} />);

      expect(screen.getByTestId("confetti-container")).toBeInTheDocument();
    });
  });

  describe("game stats", () => {
    it("renders game stats component", () => {
      render(<WinScene {...defaultProps} />);

      expect(screen.getByTestId("game-stats")).toBeInTheDocument();
    });

    it("passes correct difficulty to stats", () => {
      render(<WinScene {...defaultProps} difficulty="rush" />);

      expect(screen.getByTestId("stats-difficulty")).toHaveTextContent("Rush Hour");
    });

    it("passes correct stations standing to stats", () => {
      render(<WinScene {...defaultProps} stationsStanding={5} />);

      expect(screen.getByTestId("stats-stations")).toHaveTextContent("5");
    });

    it("shows seated status in stats", () => {
      render(<WinScene {...defaultProps} />);

      expect(screen.getByTestId("stats-status")).toHaveTextContent("Seated!");
    });
  });
});
