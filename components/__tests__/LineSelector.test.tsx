import { render, screen, fireEvent } from "@testing-library/react";
import { LineSelector } from "../LineSelector";

describe("LineSelector", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe("rendering", () => {
    it("renders both line options", () => {
      render(<LineSelector value="short" onChange={mockOnChange} />);

      expect(screen.getByText("Short Line")).toBeInTheDocument();
      expect(screen.getByText("Full Line")).toBeInTheDocument();
    });

    it("renders journey length label", () => {
      render(<LineSelector value="short" onChange={mockOnChange} />);

      expect(screen.getByText("Journey Length")).toBeInTheDocument();
    });

    it("renders station descriptions", () => {
      render(<LineSelector value="short" onChange={mockOnChange} />);

      expect(screen.getByText("Churchgate to Dadar (6 stations)")).toBeInTheDocument();
      expect(screen.getByText("Churchgate to Borivali (15 stations)")).toBeInTheDocument();
    });

    it("renders icons for each option", () => {
      render(<LineSelector value="short" onChange={mockOnChange} />);

      // Check for train emoji icons
      expect(screen.getByText("🚃")).toBeInTheDocument();
      expect(screen.getByText("🚂")).toBeInTheDocument();
    });
  });

  describe("selection state", () => {
    it("shows short line as selected when value is short", () => {
      render(<LineSelector value="short" onChange={mockOnChange} />);

      const shortOption = screen.getByTestId("line-option-short");
      const fullOption = screen.getByTestId("line-option-full");

      expect(shortOption).toHaveAttribute("data-selected", "true");
      expect(fullOption).toHaveAttribute("data-selected", "false");
    });

    it("shows full line as selected when value is full", () => {
      render(<LineSelector value="full" onChange={mockOnChange} />);

      const shortOption = screen.getByTestId("line-option-short");
      const fullOption = screen.getByTestId("line-option-full");

      expect(shortOption).toHaveAttribute("data-selected", "false");
      expect(fullOption).toHaveAttribute("data-selected", "true");
    });

    it("applies selected styling to short option", () => {
      render(<LineSelector value="short" onChange={mockOnChange} />);

      const shortOption = screen.getByTestId("line-option-short");
      expect(shortOption.className).toContain("border-amber-400");
      expect(shortOption.className).toContain("bg-amber-50");
    });

    it("applies selected styling to full option", () => {
      render(<LineSelector value="full" onChange={mockOnChange} />);

      const fullOption = screen.getByTestId("line-option-full");
      expect(fullOption.className).toContain("border-amber-400");
      expect(fullOption.className).toContain("bg-amber-50");
    });
  });

  describe("interaction", () => {
    it("calls onChange with 'short' when short option is clicked", () => {
      render(<LineSelector value="full" onChange={mockOnChange} />);

      const shortOption = screen.getByTestId("line-option-short");
      fireEvent.click(shortOption);

      expect(mockOnChange).toHaveBeenCalledWith("short");
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("calls onChange with 'full' when full option is clicked", () => {
      render(<LineSelector value="short" onChange={mockOnChange} />);

      const fullOption = screen.getByTestId("line-option-full");
      fireEvent.click(fullOption);

      expect(mockOnChange).toHaveBeenCalledWith("full");
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("calls onChange when clicking already selected option", () => {
      render(<LineSelector value="short" onChange={mockOnChange} />);

      const shortOption = screen.getByTestId("line-option-short");
      fireEvent.click(shortOption);

      expect(mockOnChange).toHaveBeenCalledWith("short");
    });

    it("buttons have type='button' to prevent form submission", () => {
      render(<LineSelector value="short" onChange={mockOnChange} />);

      const shortOption = screen.getByTestId("line-option-short");
      const fullOption = screen.getByTestId("line-option-full");

      expect(shortOption).toHaveAttribute("type", "button");
      expect(fullOption).toHaveAttribute("type", "button");
    });
  });

  describe("accessibility", () => {
    it("options are buttons that can be clicked", () => {
      render(<LineSelector value="short" onChange={mockOnChange} />);

      const shortOption = screen.getByTestId("line-option-short");
      const fullOption = screen.getByTestId("line-option-full");

      expect(shortOption.tagName).toBe("BUTTON");
      expect(fullOption.tagName).toBe("BUTTON");
    });
  });
});
