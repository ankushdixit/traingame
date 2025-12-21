import { render, screen } from "@testing-library/react";
import { GameHeader } from "../GameHeader";

// Mock SoundContext since GameHeader includes SoundToggle
jest.mock("@/contexts/SoundContext", () => ({
  useSound: () => ({
    isMuted: false,
    toggleMute: jest.fn(),
    playSound: jest.fn(),
  }),
}));

describe("GameHeader", () => {
  describe("current station display", () => {
    it("displays current station name for Churchgate", () => {
      render(<GameHeader currentStation={0} playerDestination={5} />);

      expect(screen.getByTestId("current-station")).toHaveTextContent("Churchgate");
    });

    it("displays current station name for Marine Lines", () => {
      render(<GameHeader currentStation={1} playerDestination={5} />);

      expect(screen.getByTestId("current-station")).toHaveTextContent("Marine Lines");
    });

    it("displays current station name for Mumbai Central", () => {
      render(<GameHeader currentStation={4} playerDestination={5} />);

      expect(screen.getByTestId("current-station")).toHaveTextContent("Mumbai Central");
    });
  });

  describe("next station display", () => {
    it("displays next station for Churchgate", () => {
      render(<GameHeader currentStation={0} playerDestination={5} />);

      expect(screen.getByTestId("next-station")).toHaveTextContent("Next: Marine Lines");
    });

    it("displays next station for Charni Road", () => {
      render(<GameHeader currentStation={2} playerDestination={5} />);

      expect(screen.getByTestId("next-station")).toHaveTextContent("Next: Grant Road");
    });

    it("displays 'Final: Dadar' when at Mumbai Central", () => {
      render(<GameHeader currentStation={4} playerDestination={5} />);

      expect(screen.getByTestId("next-station")).toHaveTextContent("Final: Dadar");
    });
  });

  describe("destination display", () => {
    it("displays player destination for Dadar", () => {
      render(<GameHeader currentStation={0} playerDestination={5} />);

      expect(screen.getByTestId("destination")).toHaveTextContent("Your destination: Dadar");
    });

    it("displays player destination for Grant Road", () => {
      render(<GameHeader currentStation={0} playerDestination={3} />);

      expect(screen.getByTestId("destination")).toHaveTextContent("Your destination: Grant Road");
    });

    it("displays player destination for Mumbai Central", () => {
      render(<GameHeader currentStation={0} playerDestination={4} />);

      expect(screen.getByTestId("destination")).toHaveTextContent(
        "Your destination: Mumbai Central"
      );
    });
  });

  describe("remaining stations calculation", () => {
    it("calculates 5 remaining stations from Churchgate to Dadar", () => {
      render(<GameHeader currentStation={0} playerDestination={5} />);

      expect(screen.getByTestId("remaining-stations")).toHaveTextContent("5 stations remaining");
    });

    it("calculates 3 remaining stations from Charni Road to Dadar", () => {
      render(<GameHeader currentStation={2} playerDestination={5} />);

      expect(screen.getByTestId("remaining-stations")).toHaveTextContent("3 stations remaining");
    });

    it("calculates 1 remaining station from Mumbai Central to Dadar", () => {
      render(<GameHeader currentStation={4} playerDestination={5} />);

      expect(screen.getByTestId("remaining-stations")).toHaveTextContent("1 station remaining");
    });

    it("calculates 2 remaining stations from Marine Lines to Grant Road", () => {
      render(<GameHeader currentStation={1} playerDestination={3} />);

      expect(screen.getByTestId("remaining-stations")).toHaveTextContent("2 stations remaining");
    });

    it("uses singular 'station' for 1 remaining", () => {
      render(<GameHeader currentStation={4} playerDestination={5} />);

      expect(screen.getByTestId("remaining-stations")).toHaveTextContent("1 station remaining");
      expect(screen.getByTestId("remaining-stations")).not.toHaveTextContent("stations");
    });
  });

  it("has game-header testid", () => {
    render(<GameHeader currentStation={0} playerDestination={5} />);

    expect(screen.getByTestId("game-header")).toBeInTheDocument();
  });
});
