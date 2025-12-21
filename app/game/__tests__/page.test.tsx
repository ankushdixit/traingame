import { render, screen, fireEvent, act } from "@testing-library/react";
import GamePage from "../page";
import { GameState } from "@/lib/types";

// Mock SoundContext since game page uses useSound
jest.mock("@/contexts/SoundContext", () => ({
  useSound: () => ({
    isMuted: false,
    toggleMute: jest.fn(),
    playSound: jest.fn(),
  }),
}));

// Mock useSearchParams and useRouter
const mockSearchParams = new Map<string, string>();
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => mockSearchParams.get(key) ?? null,
  }),
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock useTransitionController hook
const mockStartTransition = jest.fn();
const mockQueueInteraction = jest.fn((fn: () => void) => fn());
const mockTriggerPlayerClaimSuccess = jest.fn();
jest.mock("@/lib/useTransitionController", () => ({
  useTransitionController: () => ({
    state: {
      phase: "idle",
      departingNpcIds: [],
      claimingNpcId: null,
      claimedSeatId: null,
      playerClaimSuccess: false,
    },
    startTransition: mockStartTransition,
    queueInteraction: mockQueueInteraction,
    isAnimating: false,
    triggerPlayerClaimSuccess: mockTriggerPlayerClaimSuccess,
  }),
}));

// Mock generateInitialState and game logic functions
jest.mock("@/lib/gameLogic", () => ({
  generateInitialState: jest.fn((boarding: number, destination: number) => ({
    currentStation: boarding,
    playerBoardingStation: boarding,
    playerDestination: destination,
    playerSeated: false,
    seatId: null,
    seats: [
      {
        id: 0,
        occupant: { id: "npc-0", destination: 3, destinationRevealed: false, characterSprite: 0 },
      },
      { id: 1, occupant: null },
      {
        id: 2,
        occupant: { id: "npc-1", destination: 4, destinationRevealed: false, characterSprite: 1 },
      },
      { id: 3, occupant: null },
      {
        id: 4,
        occupant: { id: "npc-2", destination: 5, destinationRevealed: false, characterSprite: 2 },
      },
      { id: 5, occupant: null },
    ],
    gameStatus: "playing" as const,
    standingNPCs: [],
    hoveredSeatId: null,
    difficulty: "easy" as const,
    lastClaimMessage: null,
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
    hoveredSeatId: null,
  })),
  advanceStation: jest.fn((state: GameState) => {
    const newStation = state.currentStation + 1;
    const updatedSeats = state.seats.map((seat) => {
      if (seat.occupant && seat.occupant.destination <= newStation) {
        return { ...seat, occupant: null };
      }
      return seat;
    });
    let newStatus: "playing" | "won" | "lost" = "playing";
    if (newStation >= state.playerDestination) {
      newStatus = state.playerSeated ? "won" : "lost";
    }
    return {
      ...state,
      currentStation: newStation,
      seats: updatedSeats,
      gameStatus: newStatus,
      hoveredSeatId: null,
      lastClaimMessage: null,
    };
  }),
  setHoveredSeat: jest.fn((state: GameState, seatId: number | null) => ({
    ...state,
    hoveredSeatId: seatId,
  })),
  previewStationAdvance: jest.fn((state: GameState) => {
    const newStation = state.currentStation + 1;
    const departingNpcIds: string[] = [];
    state.seats.forEach((seat) => {
      if (seat.occupant && seat.occupant.destination <= newStation) {
        departingNpcIds.push(seat.occupant.id);
      }
    });
    return {
      departingNpcIds,
      claimingNpcId: null,
      claimedSeatId: null,
    };
  }),
}));

describe("GamePage", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockSearchParams.clear();
    mockPush.mockClear();
    mockStartTransition.mockClear();
    mockQueueInteraction.mockClear();
    mockTriggerPlayerClaimSuccess.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
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

      expect(screen.getByTestId("seat-1")).toHaveClass("bg-yellow-600");
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

  describe("next station flow", () => {
    beforeEach(() => {
      mockSearchParams.set("boarding", "0");
      mockSearchParams.set("destination", "5");
    });

    it("shows Next Station button during gameplay", () => {
      render(<GamePage />);

      expect(screen.getByTestId("next-station-button")).toBeInTheDocument();
      expect(screen.getByTestId("next-station-button")).toHaveTextContent("Next: Marine Lines");
    });

    it("updates station display when clicking Next Station", () => {
      render(<GamePage />);

      // Initially at Churchgate
      expect(screen.getByTestId("current-station")).toHaveTextContent("Churchgate");

      // Click next station
      fireEvent.click(screen.getByTestId("next-station-button"));

      // Fast-forward timers for animation completion
      act(() => {
        jest.advanceTimersByTime(1300);
      });

      // Now at Marine Lines
      expect(screen.getByTestId("current-station")).toHaveTextContent("Marine Lines");
    });

    it("updates remaining stations count after advancing", () => {
      render(<GamePage />);

      // Initially 5 stations remaining
      expect(screen.getByTestId("remaining-stations")).toHaveTextContent("5 stations remaining");

      // Click next station
      fireEvent.click(screen.getByTestId("next-station-button"));

      // Fast-forward timers
      act(() => {
        jest.advanceTimersByTime(1300);
      });

      // Now 4 stations remaining
      expect(screen.getByTestId("remaining-stations")).toHaveTextContent("4 stations remaining");
    });

    it("removes NPC when reaching their destination", () => {
      render(<GamePage />);

      // NPC at seat 0 has destination 3 (Grant Road)
      expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "occupied");

      // Advance to station 1, 2, 3
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });

      // NPC should have exited, seat is now empty
      expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "empty");
    });

    it("seat becomes claimable after NPC exits", () => {
      render(<GamePage />);

      // Advance to station 3 where NPC 0 exits
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });

      // Click the now-empty seat
      fireEvent.click(screen.getByTestId("seat-0"));

      // Should show claim seat button
      expect(screen.getByTestId("claim-seat-button")).toBeInTheDocument();
    });

    it("shows 'Arrive at' for final station", () => {
      mockSearchParams.set("boarding", "4");
      mockSearchParams.set("destination", "5");
      render(<GamePage />);

      expect(screen.getByTestId("next-station-button")).toHaveTextContent("Arrive at Dadar");
    });

    it("shows win modal when seated at destination", () => {
      mockSearchParams.set("boarding", "4");
      mockSearchParams.set("destination", "5");
      render(<GamePage />);

      // Claim a seat first
      fireEvent.click(screen.getByTestId("seat-1"));
      fireEvent.click(screen.getByTestId("claim-seat-button"));

      // Advance to destination
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });

      // Should show win modal
      expect(screen.getByTestId("game-end-modal")).toBeInTheDocument();
      expect(screen.getByTestId("game-end-title")).toHaveTextContent("You Won!");
      expect(screen.getByTestId("game-end-message")).toHaveTextContent(
        "You found a seat before reaching Dadar!"
      );
    });

    it("shows lose modal when standing at destination", () => {
      mockSearchParams.set("boarding", "4");
      mockSearchParams.set("destination", "5");
      render(<GamePage />);

      // Don't claim a seat, just advance
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });

      // Should show lose modal
      expect(screen.getByTestId("game-end-modal")).toBeInTheDocument();
      expect(screen.getByTestId("game-end-title")).toHaveTextContent("You Lost!");
      expect(screen.getByTestId("game-end-message")).toHaveTextContent(
        "You arrived at Dadar still standing!"
      );
    });

    it("hides Next Station button when game is over", () => {
      mockSearchParams.set("boarding", "4");
      mockSearchParams.set("destination", "5");
      render(<GamePage />);

      // Advance to destination
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });

      // Button should be hidden
      expect(screen.queryByTestId("next-station-button")).not.toBeInTheDocument();
    });

    it("win modal has green title styling", () => {
      mockSearchParams.set("boarding", "4");
      mockSearchParams.set("destination", "5");
      render(<GamePage />);

      // Claim seat and advance
      fireEvent.click(screen.getByTestId("seat-1"));
      fireEvent.click(screen.getByTestId("claim-seat-button"));
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });

      expect(screen.getByTestId("game-end-title")).toHaveClass("text-green-600");
    });

    it("lose modal has red title styling", () => {
      mockSearchParams.set("boarding", "4");
      mockSearchParams.set("destination", "5");
      render(<GamePage />);

      // Advance without claiming seat
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });

      expect(screen.getByTestId("game-end-title")).toHaveClass("text-red-600");
    });

    it("Play Again button navigates to home page", () => {
      mockSearchParams.set("boarding", "4");
      mockSearchParams.set("destination", "5");
      render(<GamePage />);

      // Claim seat and advance to win
      fireEvent.click(screen.getByTestId("seat-1"));
      fireEvent.click(screen.getByTestId("claim-seat-button"));
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });

      // Click Play Again
      fireEvent.click(screen.getByTestId("play-again-button"));

      expect(mockPush).toHaveBeenCalledWith("/");
    });

    it("Try Again button navigates to home page", () => {
      mockSearchParams.set("boarding", "4");
      mockSearchParams.set("destination", "5");
      render(<GamePage />);

      // Advance without seat to lose
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });

      // Click Try Again
      fireEvent.click(screen.getByTestId("play-again-button"));

      expect(mockPush).toHaveBeenCalledWith("/");
    });

    it("game area is still visible behind modal overlay", () => {
      mockSearchParams.set("boarding", "4");
      mockSearchParams.set("destination", "5");
      render(<GamePage />);

      // Advance to end game
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });

      // Modal and game area should both be present
      expect(screen.getByTestId("game-end-modal")).toBeInTheDocument();
      expect(screen.getByTestId("compartment")).toBeInTheDocument();
      expect(screen.getByTestId("game-header")).toBeInTheDocument();
    });

    it("multiple NPCs can exit at same station", () => {
      // Note: Our mock has NPC at seat 0 with dest 3 and NPC at seat 2 with dest 4
      render(<GamePage />);

      // Advance to station 4 where NPC at seat 2 exits
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(1300);
      });

      // Both NPCs with dest 3 and 4 should have exited
      expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "empty");
      expect(screen.getByTestId("seat-2")).toHaveAttribute("data-state", "empty");
    });
  });
});
