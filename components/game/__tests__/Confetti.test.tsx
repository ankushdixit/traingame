import { render, screen } from "@testing-library/react";
import { Confetti } from "../Confetti";

describe("Confetti", () => {
  describe("when active", () => {
    it("renders confetti container", () => {
      render(<Confetti isActive={true} />);

      expect(screen.getByTestId("confetti-container")).toBeInTheDocument();
    });

    it("renders 50 confetti pieces", () => {
      render(<Confetti isActive={true} />);

      const pieces = screen.getAllByTestId("confetti-piece");
      expect(pieces).toHaveLength(50);
    });

    it("confetti container has pointer-events-none", () => {
      render(<Confetti isActive={true} />);

      const container = screen.getByTestId("confetti-container");
      expect(container).toHaveClass("pointer-events-none");
    });

    it("confetti container is hidden from screen readers", () => {
      render(<Confetti isActive={true} />);

      const container = screen.getByTestId("confetti-container");
      expect(container).toHaveAttribute("aria-hidden", "true");
    });

    it("confetti pieces have animation class", () => {
      render(<Confetti isActive={true} />);

      const pieces = screen.getAllByTestId("confetti-piece");
      pieces.forEach((piece) => {
        expect(piece).toHaveClass("animate-confetti");
      });
    });

    it("confetti pieces have inline styles for position and color", () => {
      render(<Confetti isActive={true} />);

      const pieces = screen.getAllByTestId("confetti-piece");
      pieces.forEach((piece) => {
        expect(piece).toHaveStyle({
          backgroundColor: expect.any(String),
        });
        // Check left position is set
        expect(piece.style.left).toMatch(/^\d+(\.\d+)?%$/);
      });
    });

    it("defaults to active when no prop provided", () => {
      render(<Confetti />);

      expect(screen.getByTestId("confetti-container")).toBeInTheDocument();
    });
  });

  describe("when inactive", () => {
    it("does not render anything", () => {
      render(<Confetti isActive={false} />);

      expect(screen.queryByTestId("confetti-container")).not.toBeInTheDocument();
    });
  });
});
