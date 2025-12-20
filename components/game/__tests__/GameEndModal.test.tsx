import { render, screen, fireEvent } from "@testing-library/react";
import { GameEndModal } from "../GameEndModal";

describe("GameEndModal", () => {
  const defaultProps = {
    status: "won" as const,
    destination: "Mumbai Central",
    onPlayAgain: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when status is 'won'", () => {
    it("renders the modal with win message", () => {
      render(<GameEndModal {...defaultProps} />);

      expect(screen.getByTestId("game-end-modal")).toBeInTheDocument();
      expect(screen.getByTestId("game-end-title")).toHaveTextContent("You Won!");
    });

    it("shows win message with destination name", () => {
      render(<GameEndModal {...defaultProps} destination="Grant Road" />);

      expect(screen.getByTestId("game-end-message")).toHaveTextContent(
        "You found a seat before reaching Grant Road!"
      );
    });

    it("displays 'Play Again' button", () => {
      render(<GameEndModal {...defaultProps} />);

      expect(screen.getByTestId("play-again-button")).toHaveTextContent("Play Again");
    });

    it("applies green color to title", () => {
      render(<GameEndModal {...defaultProps} />);

      expect(screen.getByTestId("game-end-title")).toHaveClass("text-green-600");
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
      expect(screen.getByTestId("game-end-title")).toHaveTextContent("You Lost!");
    });

    it("shows lose message with destination name", () => {
      render(<GameEndModal {...lostProps} destination="Dadar" />);

      expect(screen.getByTestId("game-end-message")).toHaveTextContent(
        "You arrived at Dadar still standing!"
      );
    });

    it("displays 'Try Again' button", () => {
      render(<GameEndModal {...lostProps} />);

      expect(screen.getByTestId("play-again-button")).toHaveTextContent("Try Again");
    });

    it("applies red color to title", () => {
      render(<GameEndModal {...lostProps} />);

      expect(screen.getByTestId("game-end-title")).toHaveClass("text-red-600");
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

    it("has semi-transparent background", () => {
      render(<GameEndModal {...defaultProps} />);

      const modal = screen.getByTestId("game-end-modal");
      expect(modal).toHaveClass("bg-black/50");
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
});
