import { render, screen } from "@testing-library/react";
import Home from "../page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Home Page", () => {
  it("renders the game logo", () => {
    render(<Home />);

    expect(screen.getByAltText("Mumbai Local Rush")).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    render(<Home />);

    expect(screen.getByText("Can you find a seat before your stop?")).toBeInTheDocument();
  });

  it("renders train emojis", () => {
    render(<Home />);

    // Train emojis exist in LineSelector and buttons
    const trainEmojis = screen.getAllByText("🚃");
    expect(trainEmojis.length).toBeGreaterThan(0);
  });

  it("renders the station selection form", () => {
    render(<Home />);

    expect(screen.getByLabelText("📍 Boarding Station")).toBeInTheDocument();
    expect(screen.getByLabelText("🚩 Destination")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "🚃 Board Train" })).toBeInTheDocument();
  });

  it("has gradient background styling", () => {
    const { container } = render(<Home />);

    const main = container.querySelector("main");
    expect(main).toHaveClass("bg-gradient-to-b", "from-amber-50", "via-orange-50", "to-rose-50");
  });

  it("renders How to Play section", () => {
    render(<Home />);

    expect(screen.getByText("How to Play")).toBeInTheDocument();
    expect(screen.getByText(/Grab a seat before reaching your destination/)).toBeInTheDocument();
  });
});
