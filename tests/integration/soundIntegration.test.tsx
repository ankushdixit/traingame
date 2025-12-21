/**
 * Integration tests for sound functionality
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SoundProvider, useSound } from "@/contexts/SoundContext";
import { SoundToggle } from "@/components/game/SoundToggle";

// Create mock functions that will be used
const mockPlay = jest.fn();
const mockSetMuted = jest.fn();

// Mock the soundManager module
jest.mock("@/lib/soundManager", () => ({
  getSoundManager: jest.fn(() => ({
    play: (name: string) => mockPlay(name),
    setMuted: (muted: boolean) => mockSetMuted(muted),
    isMuted: () => false,
  })),
  SoundManager: jest.fn(),
}));

// Component that simulates game interactions
function GameSimulator() {
  const { playSound, isMuted } = useSound();

  return (
    <div>
      <SoundToggle />
      <span data-testid="muted-status">{isMuted ? "muted" : "unmuted"}</span>
      <button data-testid="advance-station" onClick={() => playSound("trainMoving")}>
        Advance Station
      </button>
      <button data-testid="claim-seat" onClick={() => playSound("seatClaim")}>
        Claim Seat
      </button>
      <button data-testid="ask-destination" onClick={() => playSound("seatClick")}>
        Ask Destination
      </button>
      <button data-testid="win-game" onClick={() => playSound("winJingle")}>
        Win Game
      </button>
      <button data-testid="lose-game" onClick={() => playSound("loseSound")}>
        Lose Game
      </button>
    </div>
  );
}

describe("Sound Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("SoundToggle integration with SoundProvider", () => {
    it("renders SoundToggle with provider context", () => {
      render(
        <SoundProvider>
          <SoundToggle />
        </SoundProvider>
      );

      expect(screen.getByTestId("sound-toggle")).toBeInTheDocument();
    });

    it("toggles mute state when SoundToggle is clicked", async () => {
      const user = userEvent.setup();

      render(
        <SoundProvider>
          <GameSimulator />
        </SoundProvider>
      );

      expect(screen.getByTestId("muted-status")).toHaveTextContent("unmuted");

      await user.click(screen.getByTestId("sound-toggle"));

      expect(screen.getByTestId("muted-status")).toHaveTextContent("muted");
      expect(mockSetMuted).toHaveBeenCalledWith(true);
    });
  });

  describe("Game sound triggers", () => {
    it("plays train moving sound when advancing station", async () => {
      const user = userEvent.setup();

      render(
        <SoundProvider>
          <GameSimulator />
        </SoundProvider>
      );

      await user.click(screen.getByTestId("advance-station"));

      expect(mockPlay).toHaveBeenCalledWith("trainMoving");
    });

    it("plays seat claim sound when claiming a seat", async () => {
      const user = userEvent.setup();

      render(
        <SoundProvider>
          <GameSimulator />
        </SoundProvider>
      );

      await user.click(screen.getByTestId("claim-seat"));

      expect(mockPlay).toHaveBeenCalledWith("seatClaim");
    });

    it("plays seat click sound when asking destination", async () => {
      const user = userEvent.setup();

      render(
        <SoundProvider>
          <GameSimulator />
        </SoundProvider>
      );

      await user.click(screen.getByTestId("ask-destination"));

      expect(mockPlay).toHaveBeenCalledWith("seatClick");
    });

    it("plays win jingle when winning the game", async () => {
      const user = userEvent.setup();

      render(
        <SoundProvider>
          <GameSimulator />
        </SoundProvider>
      );

      await user.click(screen.getByTestId("win-game"));

      expect(mockPlay).toHaveBeenCalledWith("winJingle");
    });

    it("plays lose sound when losing the game", async () => {
      const user = userEvent.setup();

      render(
        <SoundProvider>
          <GameSimulator />
        </SoundProvider>
      );

      await user.click(screen.getByTestId("lose-game"));

      expect(mockPlay).toHaveBeenCalledWith("loseSound");
    });
  });

  describe("Mute functionality integration", () => {
    it("sound actions still call playSound when muted (SoundManager handles mute)", async () => {
      const user = userEvent.setup();

      render(
        <SoundProvider>
          <GameSimulator />
        </SoundProvider>
      );

      // Mute the sound
      await user.click(screen.getByTestId("sound-toggle"));
      expect(screen.getByTestId("muted-status")).toHaveTextContent("muted");

      // Try to play sound
      await user.click(screen.getByTestId("claim-seat"));

      // playSound is called, but SoundManager.play handles mute state
      expect(mockPlay).toHaveBeenCalledWith("seatClaim");
    });

    it("mute state persists across multiple interactions", async () => {
      const user = userEvent.setup();

      render(
        <SoundProvider>
          <GameSimulator />
        </SoundProvider>
      );

      // Mute
      await user.click(screen.getByTestId("sound-toggle"));
      expect(screen.getByTestId("muted-status")).toHaveTextContent("muted");

      // Multiple sound actions
      await user.click(screen.getByTestId("advance-station"));
      await user.click(screen.getByTestId("claim-seat"));
      await user.click(screen.getByTestId("ask-destination"));

      // Still muted
      expect(screen.getByTestId("muted-status")).toHaveTextContent("muted");
    });

    it("unmuting allows sounds to play again", async () => {
      const user = userEvent.setup();

      render(
        <SoundProvider>
          <GameSimulator />
        </SoundProvider>
      );

      // Mute and then unmute
      await user.click(screen.getByTestId("sound-toggle"));
      await user.click(screen.getByTestId("sound-toggle"));

      expect(screen.getByTestId("muted-status")).toHaveTextContent("unmuted");
      expect(mockSetMuted).toHaveBeenLastCalledWith(false);
    });
  });

  describe("Multiple sound events", () => {
    it("can play multiple different sounds in sequence", async () => {
      const user = userEvent.setup();

      render(
        <SoundProvider>
          <GameSimulator />
        </SoundProvider>
      );

      await user.click(screen.getByTestId("advance-station"));
      await user.click(screen.getByTestId("claim-seat"));
      await user.click(screen.getByTestId("win-game"));

      expect(mockPlay).toHaveBeenCalledWith("trainMoving");
      expect(mockPlay).toHaveBeenCalledWith("seatClaim");
      expect(mockPlay).toHaveBeenCalledWith("winJingle");
      expect(mockPlay).toHaveBeenCalledTimes(3);
    });
  });
});
