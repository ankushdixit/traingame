/**
 * Tests for SoundToggle component
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SoundToggle } from "../SoundToggle";

// Mock the SoundContext
const mockToggleMute = jest.fn();
let mockIsMuted = false;

jest.mock("@/contexts/SoundContext", () => ({
  useSound: () => ({
    isMuted: mockIsMuted,
    toggleMute: mockToggleMute,
    playSound: jest.fn(),
  }),
}));

describe("SoundToggle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsMuted = false;
  });

  it("renders a button", () => {
    render(<SoundToggle />);

    const button = screen.getByTestId("sound-toggle");
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe("BUTTON");
  });

  it("has accessible label when unmuted", () => {
    mockIsMuted = false;
    render(<SoundToggle />);

    const button = screen.getByTestId("sound-toggle");
    expect(button).toHaveAttribute("aria-label", "Mute sounds");
  });

  it("has accessible label when muted", () => {
    mockIsMuted = true;
    render(<SoundToggle />);

    const button = screen.getByTestId("sound-toggle");
    expect(button).toHaveAttribute("aria-label", "Unmute sounds");
  });

  it("calls toggleMute when clicked", async () => {
    const user = userEvent.setup();
    render(<SoundToggle />);

    const button = screen.getByTestId("sound-toggle");
    await user.click(button);

    expect(mockToggleMute).toHaveBeenCalledTimes(1);
  });

  it("displays unmuted icon when sound is on", () => {
    mockIsMuted = false;
    render(<SoundToggle />);

    const button = screen.getByTestId("sound-toggle");
    const svg = button.querySelector("svg");
    expect(svg).toBeInTheDocument();
    // Unmuted icon should exist and have a path
    const paths = svg?.querySelectorAll("path");
    expect(paths?.length).toBeGreaterThanOrEqual(1);
  });

  it("displays muted icon when sound is off", () => {
    mockIsMuted = true;
    render(<SoundToggle />);

    const button = screen.getByTestId("sound-toggle");
    const svg = button.querySelector("svg");
    expect(svg).toBeInTheDocument();
    // Muted icon should exist and have a path
    const paths = svg?.querySelectorAll("path");
    expect(paths?.length).toBeGreaterThanOrEqual(1);
  });

  it("has proper styling classes", () => {
    render(<SoundToggle />);

    const button = screen.getByTestId("sound-toggle");
    expect(button).toHaveClass("rounded-full");
    expect(button).toHaveClass("p-2");
  });

  it("icon has hidden aria attribute for accessibility", () => {
    render(<SoundToggle />);

    const button = screen.getByTestId("sound-toggle");
    const svg = button.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
