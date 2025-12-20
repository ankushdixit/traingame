import { render, screen } from "@testing-library/react";
import { PlayerStatus } from "../PlayerStatus";

describe("PlayerStatus", () => {
  describe("standing state", () => {
    it("displays 'You are standing' when not seated", () => {
      render(<PlayerStatus isSeated={false} />);

      expect(screen.getByTestId("standing-status")).toHaveTextContent("You are standing");
    });

    it("has standing-status testid when standing", () => {
      render(<PlayerStatus isSeated={false} />);

      expect(screen.getByTestId("standing-status")).toBeInTheDocument();
    });

    it("does not show seated-status testid when standing", () => {
      render(<PlayerStatus isSeated={false} />);

      expect(screen.queryByTestId("seated-status")).not.toBeInTheDocument();
    });

    it("has orange styling when standing", () => {
      render(<PlayerStatus isSeated={false} />);

      expect(screen.getByTestId("player-status")).toHaveClass("bg-orange-100");
    });
  });

  describe("seated state", () => {
    it("displays 'You are seated!' when seated", () => {
      render(<PlayerStatus isSeated={true} />);

      expect(screen.getByTestId("seated-status")).toHaveTextContent("You are seated!");
    });

    it("has seated-status testid when seated", () => {
      render(<PlayerStatus isSeated={true} />);

      expect(screen.getByTestId("seated-status")).toBeInTheDocument();
    });

    it("does not show standing-status testid when seated", () => {
      render(<PlayerStatus isSeated={true} />);

      expect(screen.queryByTestId("standing-status")).not.toBeInTheDocument();
    });

    it("has yellow styling when seated", () => {
      render(<PlayerStatus isSeated={true} />);

      expect(screen.getByTestId("player-status")).toHaveClass("bg-yellow-100");
    });
  });

  it("has player-status testid", () => {
    render(<PlayerStatus isSeated={false} />);

    expect(screen.getByTestId("player-status")).toBeInTheDocument();
  });
});
