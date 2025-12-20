import { render, screen, fireEvent } from "@testing-library/react";
import GamePage from "../page";
import { GameState } from "@/lib/types";

// Mock useSearchParams
const mockSearchParams = new Map<string, string>();
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => mockSearchParams.get(key) ?? null,
  }),
}));

// Mock generateInitialState and claimSeat to return predictable state
jest.mock("@/lib/gameLogic", () => ({
  generateInitialState: jest.fn((boarding: number, destination: number) => ({
    currentStation: boarding,
    playerBoardingStation: boarding,
    playerDestination: destination,
    playerSeated: false,
    seatId: null,
    seats: [
      { id: 0, occupant: { id: "npc-0", destination: 3, destinationRevealed: false } },
      { id: 1, occupant: null },
      { id: 2, occupant: { id: "npc-1", destination: 4, destinationRevealed: false } },
      { id: 3, occupant: null },
      { id: 4, occupant: { id: "npc-2", destination: 5, destinationRevealed: false } },
      { id: 5, occupant: null },
    ],
    gameStatus: "playing" as const,
  })),
  revealDestination: jest.fn((state: GameState, seatId: number) => ({
    ...state,
    seats: state.seats.map((seat) =>
      seat.id === seatId && seat.occupant
        ? { ...seat, occupant: { ...seat.occupant, destinationRevealed: true } }
        : seat
    ),
  })),
  claimSeat: jest.fn((state: GameState, seatId: number) => ({
    ...state,
    playerSeated: true,
    seatId: seatId,
  })),
}));

describe("GamePage", () => {
  beforeEach(() => {
    mockSearchParams.clear();
  });

  describe("with valid parameters", () => {
    beforeEach(() => {
      mockSearchParams.set("boarding", "0");
      mockSearchParams.set("destination", "5");
    });

    it("renders game header with station info", () => {
      render(<GamePage />);

      expect(screen.getByTestId("game-header")).toBeInTheDocument();
      expect(screen.getByTestId("current-station")).toHaveTextContent("Churchgate");
    });

    it("renders compartment with 6 seats", () => {
      render(<GamePage />);

      expect(screen.getByTestId("compartment")).toBeInTheDocument();
      for (let i = 0; i < 6; i++) {
        expect(screen.getByTestId(`seat-${i}`)).toBeInTheDocument();
      }
    });

    it("renders player status", () => {
      render(<GamePage />);

      expect(screen.getByTestId("player-status")).toBeInTheDocument();
      expect(screen.getByTestId("standing-status")).toBeInTheDocument();
    });

    it("displays correct destination", () => {
      render(<GamePage />);

      expect(screen.getByTestId("destination")).toHaveTextContent("Your destination: Dadar");
    });

    it("displays remaining stations count", () => {
      render(<GamePage />);

      expect(screen.getByTestId("remaining-stations")).toHaveTextContent("5 stations remaining");
    });

    it("shows occupied and empty seats correctly", () => {
      render(<GamePage />);

      // Occupied seats (from mock)
      expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "occupied");
      expect(screen.getByTestId("seat-2")).toHaveAttribute("data-state", "occupied");
      expect(screen.getByTestId("seat-4")).toHaveAttribute("data-state", "occupied");

      // Empty seats (from mock)
      expect(screen.getByTestId("seat-1")).toHaveAttribute("data-state", "empty");
      expect(screen.getByTestId("seat-3")).toHaveAttribute("data-state", "empty");
      expect(screen.getByTestId("seat-5")).toHaveAttribute("data-state", "empty");
    });
  });

  describe("with different boarding station", () => {
    beforeEach(() => {
      mockSearchParams.set("boarding", "2");
      mockSearchParams.set("destination", "5");
    });

    it("renders correct station from parameters", () => {
      render(<GamePage />);

      expect(screen.getByTestId("current-station")).toHaveTextContent("Charni Road");
    });
  });

  describe("with missing parameters", () => {
    it("shows error when boarding is missing", () => {
      mockSearchParams.set("destination", "5");
      render(<GamePage />);

      expect(screen.getByText(/Invalid game parameters/)).toBeInTheDocument();
    });

    it("shows error when destination is missing", () => {
      mockSearchParams.set("boarding", "0");
      render(<GamePage />);

      expect(screen.getByText(/Invalid game parameters/)).toBeInTheDocument();
    });

    it("shows error when both parameters are missing", () => {
      render(<GamePage />);

      expect(screen.getByText(/Invalid game parameters/)).toBeInTheDocument();
    });
  });

  describe("with invalid parameters", () => {
    it("shows error when boarding is not a number", () => {
      mockSearchParams.set("boarding", "abc");
      mockSearchParams.set("destination", "5");
      render(<GamePage />);

      expect(screen.getByText(/Invalid game parameters/)).toBeInTheDocument();
    });

    it("shows error when destination is not a number", () => {
      mockSearchParams.set("boarding", "0");
      mockSearchParams.set("destination", "xyz");
      render(<GamePage />);

      expect(screen.getByText(/Invalid game parameters/)).toBeInTheDocument();
    });
  });

  describe("claim seat flow", () => {
    beforeEach(() => {
      mockSearchParams.set("boarding", "0");
      mockSearchParams.set("destination", "5");
    });

    it("shows Claim Seat button when clicking empty seat", () => {
      render(<GamePage />);

      fireEvent.click(screen.getByTestId("seat-1")); // Empty seat

      expect(screen.getByTestId("claim-seat-button")).toBeInTheDocument();
      expect(screen.getByTestId("claim-seat-button")).toHaveTextContent("Claim Seat");
    });

    it("updates player status to seated after claiming seat", () => {
      render(<GamePage />);

      // Initially standing
      expect(screen.getByTestId("standing-status")).toBeInTheDocument();

      // Click empty seat and claim it
      fireEvent.click(screen.getByTestId("seat-1"));
      fireEvent.click(screen.getByTestId("claim-seat-button"));

      // Now seated
      expect(screen.getByTestId("seated-status")).toBeInTheDocument();
      expect(screen.getByTestId("seated-status")).toHaveTextContent("You are seated!");
    });

    it("shows player seat with 'You' text after claiming", () => {
      render(<GamePage />);

      fireEvent.click(screen.getByTestId("seat-1"));
      fireEvent.click(screen.getByTestId("claim-seat-button"));

      expect(screen.getByTestId("seat-1")).toHaveAttribute("data-state", "player");
      expect(screen.getByText("You")).toBeInTheDocument();
    });

    it("player seat has distinct styling after claiming", () => {
      render(<GamePage />);

      fireEvent.click(screen.getByTestId("seat-1"));
      fireEvent.click(screen.getByTestId("claim-seat-button"));

      expect(screen.getByTestId("seat-1")).toHaveClass("bg-yellow-200");
      expect(screen.getByTestId("seat-1")).toHaveClass("ring-2");
      expect(screen.getByTestId("seat-1")).toHaveClass("ring-yellow-400");
    });

    it("seated player cannot interact with other seats", () => {
      render(<GamePage />);

      // Claim a seat first
      fireEvent.click(screen.getByTestId("seat-1"));
      fireEvent.click(screen.getByTestId("claim-seat-button"));

      // Try to click another empty seat
      fireEvent.click(screen.getByTestId("seat-3"));

      // Popover should not appear
      expect(screen.queryByTestId("seat-popover")).not.toBeInTheDocument();
    });

    it("seated player cannot interact with occupied seats", () => {
      render(<GamePage />);

      // Claim a seat first
      fireEvent.click(screen.getByTestId("seat-1"));
      fireEvent.click(screen.getByTestId("claim-seat-button"));

      // Try to click an occupied seat
      fireEvent.click(screen.getByTestId("seat-0"));

      // Popover should not appear
      expect(screen.queryByTestId("seat-popover")).not.toBeInTheDocument();
    });

    it("other occupied seats remain unchanged after claiming", () => {
      render(<GamePage />);

      fireEvent.click(screen.getByTestId("seat-1"));
      fireEvent.click(screen.getByTestId("claim-seat-button"));

      // Occupied seats should still show as occupied
      expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "occupied");
      expect(screen.getByTestId("seat-2")).toHaveAttribute("data-state", "occupied");
      expect(screen.getByTestId("seat-4")).toHaveAttribute("data-state", "occupied");
    });

    it("other empty seats remain empty after claiming", () => {
      render(<GamePage />);

      fireEvent.click(screen.getByTestId("seat-1"));
      fireEvent.click(screen.getByTestId("claim-seat-button"));

      // Other empty seats should still show as empty
      expect(screen.getByTestId("seat-3")).toHaveAttribute("data-state", "empty");
      expect(screen.getByTestId("seat-5")).toHaveAttribute("data-state", "empty");
    });

    it("closes popover after claiming seat", () => {
      render(<GamePage />);

      fireEvent.click(screen.getByTestId("seat-1"));
      expect(screen.getByTestId("seat-popover")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("claim-seat-button"));
      expect(screen.queryByTestId("seat-popover")).not.toBeInTheDocument();
    });

    it("seats do not have click cursor when player is seated", () => {
      render(<GamePage />);

      fireEvent.click(screen.getByTestId("seat-1"));
      fireEvent.click(screen.getByTestId("claim-seat-button"));

      // Other seats should not have cursor-pointer class
      expect(screen.getByTestId("seat-0")).not.toHaveClass("cursor-pointer");
      expect(screen.getByTestId("seat-3")).not.toHaveClass("cursor-pointer");
    });
  });
});
