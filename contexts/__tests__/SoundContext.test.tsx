/**
 * Tests for SoundContext
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SoundProvider, useSound } from "../SoundContext";
import * as soundManagerModule from "@/lib/soundManager";

// Mock the soundManager module
jest.mock("@/lib/soundManager", () => {
  const mockSoundManager = {
    play: jest.fn(),
    setMuted: jest.fn(),
    isMuted: jest.fn().mockReturnValue(false),
  };

  return {
    getSoundManager: jest.fn().mockReturnValue(mockSoundManager),
    SoundManager: jest.fn(),
  };
});

// Test component that uses the sound hook
function TestConsumer() {
  const { isMuted, toggleMute, playSound } = useSound();

  return (
    <div>
      <span data-testid="muted-status">{isMuted ? "muted" : "unmuted"}</span>
      <button data-testid="toggle-button" onClick={toggleMute}>
        Toggle
      </button>
      <button data-testid="play-button" onClick={() => playSound("seatClick")}>
        Play
      </button>
    </div>
  );
}

describe("SoundProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("provides sound context to children", () => {
    render(
      <SoundProvider>
        <TestConsumer />
      </SoundProvider>
    );

    expect(screen.getByTestId("muted-status")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-button")).toBeInTheDocument();
    expect(screen.getByTestId("play-button")).toBeInTheDocument();
  });

  it("starts with sound unmuted", () => {
    render(
      <SoundProvider>
        <TestConsumer />
      </SoundProvider>
    );

    expect(screen.getByTestId("muted-status")).toHaveTextContent("unmuted");
  });

  it("toggles mute state when toggleMute is called", async () => {
    const user = userEvent.setup();

    render(
      <SoundProvider>
        <TestConsumer />
      </SoundProvider>
    );

    expect(screen.getByTestId("muted-status")).toHaveTextContent("unmuted");

    await user.click(screen.getByTestId("toggle-button"));

    expect(screen.getByTestId("muted-status")).toHaveTextContent("muted");
  });

  it("updates SoundManager when mute state changes", async () => {
    const user = userEvent.setup();
    const mockManager = soundManagerModule.getSoundManager();

    render(
      <SoundProvider>
        <TestConsumer />
      </SoundProvider>
    );

    await user.click(screen.getByTestId("toggle-button"));

    expect(mockManager.setMuted).toHaveBeenCalledWith(true);
  });

  it("calls SoundManager.play when playSound is called", async () => {
    const user = userEvent.setup();
    const mockManager = soundManagerModule.getSoundManager();

    render(
      <SoundProvider>
        <TestConsumer />
      </SoundProvider>
    );

    await user.click(screen.getByTestId("play-button"));

    expect(mockManager.play).toHaveBeenCalledWith("seatClick");
  });

  it("can toggle mute on and off", async () => {
    const user = userEvent.setup();

    render(
      <SoundProvider>
        <TestConsumer />
      </SoundProvider>
    );

    expect(screen.getByTestId("muted-status")).toHaveTextContent("unmuted");

    await user.click(screen.getByTestId("toggle-button"));
    expect(screen.getByTestId("muted-status")).toHaveTextContent("muted");

    await user.click(screen.getByTestId("toggle-button"));
    expect(screen.getByTestId("muted-status")).toHaveTextContent("unmuted");
  });
});

describe("useSound", () => {
  it("throws error when used outside SoundProvider", () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestConsumer />);
    }).toThrow("useSound must be used within a SoundProvider");

    consoleSpy.mockRestore();
  });
});
