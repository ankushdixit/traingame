import { render, screen } from "@testing-library/react";
import { TrainCompartment } from "../TrainCompartment";

describe("TrainCompartment", () => {
  describe("rendering", () => {
    it("renders train compartment container", () => {
      render(<TrainCompartment>Content</TrainCompartment>);

      expect(screen.getByTestId("train-compartment")).toBeInTheDocument();
    });

    it("renders children content", () => {
      render(
        <TrainCompartment>
          <div data-testid="test-child">Test Content</div>
        </TrainCompartment>
      );

      expect(screen.getByTestId("test-child")).toBeInTheDocument();
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("renders train interior elements", () => {
      render(<TrainCompartment>Content</TrainCompartment>);

      // Interior elements should be present
      expect(screen.getByTestId("train-ceiling")).toBeInTheDocument();
      expect(screen.getByTestId("train-window")).toBeInTheDocument();
      expect(screen.getByTestId("train-floor")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("has train cream background", () => {
      render(<TrainCompartment>Content</TrainCompartment>);

      expect(screen.getByTestId("train-compartment")).toHaveClass("bg-train-cream");
    });

    it("has train maroon border", () => {
      render(<TrainCompartment>Content</TrainCompartment>);

      expect(screen.getByTestId("train-compartment")).toHaveClass("border-train-maroon");
    });

    it("has rounded corners", () => {
      render(<TrainCompartment>Content</TrainCompartment>);

      expect(screen.getByTestId("train-compartment")).toHaveClass("rounded-lg");
    });

    it("has shadow", () => {
      render(<TrainCompartment>Content</TrainCompartment>);

      expect(screen.getByTestId("train-compartment")).toHaveClass("shadow-xl");
    });
  });

  describe("station animation", () => {
    it("passes currentStation to TrainInterior for animation", () => {
      render(<TrainCompartment currentStation={3}>Content</TrainCompartment>);

      // When currentStation > 0, scenery should animate
      const scenery = screen.getByTestId("window-scenery");
      expect(scenery).toHaveClass("animate-scenery");
    });

    it("does not animate on initial render (station 0)", () => {
      render(<TrainCompartment currentStation={0}>Content</TrainCompartment>);

      const scenery = screen.getByTestId("window-scenery");
      expect(scenery).not.toHaveClass("animate-scenery");
    });
  });
});
