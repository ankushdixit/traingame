import { render, screen } from "@testing-library/react";
import { GameStats } from "../GameStats";

describe("GameStats", () => {
  const defaultProps = {
    stationsStanding: 3,
    difficulty: "normal" as const,
    isWin: true,
  };

  describe("difficulty display", () => {
    it("shows Easy difficulty correctly", () => {
      render(<GameStats {...defaultProps} difficulty="easy" />);

      expect(screen.getByTestId("stats-difficulty")).toHaveTextContent("Easy");
    });

    it("shows Normal difficulty correctly", () => {
      render(<GameStats {...defaultProps} difficulty="normal" />);

      expect(screen.getByTestId("stats-difficulty")).toHaveTextContent("Normal");
    });

    it("shows Rush Hour difficulty correctly", () => {
      render(<GameStats {...defaultProps} difficulty="rush" />);

      expect(screen.getByTestId("stats-difficulty")).toHaveTextContent("Rush Hour");
    });
  });

  describe("stations standing display", () => {
    it("shows stations standing count", () => {
      render(<GameStats {...defaultProps} stationsStanding={4} />);

      expect(screen.getByTestId("stats-stations")).toHaveTextContent("4");
    });

    it("shows zero stations standing", () => {
      render(<GameStats {...defaultProps} stationsStanding={0} />);

      expect(screen.getByTestId("stats-stations")).toHaveTextContent("0");
    });
  });

  describe("win status", () => {
    it("shows Seated! status when player wins", () => {
      render(<GameStats {...defaultProps} isWin={true} />);

      expect(screen.getByTestId("stats-status")).toBeInTheDocument();
      expect(screen.getByTestId("stats-status")).toHaveTextContent("Seated!");
    });

    it("shows status in green color when player wins", () => {
      render(<GameStats {...defaultProps} isWin={true} />);

      expect(screen.getByTestId("stats-status")).toHaveClass("text-green-600");
    });

    it("does not show status when player loses", () => {
      render(<GameStats {...defaultProps} isWin={false} />);

      expect(screen.queryByTestId("stats-status")).not.toBeInTheDocument();
    });
  });

  describe("container styling", () => {
    it("has proper styling classes", () => {
      render(<GameStats {...defaultProps} />);

      const container = screen.getByTestId("game-stats");
      expect(container).toHaveClass("rounded-lg", "bg-gray-100", "p-3", "text-sm");
    });
  });
});
