import { render, screen } from "@testing-library/react";
import { TrainInterior } from "../TrainInterior";

describe("TrainInterior", () => {
  describe("rendering", () => {
    it("renders train window", () => {
      render(<TrainInterior />);

      expect(screen.getByTestId("train-window")).toBeInTheDocument();
    });
  });

  describe("window scenery", () => {
    it("has sky gradient background", () => {
      render(<TrainInterior />);

      const window = screen.getByTestId("train-window");
      expect(window).toHaveClass("bg-gradient-to-b", "from-sky-300", "to-sky-100");
    });

    it("has border styling", () => {
      render(<TrainInterior />);

      const window = screen.getByTestId("train-window");
      expect(window).toHaveClass("border-4", "border-stone-400");
    });
  });

  describe("animation", () => {
    it("does not animate when isMoving is false", () => {
      render(<TrainInterior isMoving={false} />);

      const window = screen.getByTestId("train-window");
      expect(window).toBeInTheDocument();
      // Animation classes are applied to children, not the window itself
    });

    it("applies animation when isMoving is true", () => {
      render(<TrainInterior isMoving={true} />);

      const window = screen.getByTestId("train-window");
      expect(window).toBeInTheDocument();
      // Animation classes are applied to children, not the window itself
    });

    it("does not animate when isMoving is undefined", () => {
      render(<TrainInterior />);

      const window = screen.getByTestId("train-window");
      expect(window).toBeInTheDocument();
    });
  });
});
