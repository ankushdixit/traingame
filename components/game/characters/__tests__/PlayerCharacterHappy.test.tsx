import { render, screen } from "@testing-library/react";
import { PlayerCharacterHappy } from "../PlayerCharacterHappy";

describe("PlayerCharacterHappy", () => {
  it("renders an SVG element", () => {
    render(<PlayerCharacterHappy />);

    const svg = screen.getByTestId("player-character-happy");
    expect(svg.tagName.toLowerCase()).toBe("svg");
  });

  it("has accessible label", () => {
    render(<PlayerCharacterHappy />);

    const svg = screen.getByTestId("player-character-happy");
    expect(svg).toHaveAttribute("aria-label", "You - celebrating victory!");
  });

  it("has correct viewBox", () => {
    render(<PlayerCharacterHappy />);

    const svg = screen.getByTestId("player-character-happy");
    expect(svg).toHaveAttribute("viewBox", "0 0 80 100");
  });

  it("has responsive sizing classes", () => {
    render(<PlayerCharacterHappy />);

    const svg = screen.getByTestId("player-character-happy");
    expect(svg).toHaveClass("h-full", "w-full");
  });
});
