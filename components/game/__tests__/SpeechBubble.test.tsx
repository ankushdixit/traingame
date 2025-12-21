import { render, screen } from "@testing-library/react";
import { SpeechBubble } from "../SpeechBubble";

describe("SpeechBubble", () => {
  describe("rendering", () => {
    it("renders with data-testid", () => {
      render(<SpeechBubble stationName="Grant Road" />);
      expect(screen.getByTestId("speech-bubble")).toBeInTheDocument();
    });

    it("displays the station name", () => {
      render(<SpeechBubble stationName="Grant Road" />);
      expect(screen.getByTestId("speech-bubble-destination")).toHaveTextContent("Grant Road");
    });

    it("includes arrow symbol before station name", () => {
      render(<SpeechBubble stationName="Dadar" />);
      expect(screen.getByTestId("speech-bubble-destination")).toHaveTextContent("→");
    });

    it("displays different station names correctly", () => {
      const stations = ["Churchgate", "Marine Lines", "Charni Road", "Mumbai Central", "Dadar"];

      stations.forEach((station) => {
        const { unmount } = render(<SpeechBubble stationName={station} />);
        expect(screen.getByTestId("speech-bubble-destination")).toHaveTextContent(station);
        unmount();
      });
    });
  });

  describe("positioning", () => {
    it("positions at top by default", () => {
      render(<SpeechBubble stationName="Grant Road" />);
      const bubble = screen.getByTestId("speech-bubble");
      expect(bubble).toHaveClass("bottom-full");
    });

    it("positions at top when position='top'", () => {
      render(<SpeechBubble stationName="Grant Road" position="top" />);
      const bubble = screen.getByTestId("speech-bubble");
      expect(bubble).toHaveClass("bottom-full");
    });

    it("positions at bottom when position='bottom'", () => {
      render(<SpeechBubble stationName="Grant Road" position="bottom" />);
      const bubble = screen.getByTestId("speech-bubble");
      expect(bubble).toHaveClass("top-full");
    });
  });

  describe("styling", () => {
    it("has centered positioning", () => {
      render(<SpeechBubble stationName="Grant Road" />);
      const bubble = screen.getByTestId("speech-bubble");
      expect(bubble).toHaveClass("left-1/2", "-translate-x-1/2");
    });

    it("has high z-index for overlay", () => {
      render(<SpeechBubble stationName="Grant Road" />);
      const bubble = screen.getByTestId("speech-bubble");
      expect(bubble).toHaveClass("z-20");
    });

    it("has white background", () => {
      render(<SpeechBubble stationName="Grant Road" />);
      const bubble = screen.getByTestId("speech-bubble");
      expect(bubble.querySelector(".bg-white")).toBeInTheDocument();
    });

    it("has border styling", () => {
      render(<SpeechBubble stationName="Grant Road" />);
      const bubble = screen.getByTestId("speech-bubble");
      expect(bubble.querySelector(".border-2")).toBeInTheDocument();
    });

    it("has shadow for visual depth", () => {
      render(<SpeechBubble stationName="Grant Road" />);
      const bubble = screen.getByTestId("speech-bubble");
      expect(bubble.querySelector(".shadow-md")).toBeInTheDocument();
    });
  });

  describe("speech bubble tail", () => {
    it("renders hidden tail element for screen readers", () => {
      const { container } = render(<SpeechBubble stationName="Grant Road" />);
      const tail = container.querySelector('[aria-hidden="true"]');
      expect(tail).toBeInTheDocument();
    });
  });

  describe("text styling", () => {
    it("uses appropriate text size and weight", () => {
      render(<SpeechBubble stationName="Grant Road" />);
      const destination = screen.getByTestId("speech-bubble-destination");
      expect(destination).toHaveClass("text-xs", "font-medium");
    });

    it("prevents text wrapping", () => {
      render(<SpeechBubble stationName="Grant Road" />);
      const destination = screen.getByTestId("speech-bubble-destination");
      expect(destination).toHaveClass("whitespace-nowrap");
    });
  });
});
