import { render, screen } from "@testing-library/react";
import { PlayerCharacterSad } from "../PlayerCharacterSad";

describe("PlayerCharacterSad", () => {
  it("renders an SVG element", () => {
    render(<PlayerCharacterSad />);

    const svg = screen.getByTestId("player-character-sad");
    expect(svg.tagName.toLowerCase()).toBe("svg");
  });

  it("has accessible label", () => {
    render(<PlayerCharacterSad />);

    const svg = screen.getByTestId("player-character-sad");
    expect(svg).toHaveAttribute("aria-label", "You - tired from standing");
  });

  it("has correct viewBox", () => {
    render(<PlayerCharacterSad />);

    const svg = screen.getByTestId("player-character-sad");
    expect(svg).toHaveAttribute("viewBox", "0 0 60 100");
  });

  it("has responsive sizing classes", () => {
    render(<PlayerCharacterSad />);

    const svg = screen.getByTestId("player-character-sad");
    expect(svg).toHaveClass("h-full", "w-full");
  });
});
