import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DifficultySelector } from "../DifficultySelector";
import { Difficulty, DIFFICULTY_OPTIONS } from "@/lib/types";

describe("DifficultySelector", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe("rendering", () => {
    it("renders all three difficulty options", () => {
      render(<DifficultySelector value="normal" onChange={mockOnChange} />);

      expect(screen.getByTestId("difficulty-easy")).toBeInTheDocument();
      expect(screen.getByTestId("difficulty-normal")).toBeInTheDocument();
      expect(screen.getByTestId("difficulty-rush")).toBeInTheDocument();
    });

    it("displays correct labels for each difficulty", () => {
      render(<DifficultySelector value="normal" onChange={mockOnChange} />);

      expect(screen.getByText("Easy")).toBeInTheDocument();
      expect(screen.getByText("Normal")).toBeInTheDocument();
      expect(screen.getByText("Rush Hour")).toBeInTheDocument();
    });

    it("displays 'Difficulty' label", () => {
      render(<DifficultySelector value="normal" onChange={mockOnChange} />);

      expect(screen.getByText("Difficulty")).toBeInTheDocument();
    });

    it("renders with radiogroup role", () => {
      render(<DifficultySelector value="normal" onChange={mockOnChange} />);

      expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    });
  });

  describe("selection state", () => {
    it.each<Difficulty>(["easy", "normal", "rush"])(
      "shows %s option as selected when value is %s",
      (difficulty) => {
        render(<DifficultySelector value={difficulty} onChange={mockOnChange} />);

        const selectedButton = screen.getByTestId(`difficulty-${difficulty}`);
        expect(selectedButton).toHaveAttribute("data-state", "selected");
        expect(selectedButton).toBeChecked();
      }
    );

    it("shows non-selected options as unselected", () => {
      render(<DifficultySelector value="normal" onChange={mockOnChange} />);

      expect(screen.getByTestId("difficulty-easy")).toHaveAttribute("data-state", "unselected");
      expect(screen.getByTestId("difficulty-rush")).toHaveAttribute("data-state", "unselected");
    });
  });

  describe("description display", () => {
    it.each(DIFFICULTY_OPTIONS)(
      "displays correct description for $value option",
      ({ value, description }) => {
        render(<DifficultySelector value={value} onChange={mockOnChange} />);

        // Description is shown inline on the button
        expect(screen.getByText(description)).toBeInTheDocument();
      }
    );
  });

  describe("interactions", () => {
    it("calls onChange with 'easy' when Easy is clicked", async () => {
      const user = userEvent.setup();
      render(<DifficultySelector value="normal" onChange={mockOnChange} />);

      await user.click(screen.getByTestId("difficulty-easy"));

      expect(mockOnChange).toHaveBeenCalledWith("easy");
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("calls onChange with 'normal' when Normal is clicked", async () => {
      const user = userEvent.setup();
      render(<DifficultySelector value="easy" onChange={mockOnChange} />);

      await user.click(screen.getByTestId("difficulty-normal"));

      expect(mockOnChange).toHaveBeenCalledWith("normal");
    });

    it("calls onChange with 'rush' when Rush Hour is clicked", async () => {
      const user = userEvent.setup();
      render(<DifficultySelector value="normal" onChange={mockOnChange} />);

      await user.click(screen.getByTestId("difficulty-rush"));

      expect(mockOnChange).toHaveBeenCalledWith("rush");
    });

    it("calls onChange when clicking already selected option", async () => {
      const user = userEvent.setup();
      render(<DifficultySelector value="normal" onChange={mockOnChange} />);

      await user.click(screen.getByTestId("difficulty-normal"));

      expect(mockOnChange).toHaveBeenCalledWith("normal");
    });
  });

  describe("accessibility", () => {
    it("has correct aria-label on radiogroup", () => {
      render(<DifficultySelector value="normal" onChange={mockOnChange} />);

      expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-label", "Difficulty selection");
    });

    it("each button has role='radio'", () => {
      render(<DifficultySelector value="normal" onChange={mockOnChange} />);

      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(3);
    });

    it("buttons are type='button' to prevent form submission", () => {
      render(<DifficultySelector value="normal" onChange={mockOnChange} />);

      const buttons = screen.getAllByRole("radio");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("type", "button");
      });
    });
  });
});
