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
  difficulty: "normal" as Difficulty,
};

describe("GameHeader", () => {
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

  describe("next station display", () => {
    it("displays next station for Churchgate", () => {
      render(<GameHeader {...defaultProps} currentStation={0} />);

      expect(screen.getByTestId("next-station")).toHaveTextContent("Next: Marine Lines");
    });

    it("displays next station for Charni Road", () => {
      render(<GameHeader {...defaultProps} currentStation={2} />);

      expect(screen.getByTestId("next-station")).toHaveTextContent("Next: Grant Road");
    });

    it("displays 'Final: Dadar' when at Mumbai Central", () => {
      render(<GameHeader {...defaultProps} currentStation={4} />);

      expect(screen.getByTestId("next-station")).toHaveTextContent("Final: Dadar");
    });
  });

  describe("destination display", () => {
    it("displays player destination for Dadar", () => {
      render(<GameHeader {...defaultProps} playerDestination={5} />);

      expect(screen.getByTestId("destination")).toHaveTextContent("Your destination: Dadar");
    });

    it("displays player destination for Grant Road", () => {
      render(<GameHeader {...defaultProps} playerDestination={3} />);

      expect(screen.getByTestId("destination")).toHaveTextContent("Your destination: Grant Road");
    });

    it("displays player destination for Mumbai Central", () => {
      render(<GameHeader {...defaultProps} playerDestination={4} />);

      expect(screen.getByTestId("destination")).toHaveTextContent(
        "Your destination: Mumbai Central"
      );
    });
  });

  describe("remaining stations calculation", () => {
    it("calculates 5 remaining stations from Churchgate to Dadar", () => {
      render(<GameHeader {...defaultProps} currentStation={0} playerDestination={5} />);

      expect(screen.getByTestId("remaining-stations")).toHaveTextContent("5 stations remaining");
    });

    it("calculates 3 remaining stations from Charni Road to Dadar", () => {
      render(<GameHeader {...defaultProps} currentStation={2} playerDestination={5} />);

      expect(screen.getByTestId("remaining-stations")).toHaveTextContent("3 stations remaining");
    });

    it("calculates 1 remaining station from Mumbai Central to Dadar", () => {
      render(<GameHeader {...defaultProps} currentStation={4} playerDestination={5} />);

      expect(screen.getByTestId("remaining-stations")).toHaveTextContent("1 station remaining");
    });

    it("calculates 2 remaining stations from Marine Lines to Grant Road", () => {
      render(<GameHeader {...defaultProps} currentStation={1} playerDestination={3} />);

      expect(screen.getByTestId("remaining-stations")).toHaveTextContent("2 stations remaining");
    });

    it("uses singular 'station' for 1 remaining", () => {
      render(<GameHeader {...defaultProps} currentStation={4} playerDestination={5} />);

      expect(screen.getByTestId("remaining-stations")).toHaveTextContent("1 station remaining");
      expect(screen.getByTestId("remaining-stations")).not.toHaveTextContent("stations");
    });
  });

  describe("difficulty badge", () => {
    it("displays Easy badge for easy difficulty", () => {
      render(<GameHeader {...defaultProps} difficulty="easy" />);

      const badge = screen.getByTestId("difficulty-badge");
      expect(badge).toHaveTextContent("Easy");
      expect(badge).toHaveClass("bg-green-100", "text-green-800");
    });

    it("displays Normal badge for normal difficulty", () => {
      render(<GameHeader {...defaultProps} difficulty="normal" />);

      const badge = screen.getByTestId("difficulty-badge");
      expect(badge).toHaveTextContent("Normal");
      expect(badge).toHaveClass("bg-blue-100", "text-blue-800");
    });

    it("displays Rush Hour badge for rush difficulty", () => {
      render(<GameHeader {...defaultProps} difficulty="rush" />);

      const badge = screen.getByTestId("difficulty-badge");
      expect(badge).toHaveTextContent("Rush Hour");
      expect(badge).toHaveClass("bg-red-100", "text-red-800");
    });

    it("has difficulty-badge testid", () => {
      render(<GameHeader {...defaultProps} />);

      expect(screen.getByTestId("difficulty-badge")).toBeInTheDocument();
    });
  });

  it("has game-header testid", () => {
    render(<GameHeader {...defaultProps} />);

    expect(screen.getByTestId("game-header")).toBeInTheDocument();
  });
});
