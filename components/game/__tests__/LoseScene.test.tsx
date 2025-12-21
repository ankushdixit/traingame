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

  it("displays lose title with rose color", () => {
    render(<LoseScene {...defaultProps} />);

    const title = screen.getByTestId("game-end-title");
    expect(title).toHaveTextContent("No Seat Found");
    expect(title).toHaveClass("text-rose-600");
  });

  it("displays lose message with destination", () => {
    render(<LoseScene {...defaultProps} destination="Dadar" />);

    expect(screen.getByTestId("game-end-message")).toHaveTextContent(
      "You arrived at Dadar standing the whole way!"
    );
  });

  describe("close message", () => {
    it("shows 'So close!' when one station away", () => {
      render(<LoseScene {...defaultProps} stationsStanding={4} totalStations={5} />);

      const message = screen.getByTestId("game-end-message");
      expect(message).toHaveTextContent("So close!");
    });

    it("does not show close message for earlier loss", () => {
      render(<LoseScene {...defaultProps} stationsStanding={2} totalStations={5} />);

      const message = screen.getByTestId("game-end-message");
      expect(message).not.toHaveTextContent("So close!");
    });

    it("shows close message when exactly at totalStations - 1", () => {
      render(<LoseScene {...defaultProps} stationsStanding={4} totalStations={5} />);

      expect(screen.getByText("So close!")).toBeInTheDocument();
    });
  });

  describe("stats display", () => {
    it("displays stations standing count", () => {
      render(<LoseScene {...defaultProps} stationsStanding={3} />);

      expect(screen.getByText(/Stood for/i)).toBeInTheDocument();
      expect(screen.getByText(/3/)).toBeInTheDocument();
      expect(screen.getByText(/stations/)).toBeInTheDocument();
    });

    it("displays singular station when standing is 1", () => {
      render(<LoseScene {...defaultProps} stationsStanding={1} />);

      expect(screen.getByText(/1/)).toBeInTheDocument();
      expect(screen.getByText(/station$/)).toBeInTheDocument();
    });

    it("displays difficulty level", () => {
      render(<LoseScene {...defaultProps} difficulty="easy" />);

      expect(screen.getByText(/Easy/i)).toBeInTheDocument();
    });

    it("displays difficulty emoji", () => {
      render(<LoseScene {...defaultProps} difficulty="normal" />);

      expect(screen.getByText(/😤/)).toBeInTheDocument();
    });
  });

  it("does not show confetti", () => {
    render(<LoseScene {...defaultProps} />);

    expect(screen.queryByTestId("confetti-container")).not.toBeInTheDocument();
  });
});
