import { render, screen } from "@testing-library/react";
import Home from "../page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Home Page", () => {
  it("renders the game title", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: "Mumbai Local Train Game" })).toBeInTheDocument();
  });

  it("renders the station selection form", () => {
    render(<Home />);

    expect(screen.getByLabelText("Board at")).toBeInTheDocument();
    expect(screen.getByLabelText("Get off at")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start Game" })).toBeInTheDocument();
  });

  it("has theme-based background styling", () => {
    const { container } = render(<Home />);

    const main = container.querySelector("main");
    expect(main).toHaveClass("bg-background");
    expect(main).toHaveClass("text-foreground");
  });
});
