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

  it("displays win title with emerald color", () => {
    render(<WinScene {...defaultProps} />);

    const title = screen.getByTestId("game-end-title");
    expect(title).toHaveTextContent("You Found a Seat!");
    expect(title).toHaveClass("text-emerald-600");
  });

  it("displays win message with destination", () => {
    render(<WinScene {...defaultProps} destination="Dadar" />);

    expect(screen.getByTestId("game-end-message")).toHaveTextContent(
      "Now you can ride to Dadar in comfort!"
    );
  });

  it("has bounce animation on emoji", () => {
    render(<WinScene {...defaultProps} />);

    const emoji = screen.getByText("🎉");
    expect(emoji).toHaveClass("animate-bounce");
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

  describe("stats display", () => {
    it("displays stations standing count", () => {
      render(<WinScene {...defaultProps} stationsStanding={3} />);

      expect(screen.getByText(/Stood for/i)).toBeInTheDocument();
      expect(screen.getByText(/3/)).toBeInTheDocument();
      expect(screen.getByText(/stations/)).toBeInTheDocument();
    });

    it("displays singular station when standing is 1", () => {
      render(<WinScene {...defaultProps} stationsStanding={1} />);

      expect(screen.getByText(/1/)).toBeInTheDocument();
      expect(screen.getByText(/station$/)).toBeInTheDocument();
    });

    it("displays difficulty level", () => {
      render(<WinScene {...defaultProps} difficulty="rush" />);

      expect(screen.getByText(/Rush/i)).toBeInTheDocument();
    });

    it("displays difficulty emoji", () => {
      render(<WinScene {...defaultProps} difficulty="normal" />);

      expect(screen.getByText(/😤/)).toBeInTheDocument();
    });
  });
});
