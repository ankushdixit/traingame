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
  PHASE_DURATIONS: {
    traveling: 1800,
    arriving: 200,
    departing: 400,
    claiming: 200,
    settling: 100,
  },
  TOTAL_ANIMATION_DURATION: 2700,
}));

// Mock generateInitialState and game logic functions
jest.mock("@/lib/gameLogic", () => ({
  generateInitialState: jest.fn((boarding: number, destination: number) => ({
    currentStation: boarding,
    playerBoardingStation: boarding,
    playerDestination: destination,
    playerSeated: false,
    seatId: null,
    playerStandingSpot: 0,
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
    playerWatchedSeatId: null,
    actionsRemaining: 2,
    difficulty: "easy" as const,
    line: "short" as const,
    lastClaimMessage: null,
    lastBoardingMessage: null,
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
    gameStatus: "won" as const,
    playerWatchedSeatId: null,
  })),
  advanceStation: jest.fn((state: GameState) => {
    const newStation = state.currentStation + 1;
    const openedSeats: number[] = [];
    const departingNpcIds: string[] = [];

    const updatedSeats = state.seats.map((seat) => {
      if (seat.occupant && seat.occupant.destination <= newStation) {
        openedSeats.push(seat.id);
        departingNpcIds.push(seat.occupant.id);
        return { ...seat, occupant: null };
      }
      return seat;
    });

    let newStatus: "playing" | "won" | "lost" = "playing";
    if (newStation >= state.playerDestination && !state.playerSeated) {
      newStatus = "lost";
    }

    return {
      state: {
        ...state,
        currentStation: newStation,
        seats: updatedSeats,
        gameStatus: newStatus,
        playerWatchedSeatId: null,
        lastClaimMessage: null,
        actionsRemaining: 2,
      },
      openedSeats,
      departingNpcIds,
    };
  }),
  setHoveredSeat: jest.fn((state: GameState, seatId: number | null) => ({
    ...state,
    playerWatchedSeatId: seatId,
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
  fillEmptySeats: jest.fn((state: GameState) => state),
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
      expect(screen.getByTestId("player-status")).toHaveTextContent(/Standing/);
    });

    it("displays destination in journey progress", () => {
      render(<GamePage />);

      // Destination station (Dadar) is shown in the journey progress
      expect(screen.getByText("Dadar")).toBeInTheDocument();
      // The destination station dot should have the flag emoji
      const destinationDot = screen.getByTestId("station-dot-5");
      expect(destinationDot).toBeInTheDocument();
    });

    it("displays remaining stops in status bar", () => {
      render(<GamePage />);

      expect(screen.getByText(/5 stops left/i)).toBeInTheDocument();
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

  // NOTE: "claim seat flow" tests removed - gameplay changed to grab competition system
  // In the new design, all seats start full and player grabs seats during grab phase
  describe.skip("claim seat flow (DEPRECATED - grab competition replaced this)", () => {
    // These tests are skipped because the claim seat button no longer exists
    // Seats are now grabbed during grab competition phase after NPCs depart
  });

  describe("next station flow", () => {
    beforeEach(() => {
      mockSearchParams.set("boarding", "0");
      mockSearchParams.set("destination", "5");
    });

    it("shows Next Station button during gameplay", () => {
      render(<GamePage />);

      expect(screen.getByTestId("next-station-button")).toBeInTheDocument();
      expect(screen.getByTestId("next-station-button")).toHaveTextContent(
        "🚃 Next Station: Marine Lines"
      );
    });

    it("updates station display when clicking Next Station", () => {
      render(<GamePage />);

      // Initially at Churchgate
      expect(screen.getByTestId("current-station")).toHaveTextContent("Churchgate");

      // Click next station
      fireEvent.click(screen.getByTestId("next-station-button"));

      // Fast-forward timers for animation completion
      act(() => {
        jest.advanceTimersByTime(2700);
      });

      // Now at Marine Lines
      expect(screen.getByTestId("current-station")).toHaveTextContent("Marine Lines");
    });

    it("updates remaining stations count after advancing", () => {
      render(<GamePage />);

      // Check status bar shows 5 stops remaining
      expect(screen.getByText(/5 stops left/i)).toBeInTheDocument();

      // Click next station
      fireEvent.click(screen.getByTestId("next-station-button"));

      // Fast-forward timers
      act(() => {
        jest.advanceTimersByTime(2700);
      });

      // Now 4 stops remaining
      expect(screen.getByText(/4 stops left/i)).toBeInTheDocument();
    });

    it("removes NPC when reaching their destination", () => {
      render(<GamePage />);

      // NPC at seat 0 has destination 3 (Grant Road)
      expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "occupied");

      // Advance to station 1, 2, 3
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(2700);
      });
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(2700);
      });
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(2700);
      });

      // NPC should have exited, seat is now empty
      expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "empty");
    });

    it.skip("seat becomes claimable after NPC exits (DEPRECATED - grab competition)", () => {
      // This test is skipped because claiming seats via button no longer exists
      // Seats are now grabbed during grab competition phase
    });

    it("shows 'Next Station' for final station", () => {
      mockSearchParams.set("boarding", "4");
      mockSearchParams.set("destination", "5");
      render(<GamePage />);

      expect(screen.getByTestId("next-station-button")).toHaveTextContent("🚃 Next Station: Dadar");
    });

    it.skip("shows win modal when seated at destination (DEPRECATED - grab competition)", () => {
      // This test is skipped because claiming seats via button no longer exists
    });

    it("shows lose modal when standing at destination", () => {
      mockSearchParams.set("boarding", "4");
      mockSearchParams.set("destination", "5");
      render(<GamePage />);

      // Don't claim a seat, just advance
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(2700);
      });

      // Should show lose modal
      expect(screen.getByTestId("game-end-modal")).toBeInTheDocument();
      expect(screen.getByTestId("game-end-title")).toHaveTextContent("No Seat Found");
      expect(screen.getByTestId("game-end-message")).toHaveTextContent(
        "You arrived at Dadar standing the whole way!"
      );
    });

    it("hides Next Station button when game is over", () => {
      mockSearchParams.set("boarding", "4");
      mockSearchParams.set("destination", "5");
      render(<GamePage />);

      // Advance to destination
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(2700);
      });

      // Button should be hidden
      expect(screen.queryByTestId("next-station-button")).not.toBeInTheDocument();
    });

    it.skip("win modal has green title styling (DEPRECATED - grab competition)", () => {
      // This test is skipped because claiming seats via button no longer exists
    });

    it("lose modal has rose title styling", () => {
      mockSearchParams.set("boarding", "4");
      mockSearchParams.set("destination", "5");
      render(<GamePage />);

      // Advance without claiming seat
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(2700);
      });

      expect(screen.getByTestId("game-end-title")).toHaveClass("text-rose-600");
    });

    it.skip("Play Again button navigates to home page (DEPRECATED - grab competition)", () => {
      // This test is skipped because claiming seats via button no longer exists
    });

    it("Try Again button navigates to home page", () => {
      mockSearchParams.set("boarding", "4");
      mockSearchParams.set("destination", "5");
      render(<GamePage />);

      // Advance without seat to lose
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(2700);
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
        jest.advanceTimersByTime(2700);
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
        jest.advanceTimersByTime(2700);
      });
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(2700);
      });
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(2700);
      });
      fireEvent.click(screen.getByTestId("next-station-button"));
      act(() => {
        jest.advanceTimersByTime(2700);
      });

      // Both NPCs with dest 3 and 4 should have exited
      expect(screen.getByTestId("seat-0")).toHaveAttribute("data-state", "empty");
      expect(screen.getByTestId("seat-2")).toHaveAttribute("data-state", "empty");
    });
  });
});
