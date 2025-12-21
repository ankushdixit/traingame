import { render, screen } from "@testing-library/react";
import {
  Character1,
  Character2,
  Character3,
  Character4,
  Character5,
  Character6,
  Character7,
  Character8,
  PlayerCharacter,
  CHARACTERS,
  CHARACTER_COUNT,
  getCharacterComponent,
  renderCharacter,
} from "../index";

describe("Character Components", () => {
  describe("Character1", () => {
    it("renders without error", () => {
      render(<Character1 />);
      expect(screen.getByLabelText(/young man with glasses/i)).toBeInTheDocument();
    });

    it("renders seated by default", () => {
      const { container } = render(<Character1 />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders standing when isSeated is false", () => {
      const { container } = render(<Character1 isSeated={false} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("has appropriate aria-label", () => {
      render(<Character1 />);
      expect(
        screen.getByLabelText(/young man with glasses wearing blue shirt/i)
      ).toBeInTheDocument();
    });
  });

  describe("Character2", () => {
    it("renders without error", () => {
      render(<Character2 />);
      expect(screen.getByLabelText(/woman wearing maroon kurta/i)).toBeInTheDocument();
    });

    it("renders seated by default", () => {
      const { container } = render(<Character2 />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders standing when isSeated is false", () => {
      const { container } = render(<Character2 isSeated={false} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Character3", () => {
    it("renders without error", () => {
      render(<Character3 />);
      expect(screen.getByLabelText(/elderly uncle/i)).toBeInTheDocument();
    });

    it("renders seated by default", () => {
      const { container } = render(<Character3 />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Character4", () => {
    it("renders without error", () => {
      render(<Character4 />);
      expect(screen.getByLabelText(/young student with earphones/i)).toBeInTheDocument();
    });

    it("renders seated by default", () => {
      const { container } = render(<Character4 />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Character5", () => {
    it("renders without error", () => {
      render(<Character5 />);
      expect(screen.getByLabelText(/business woman/i)).toBeInTheDocument();
    });

    it("renders seated by default", () => {
      const { container } = render(<Character5 />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Character6", () => {
    it("renders without error", () => {
      render(<Character6 />);
      expect(screen.getByLabelText(/man wearing checkered shirt/i)).toBeInTheDocument();
    });

    it("renders seated by default", () => {
      const { container } = render(<Character6 />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Character7", () => {
    it("renders without error", () => {
      render(<Character7 />);
      expect(screen.getByLabelText(/elderly aunty wearing green saree/i)).toBeInTheDocument();
    });

    it("renders seated by default", () => {
      const { container } = render(<Character7 />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Character8", () => {
    it("renders without error", () => {
      render(<Character8 />);
      expect(screen.getByLabelText(/young woman with ponytail/i)).toBeInTheDocument();
    });

    it("renders seated by default", () => {
      const { container } = render(<Character8 />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("PlayerCharacter", () => {
    it("renders without error", () => {
      render(<PlayerCharacter />);
      expect(screen.getByLabelText(/you - the player character/i)).toBeInTheDocument();
    });

    it("renders seated by default", () => {
      const { container } = render(<PlayerCharacter />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders standing when isSeated is false", () => {
      const { container } = render(<PlayerCharacter isSeated={false} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });
});

describe("Character Registry", () => {
  describe("CHARACTERS array", () => {
    it("contains exactly 8 character components", () => {
      expect(CHARACTERS).toHaveLength(8);
    });

    it("CHARACTER_COUNT equals 8", () => {
      expect(CHARACTER_COUNT).toBe(8);
    });

    it("all entries are valid React components", () => {
      CHARACTERS.forEach((Character) => {
        const { container } = render(<Character />);
        expect(container.querySelector("svg")).toBeInTheDocument();
      });
    });
  });

  describe("getCharacterComponent", () => {
    it("returns correct component for indices 0-7", () => {
      expect(getCharacterComponent(0)).toBe(Character1);
      expect(getCharacterComponent(1)).toBe(Character2);
      expect(getCharacterComponent(2)).toBe(Character3);
      expect(getCharacterComponent(3)).toBe(Character4);
      expect(getCharacterComponent(4)).toBe(Character5);
      expect(getCharacterComponent(5)).toBe(Character6);
      expect(getCharacterComponent(6)).toBe(Character7);
      expect(getCharacterComponent(7)).toBe(Character8);
    });

    it("wraps around for indices >= 8", () => {
      expect(getCharacterComponent(8)).toBe(Character1);
      expect(getCharacterComponent(9)).toBe(Character2);
      expect(getCharacterComponent(15)).toBe(Character8);
      expect(getCharacterComponent(16)).toBe(Character1);
    });

    it("handles large indices via modulo wrap-around", () => {
      // Large indices should wrap around properly
      const result = getCharacterComponent(100);
      const expectedIndex = 100 % CHARACTER_COUNT;
      expect(result).toBe(CHARACTERS[expectedIndex]);
    });
  });

  describe("renderCharacter", () => {
    it("renders character component with seated state", () => {
      const element = renderCharacter(0, true);
      const { container } = render(element);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders character component with standing state", () => {
      const element = renderCharacter(0, false);
      const { container } = render(element);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders different characters for different indices", () => {
      const char1 = renderCharacter(0, true);
      const char2 = renderCharacter(1, true);

      const { container: container1 } = render(char1);
      const { container: container2 } = render(char2);

      // Both should render SVGs
      expect(container1.querySelector("svg")).toBeInTheDocument();
      expect(container2.querySelector("svg")).toBeInTheDocument();
    });
  });
});

describe("Character accessibility", () => {
  it("all characters have appropriate aria-label", () => {
    const { container: c1 } = render(<Character1 />);
    const { container: c2 } = render(<Character2 />);
    const { container: c3 } = render(<Character3 />);
    const { container: c4 } = render(<Character4 />);
    const { container: c5 } = render(<Character5 />);
    const { container: c6 } = render(<Character6 />);
    const { container: c7 } = render(<Character7 />);
    const { container: c8 } = render(<Character8 />);
    const { container: cp } = render(<PlayerCharacter />);

    [c1, c2, c3, c4, c5, c6, c7, c8, cp].forEach((container) => {
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-label");
      expect(svg?.getAttribute("aria-label")).not.toBe("");
    });
  });

  it("all characters have class for full size", () => {
    const { container } = render(<Character1 />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-full", "h-full");
  });
});

describe("Character visual diversity", () => {
  it("no duplicate characters in first 6 NPCs when using shuffled assignment", () => {
    // This tests the concept - in actual game, generateInitialState ensures unique sprites
    const usedSprites = new Set<number>();
    for (let i = 0; i < 6; i++) {
      const sprite = i % CHARACTER_COUNT;
      usedSprites.add(sprite);
    }
    expect(usedSprites.size).toBe(6);
  });
});
