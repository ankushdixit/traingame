import { render, screen } from "@testing-library/react";
import { GrabPhaseOverlay } from "../GrabPhaseOverlay";

describe("GrabPhaseOverlay", () => {
  const defaultProps = {
    isActive: true,
    timeRemaining: 1500,
    openSeatsCount: 1,
    playerTapped: false,
  };

  describe("when inactive", () => {
    it("renders nothing when not active", () => {
      const { container } = render(<GrabPhaseOverlay {...defaultProps} isActive={false} />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("when active", () => {
    it("renders the overlay", () => {
      render(<GrabPhaseOverlay {...defaultProps} />);
      expect(screen.getByTestId("grab-phase-overlay")).toBeInTheDocument();
    });

    it("shows timer bar", () => {
      render(<GrabPhaseOverlay {...defaultProps} />);
      expect(screen.getByTestId("grab-timer-bar")).toBeInTheDocument();
    });

    it("shows 'SEAT AVAILABLE!' for single seat", () => {
      render(<GrabPhaseOverlay {...defaultProps} openSeatsCount={1} />);
      expect(screen.getByText("SEAT AVAILABLE!")).toBeInTheDocument();
    });

    it("shows '2 SEATS AVAILABLE!' for multiple seats", () => {
      render(<GrabPhaseOverlay {...defaultProps} openSeatsCount={2} />);
      expect(screen.getByText("2 SEATS AVAILABLE!")).toBeInTheDocument();
    });

    it("shows tap instruction", () => {
      render(<GrabPhaseOverlay {...defaultProps} />);
      expect(screen.getByText("TAP THE SEAT TO GRAB!")).toBeInTheDocument();
    });

    it("shows remaining time", () => {
      render(<GrabPhaseOverlay {...defaultProps} timeRemaining={1500} />);
      expect(screen.getByText("2s remaining")).toBeInTheDocument();
    });

    it("shows position hint when not tapped", () => {
      render(<GrabPhaseOverlay {...defaultProps} playerTapped={false} />);
      expect(screen.getByText("Adjacent position = faster grab")).toBeInTheDocument();
    });
  });

  describe("when player has tapped", () => {
    it("shows grabbing message", () => {
      render(<GrabPhaseOverlay {...defaultProps} playerTapped={true} />);
      expect(screen.getByText("GRABBING...")).toBeInTheDocument();
      expect(screen.getByText("Wait for result!")).toBeInTheDocument();
    });

    it("hides position hint", () => {
      render(<GrabPhaseOverlay {...defaultProps} playerTapped={true} />);
      expect(screen.queryByText("Adjacent position = faster grab")).not.toBeInTheDocument();
    });
  });

  describe("urgent state", () => {
    it("shows red timer bar when time is low", () => {
      render(<GrabPhaseOverlay {...defaultProps} timeRemaining={400} />);
      const timerBar = screen.getByTestId("grab-timer-bar");
      expect(timerBar).toHaveClass("bg-red-500");
    });

    it("shows green timer bar when time is sufficient", () => {
      render(<GrabPhaseOverlay {...defaultProps} timeRemaining={1500} />);
      const timerBar = screen.getByTestId("grab-timer-bar");
      expect(timerBar).toHaveClass("bg-emerald-400");
    });
  });

  describe("timer bar progress", () => {
    it("shows full width at max time", () => {
      render(<GrabPhaseOverlay {...defaultProps} timeRemaining={2000} />);
      const timerBar = screen.getByTestId("grab-timer-bar");
      expect(timerBar).toHaveStyle({ width: "100%" });
    });

    it("shows 50% width at half time", () => {
      render(<GrabPhaseOverlay {...defaultProps} timeRemaining={1000} />);
      const timerBar = screen.getByTestId("grab-timer-bar");
      expect(timerBar).toHaveStyle({ width: "50%" });
    });
  });
});
