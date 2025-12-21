import { render, screen } from "@testing-library/react";
import { TrainInterior } from "../TrainInterior";

describe("TrainInterior", () => {
  describe("rendering", () => {
    it("renders train ceiling", () => {
      render(<TrainInterior />);

      expect(screen.getByTestId("train-ceiling")).toBeInTheDocument();
    });

    it("renders 5 ceiling handles", () => {
      render(<TrainInterior />);

      const handles = screen.getAllByTestId("ceiling-handle");
      expect(handles).toHaveLength(5);
    });

    it("renders left and right poles", () => {
      render(<TrainInterior />);

      expect(screen.getByTestId("pole-left")).toBeInTheDocument();
      expect(screen.getByTestId("pole-right")).toBeInTheDocument();
    });

    it("renders train window", () => {
      render(<TrainInterior />);

      expect(screen.getByTestId("train-window")).toBeInTheDocument();
    });

    it("renders window scenery", () => {
      render(<TrainInterior />);

      expect(screen.getByTestId("window-scenery")).toBeInTheDocument();
    });

    it("renders train floor", () => {
      render(<TrainInterior />);

      expect(screen.getByTestId("train-floor")).toBeInTheDocument();
    });
  });

  describe("scenery animation", () => {
    it("does not animate scenery when stationKey is undefined", () => {
      render(<TrainInterior />);

      const scenery = screen.getByTestId("window-scenery");
      expect(scenery).not.toHaveClass("animate-scenery");
    });

    it("does not animate scenery when stationKey is 0", () => {
      render(<TrainInterior stationKey={0} />);

      const scenery = screen.getByTestId("window-scenery");
      expect(scenery).not.toHaveClass("animate-scenery");
    });

    it("animates scenery when stationKey is greater than 0", () => {
      render(<TrainInterior stationKey={1} />);

      const scenery = screen.getByTestId("window-scenery");
      expect(scenery).toHaveClass("animate-scenery");
    });

    it("animates scenery for higher station numbers", () => {
      render(<TrainInterior stationKey={5} />);

      const scenery = screen.getByTestId("window-scenery");
      expect(scenery).toHaveClass("animate-scenery");
    });
  });

  describe("styling", () => {
    it("ceiling has train metallic dark background", () => {
      render(<TrainInterior />);

      expect(screen.getByTestId("train-ceiling")).toHaveClass("bg-train-metallic-dark");
    });

    it("poles have train metallic background", () => {
      render(<TrainInterior />);

      expect(screen.getByTestId("pole-left")).toHaveClass("bg-train-metallic");
      expect(screen.getByTestId("pole-right")).toHaveClass("bg-train-metallic");
    });

    it("floor has train floor background", () => {
      render(<TrainInterior />);

      expect(screen.getByTestId("train-floor")).toHaveClass("bg-train-floor");
    });
  });
});
