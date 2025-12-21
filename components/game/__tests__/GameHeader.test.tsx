import { render, screen } from "@testing-library/react";
import { GameHeader } from "../GameHeader";
import { Difficulty } from "@/lib/types";

// Mock SoundContext since GameHeader includes SoundToggle
jest.mock("@/contexts/SoundContext", () => ({
  useSound: () => ({
    isMuted: false,
    toggleMute: jest.fn(),
    playSound: jest.fn(),
  }),
}));

const defaultProps = {
  currentStation: 0,
  playerDestination: 5,
  playerSeated: false,
  difficulty: "normal" as Difficulty,
};

describe("GameHeader", () => {
  describe("game title display", () => {
    it("displays Mumbai Local title", () => {
      render(<GameHeader {...defaultProps} />);

      expect(screen.getByTestId("game-title")).toHaveTextContent("Mumbai Local");
    });
  });

  describe("current station display", () => {
    it("displays current station name for Churchgate", () => {
      render(<GameHeader {...defaultProps} currentStation={0} />);

      expect(screen.getByTestId("current-station")).toHaveTextContent("Churchgate");
    });

    it("displays current station name for Marine Lines", () => {
      render(<GameHeader {...defaultProps} currentStation={1} />);

      expect(screen.getByTestId("current-station")).toHaveTextContent("Marine Lines");
    });

    it("displays current station name for Mumbai Central", () => {
      render(<GameHeader {...defaultProps} currentStation={4} />);

      expect(screen.getByTestId("current-station")).toHaveTextContent("Mumbai Central");
    });
  });

  describe("player status display", () => {
    it("displays standing status when player is not seated", () => {
      render(<GameHeader {...defaultProps} playerSeated={false} />);

      expect(screen.getByTestId("player-status")).toHaveTextContent("Standing");
    });

    it("displays seated status when player is seated", () => {
      render(<GameHeader {...defaultProps} playerSeated={true} />);

      expect(screen.getByTestId("player-status")).toHaveTextContent("Seated");
    });
  });

  describe("difficulty display", () => {
    it("displays Easy difficulty", () => {
      render(<GameHeader {...defaultProps} difficulty="easy" />);

      const difficultyDisplay = screen.getByTestId("difficulty-display");
      expect(difficultyDisplay).toHaveTextContent("Easy");
    });

    it("displays Normal difficulty", () => {
      render(<GameHeader {...defaultProps} difficulty="normal" />);

      const difficultyDisplay = screen.getByTestId("difficulty-display");
      expect(difficultyDisplay).toHaveTextContent("Normal");
    });

    it("displays Rush Hour difficulty", () => {
      render(<GameHeader {...defaultProps} difficulty="rush" />);

      const difficultyDisplay = screen.getByTestId("difficulty-display");
      expect(difficultyDisplay).toHaveTextContent("Rush Hour");
    });
  });

  describe("styling", () => {
    it("has rose gradient background", () => {
      render(<GameHeader {...defaultProps} />);

      const header = screen.getByTestId("game-header");
      expect(header).toHaveClass("bg-gradient-to-r", "from-rose-700", "to-rose-800");
    });

    it("has white text", () => {
      render(<GameHeader {...defaultProps} />);

      const header = screen.getByTestId("game-header");
      expect(header).toHaveClass("text-white");
    });
  });

  it("has game-header testid", () => {
    render(<GameHeader {...defaultProps} />);

    expect(screen.getByTestId("game-header")).toBeInTheDocument();
  });
});
