import { render, screen, fireEvent } from "@testing-library/react";
import { GameEndModal } from "../GameEndModal";

// Mock SoundContext since GameEndModal uses useSound
jest.mock("@/contexts/SoundContext", () => ({
  useSound: () => ({
    isMuted: false,
    toggleMute: jest.fn(),
    playSound: jest.fn(),
  }),
}));

describe("GameEndModal", () => {
  const defaultProps = {
    status: "won" as const,
    destination: "Mumbai Central",
    stationsStanding: 2,
    totalStations: 5,
    difficulty: "normal" as const,
    onPlayAgain: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when status is 'won'", () => {
    it("renders the modal with win message", () => {
      render(<GameEndModal {...defaultProps} />);

      expect(screen.getByTestId("game-end-modal")).toBeInTheDocument();
      expect(screen.getByTestId("game-end-title")).toHaveTextContent("You Found a Seat!");
    });

    it("shows win message with destination name", () => {
      render(<GameEndModal {...defaultProps} destination="Grant Road" />);

      expect(screen.getByTestId("game-end-message")).toHaveTextContent(
        "Now you can ride to Grant Road in comfort!"
      );
    });

    it("displays 'Play Again' button", () => {
      render(<GameEndModal {...defaultProps} />);

      expect(screen.getByTestId("play-again-button")).toHaveTextContent("Play Again");
    });

    it("applies emerald color to title", () => {
      render(<GameEndModal {...defaultProps} />);

      expect(screen.getByTestId("game-end-title")).toHaveClass("text-emerald-600");
    });

    it("renders the WinScene component", () => {
      render(<GameEndModal {...defaultProps} />);

      expect(screen.getByTestId("win-scene")).toBeInTheDocument();
      expect(screen.getByTestId("win-character")).toBeInTheDocument();
    });

    it("shows confetti on win", () => {
      render(<GameEndModal {...defaultProps} />);

      expect(screen.getByTestId("confetti-container")).toBeInTheDocument();
    });

    it("displays stations standing info", () => {
      render(<GameEndModal {...defaultProps} stationsStanding={2} />);

      expect(screen.getByText(/Stood for/i)).toBeInTheDocument();
      expect(screen.getByText(/2/)).toBeInTheDocument();
    });
  });

  describe("when status is 'lost'", () => {
    const lostProps = {
      ...defaultProps,
      status: "lost" as const,
    };

    it("renders the modal with lose message", () => {
      render(<GameEndModal {...lostProps} />);

      expect(screen.getByTestId("game-end-modal")).toBeInTheDocument();
      expect(screen.getByTestId("game-end-title")).toHaveTextContent("No Seat Found");
    });

    it("shows lose message with destination name", () => {
      render(<GameEndModal {...lostProps} destination="Dadar" />);

      expect(screen.getByTestId("game-end-message")).toHaveTextContent(
        "You arrived at Dadar standing the whole way!"
      );
    });

    it("displays 'Try Again' button", () => {
      render(<GameEndModal {...lostProps} />);

      expect(screen.getByTestId("play-again-button")).toHaveTextContent("Try Again");
    });

    it("applies rose color to title", () => {
      render(<GameEndModal {...lostProps} />);

      expect(screen.getByTestId("game-end-title")).toHaveClass("text-rose-600");
    });

    it("renders the LoseScene component", () => {
      render(<GameEndModal {...lostProps} />);

      expect(screen.getByTestId("lose-scene")).toBeInTheDocument();
      expect(screen.getByTestId("lose-character")).toBeInTheDocument();
    });

    it("does not show confetti on lose", () => {
      render(<GameEndModal {...lostProps} />);

      expect(screen.queryByTestId("confetti-container")).not.toBeInTheDocument();
    });

    it("shows close message for almost winning", () => {
      render(<GameEndModal {...lostProps} stationsStanding={4} totalStations={5} />);

      const message = screen.getByTestId("game-end-message");
      expect(message).toHaveTextContent("So close!");
    });

    it("displays stations standing for earlier loss", () => {
      render(<GameEndModal {...lostProps} stationsStanding={2} totalStations={5} />);

      expect(screen.getByText(/Stood for/i)).toBeInTheDocument();
      expect(screen.getByText(/2/)).toBeInTheDocument();
    });

    it("handles singular station standing message", () => {
      render(<GameEndModal {...lostProps} stationsStanding={1} totalStations={5} />);

      expect(screen.getByText(/1/)).toBeInTheDocument();
      expect(screen.getByText(/station$/)).toBeInTheDocument();
    });
  });

  describe("Play Again button", () => {
    it("calls onPlayAgain when clicked", () => {
      const onPlayAgain = jest.fn();
      render(<GameEndModal {...defaultProps} onPlayAgain={onPlayAgain} />);

      fireEvent.click(screen.getByTestId("play-again-button"));

      expect(onPlayAgain).toHaveBeenCalledTimes(1);
    });
  });

  describe("modal overlay", () => {
    it("renders with fixed positioning to cover the screen", () => {
      render(<GameEndModal {...defaultProps} />);

      const modal = screen.getByTestId("game-end-modal");
      expect(modal).toHaveClass("fixed", "inset-0", "z-50");
    });

    it("has accessible modal attributes", () => {
      render(<GameEndModal {...defaultProps} />);

      const modal = screen.getByTestId("game-end-modal");
      expect(modal).toHaveAttribute("role", "dialog");
      expect(modal).toHaveAttribute("aria-modal", "true");
      expect(modal).toHaveAttribute("aria-labelledby", "game-end-title");
    });

    it("has backdrop blur styling", () => {
      render(<GameEndModal {...defaultProps} />);

      const modal = screen.getByTestId("game-end-modal");
      expect(modal).toHaveClass("bg-black/60");
    });
  });

  describe("animation skip", () => {
    it("hides confetti when overlay is clicked", () => {
      render(<GameEndModal {...defaultProps} />);

      expect(screen.getByTestId("confetti-container")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("game-end-modal"));

      expect(screen.queryByTestId("confetti-container")).not.toBeInTheDocument();
    });

    it("does not hide confetti when content is clicked", () => {
      render(<GameEndModal {...defaultProps} />);

      const content = screen.getByTestId("win-scene").parentElement;
      if (content) {
        fireEvent.click(content);
      }

      expect(screen.getByTestId("confetti-container")).toBeInTheDocument();
    });
  });

  describe("destination display", () => {
    it("displays correct destination for each station", () => {
      const stations = [
        "Churchgate",
        "Marine Lines",
        "Charni Road",
        "Grant Road",
        "Mumbai Central",
        "Dadar",
      ];

      stations.forEach((station) => {
        const { unmount } = render(<GameEndModal {...defaultProps} destination={station} />);

        expect(screen.getByTestId("game-end-message")).toHaveTextContent(station);

        unmount();
      });
    });
  });

  describe("game stats display", () => {
    it("shows correct difficulty", () => {
      render(<GameEndModal {...defaultProps} difficulty="rush" />);

      expect(screen.getByText(/Rush/i)).toBeInTheDocument();
    });

    it("shows correct stations standing count", () => {
      render(<GameEndModal {...defaultProps} stationsStanding={3} />);

      expect(screen.getByText(/Stood for/i)).toBeInTheDocument();
      expect(screen.getByText(/3/)).toBeInTheDocument();
    });
  });
});
