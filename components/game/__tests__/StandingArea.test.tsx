import { render, screen } from "@testing-library/react";
import { StandingArea } from "../StandingArea";
import { StandingNPC } from "@/lib/types";

describe("StandingArea", () => {
  describe("when there are no standing NPCs and no message", () => {
    it("renders nothing", () => {
      const { container } = render(<StandingArea standingNPCs={[]} lastClaimMessage={null} />);

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("when there are standing NPCs", () => {
    it("renders the standing area", () => {
      const npcs: StandingNPC[] = [
        { id: "standing-0", targetSeatId: null, claimPriority: 0.5, characterSprite: 0 },
      ];
      render(<StandingArea standingNPCs={npcs} lastClaimMessage={null} />);

      expect(screen.getByTestId("standing-area")).toBeInTheDocument();
    });

    it("renders each standing NPC", () => {
      const npcs: StandingNPC[] = [
        { id: "standing-0", targetSeatId: null, claimPriority: 0.5, characterSprite: 0 },
        { id: "standing-1", targetSeatId: null, claimPriority: 0.6, characterSprite: 1 },
        { id: "standing-2", targetSeatId: null, claimPriority: 0.7, characterSprite: 2 },
      ];
      render(<StandingArea standingNPCs={npcs} lastClaimMessage={null} />);

      expect(screen.getByTestId("standing-npc-standing-0")).toBeInTheDocument();
      expect(screen.getByTestId("standing-npc-standing-1")).toBeInTheDocument();
      expect(screen.getByTestId("standing-npc-standing-2")).toBeInTheDocument();
    });

    it("displays 'Standing Passengers' label", () => {
      const npcs: StandingNPC[] = [
        { id: "standing-0", targetSeatId: null, claimPriority: 0.5, characterSprite: 0 },
      ];
      render(<StandingArea standingNPCs={npcs} lastClaimMessage={null} />);

      expect(screen.getByText("Standing Passengers")).toBeInTheDocument();
    });
  });

  describe("claim message", () => {
    it("displays claim message when provided", () => {
      render(<StandingArea standingNPCs={[]} lastClaimMessage="A passenger grabbed the seat!" />);

      expect(screen.getByTestId("claim-message")).toBeInTheDocument();
      expect(screen.getByText("A passenger grabbed the seat!")).toBeInTheDocument();
    });

    it("has alert role for accessibility", () => {
      render(<StandingArea standingNPCs={[]} lastClaimMessage="A passenger grabbed the seat!" />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("displays claim message even with standing NPCs", () => {
      const npcs: StandingNPC[] = [
        { id: "standing-0", targetSeatId: null, claimPriority: 0.5, characterSprite: 0 },
      ];
      render(<StandingArea standingNPCs={npcs} lastClaimMessage="A passenger grabbed the seat!" />);

      expect(screen.getByTestId("standing-area")).toBeInTheDocument();
      expect(screen.getByTestId("claim-message")).toBeInTheDocument();
    });

    it("does not show claim message when null", () => {
      const npcs: StandingNPC[] = [
        { id: "standing-0", targetSeatId: null, claimPriority: 0.5, characterSprite: 0 },
      ];
      render(<StandingArea standingNPCs={npcs} lastClaimMessage={null} />);

      expect(screen.queryByTestId("claim-message")).not.toBeInTheDocument();
    });
  });

  describe("visual elements", () => {
    it("renders standing person emoji for each NPC", () => {
      const npcs: StandingNPC[] = [
        { id: "standing-0", targetSeatId: null, claimPriority: 0.5, characterSprite: 0 },
      ];
      render(<StandingArea standingNPCs={npcs} lastClaimMessage={null} />);

      const npcElement = screen.getByTestId("standing-npc-standing-0");
      expect(npcElement).toHaveTextContent("🧍");
    });
  });
});
