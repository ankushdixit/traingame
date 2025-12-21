import { render, screen } from "@testing-library/react";
import { TrainCompartment } from "../TrainCompartment";

describe("TrainCompartment", () => {
  describe("rendering", () => {
    it("renders train compartment container", () => {
      render(
        <TrainCompartment
          topRow={<div>Top Row</div>}
          standingArea={<div>Standing Area</div>}
          bottomRow={<div>Bottom Row</div>}
          statusBar={<div>Status Bar</div>}
        />
      );

      expect(screen.getByTestId("train-compartment")).toBeInTheDocument();
    });

    it("renders all sections content", () => {
      render(
        <TrainCompartment
          topRow={<div data-testid="test-top-row">Top Row Content</div>}
          standingArea={<div data-testid="test-standing-area">Standing Area Content</div>}
          bottomRow={<div data-testid="test-bottom-row">Bottom Row Content</div>}
          statusBar={<div data-testid="test-status-bar">Status Bar Content</div>}
        />
      );

      expect(screen.getByTestId("test-top-row")).toBeInTheDocument();
      expect(screen.getByText("Top Row Content")).toBeInTheDocument();
      expect(screen.getByTestId("test-standing-area")).toBeInTheDocument();
      expect(screen.getByText("Standing Area Content")).toBeInTheDocument();
      expect(screen.getByTestId("test-bottom-row")).toBeInTheDocument();
      expect(screen.getByText("Bottom Row Content")).toBeInTheDocument();
      expect(screen.getByTestId("test-status-bar")).toBeInTheDocument();
      expect(screen.getByText("Status Bar Content")).toBeInTheDocument();
    });

    it("renders train interior elements", () => {
      render(
        <TrainCompartment
          topRow={<div>Top Row</div>}
          standingArea={<div>Standing Area</div>}
          bottomRow={<div>Bottom Row</div>}
          statusBar={<div>Status Bar</div>}
        />
      );

      // Interior elements should be present (window only, no grab handles)
      expect(screen.getByTestId("train-window")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("has gradient background", () => {
      render(
        <TrainCompartment
          topRow={<div>Top Row</div>}
          standingArea={<div>Standing Area</div>}
          bottomRow={<div>Bottom Row</div>}
          statusBar={<div>Status Bar</div>}
        />
      );

      expect(screen.getByTestId("train-compartment")).toHaveClass("bg-gradient-to-b");
      expect(screen.getByTestId("train-compartment")).toHaveClass("from-stone-300");
    });

    it("has border styling", () => {
      render(
        <TrainCompartment
          topRow={<div>Top Row</div>}
          standingArea={<div>Standing Area</div>}
          bottomRow={<div>Bottom Row</div>}
          statusBar={<div>Status Bar</div>}
        />
      );

      expect(screen.getByTestId("train-compartment")).toHaveClass("border-4");
      expect(screen.getByTestId("train-compartment")).toHaveClass("border-stone-500");
    });

    it("has rounded corners", () => {
      render(
        <TrainCompartment
          topRow={<div>Top Row</div>}
          standingArea={<div>Standing Area</div>}
          bottomRow={<div>Bottom Row</div>}
          statusBar={<div>Status Bar</div>}
        />
      );

      expect(screen.getByTestId("train-compartment")).toHaveClass("rounded-2xl");
    });

    it("has shadow", () => {
      render(
        <TrainCompartment
          topRow={<div>Top Row</div>}
          standingArea={<div>Standing Area</div>}
          bottomRow={<div>Bottom Row</div>}
          statusBar={<div>Status Bar</div>}
        />
      );

      expect(screen.getByTestId("train-compartment")).toHaveClass("shadow-xl");
    });
  });

  describe("shaking animation", () => {
    it("applies shake animation class when isShaking is true", () => {
      render(
        <TrainCompartment
          topRow={<div>Top Row</div>}
          standingArea={<div>Standing Area</div>}
          bottomRow={<div>Bottom Row</div>}
          statusBar={<div>Status Bar</div>}
          isShaking={true}
        />
      );

      expect(screen.getByTestId("train-compartment")).toHaveClass("animate-train-shake");
    });

    it("does not apply shake animation when isShaking is false", () => {
      render(
        <TrainCompartment
          topRow={<div>Top Row</div>}
          standingArea={<div>Standing Area</div>}
          bottomRow={<div>Bottom Row</div>}
          statusBar={<div>Status Bar</div>}
          isShaking={false}
        />
      );

      expect(screen.getByTestId("train-compartment")).not.toHaveClass("animate-train-shake");
    });

    it("does not apply shake animation by default", () => {
      render(
        <TrainCompartment
          topRow={<div>Top Row</div>}
          standingArea={<div>Standing Area</div>}
          bottomRow={<div>Bottom Row</div>}
          statusBar={<div>Status Bar</div>}
        />
      );

      expect(screen.getByTestId("train-compartment")).not.toHaveClass("animate-train-shake");
    });
  });
});
