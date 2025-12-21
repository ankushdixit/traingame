import { render, screen } from "@testing-library/react";
import { StandingArea } from "../StandingArea";
import { StandingNPC } from "@/lib/types";

describe("StandingArea", () => {
  describe("when player is seated and no standing NPCs", () => {
    it("renders the standing area with empty spots", () => {
      render(<StandingArea standingNPCs={[]} lastClaimMessage={null} isPlayerSeated={true} />);

      expect(screen.getByTestId("standing-area")).toBeInTheDocument();
      // All 6 spots should be rendered
      for (let i = 0; i < 6; i++) {
        expect(screen.getByTestId(`standing-spot-${i}`)).toBeInTheDocument();
      }
    });
  });

  describe("when there are standing NPCs", () => {
    it("renders the standing area", () => {
      const npcs: StandingNPC[] = [
        {
          id: "standing-0",
          targetSeatId: null,
          claimPriority: 0.5,
          characterSprite: 0,
          standingSpot: 0,
        },
      ];
      render(<StandingArea standingNPCs={npcs} lastClaimMessage={null} isPlayerSeated={false} />);

      expect(screen.getByTestId("standing-area")).toBeInTheDocument();
    });

    it("renders each standing NPC in their spot", () => {
      const npcs: StandingNPC[] = [
        {
          id: "standing-0",
          targetSeatId: null,
          claimPriority: 0.5,
          characterSprite: 0,
          standingSpot: 0,
        },
        {
          id: "standing-1",
          targetSeatId: null,
          claimPriority: 0.6,
          characterSprite: 1,
          standingSpot: 2,
        },
        {
          id: "standing-2",
          targetSeatId: null,
          claimPriority: 0.7,
          characterSprite: 2,
          standingSpot: 4,
        },
      ];
      render(<StandingArea standingNPCs={npcs} lastClaimMessage={null} isPlayerSeated={true} />);

      expect(screen.getByTestId("standing-npc-standing-0")).toBeInTheDocument();
      expect(screen.getByTestId("standing-npc-standing-1")).toBeInTheDocument();
      expect(screen.getByTestId("standing-npc-standing-2")).toBeInTheDocument();
    });

    it("displays 'Aisle' label", () => {
      const npcs: StandingNPC[] = [
        {
          id: "standing-0",
          targetSeatId: null,
          claimPriority: 0.5,
          characterSprite: 0,
          standingSpot: 0,
        },
      ];
      render(<StandingArea standingNPCs={npcs} lastClaimMessage={null} isPlayerSeated={false} />);

      expect(screen.getByText("Aisle")).toBeInTheDocument();
    });

    it("renders all 6 standing spots", () => {
      const npcs: StandingNPC[] = [
        {
          id: "standing-0",
          targetSeatId: null,
          claimPriority: 0.5,
          characterSprite: 0,
          standingSpot: 0,
        },
      ];
      render(<StandingArea standingNPCs={npcs} lastClaimMessage={null} isPlayerSeated={false} />);

      for (let i = 0; i < 6; i++) {
        expect(screen.getByTestId(`standing-spot-${i}`)).toBeInTheDocument();
      }
    });

    it("displays player when not seated", () => {
      render(
        <StandingArea
          standingNPCs={[]}
          lastClaimMessage={null}
          isPlayerSeated={false}
          playerStandingSpot={2}
        />
      );

      expect(screen.getByTestId("player-standing")).toBeInTheDocument();
    });

    it("does not display player when seated", () => {
      render(
        <StandingArea
          standingNPCs={[]}
          lastClaimMessage={null}
          isPlayerSeated={true}
          playerStandingSpot={2}
        />
      );

      expect(screen.queryByTestId("player-standing")).not.toBeInTheDocument();
    });
  });

  describe("claim message", () => {
    it("displays claim message when provided", () => {
      render(
        <StandingArea
          standingNPCs={[]}
          lastClaimMessage="A passenger grabbed the seat!"
          isPlayerSeated={true}
        />
      );

      expect(screen.getByTestId("claim-message")).toBeInTheDocument();
      expect(screen.getByText("A passenger grabbed the seat!")).toBeInTheDocument();
    });

    it("has alert role for accessibility", () => {
      render(
        <StandingArea
          standingNPCs={[]}
          lastClaimMessage="A passenger grabbed the seat!"
          isPlayerSeated={true}
        />
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("displays claim message even with standing NPCs", () => {
      const npcs: StandingNPC[] = [
        {
          id: "standing-0",
          targetSeatId: null,
          claimPriority: 0.5,
          characterSprite: 0,
          standingSpot: 0,
        },
      ];
      render(
        <StandingArea
          standingNPCs={npcs}
          lastClaimMessage="A passenger grabbed the seat!"
          isPlayerSeated={false}
        />
      );

      expect(screen.getByTestId("standing-area")).toBeInTheDocument();
      expect(screen.getByTestId("claim-message")).toBeInTheDocument();
    });

    it("does not show claim message when null", () => {
      const npcs: StandingNPC[] = [
        {
          id: "standing-0",
          targetSeatId: null,
          claimPriority: 0.5,
          characterSprite: 0,
          standingSpot: 0,
        },
      ];
      render(<StandingArea standingNPCs={npcs} lastClaimMessage={null} isPlayerSeated={true} />);

      expect(screen.queryByTestId("claim-message")).not.toBeInTheDocument();
    });
  });

  describe("visual elements", () => {
    it("renders character illustration for each standing NPC", () => {
      const npcs: StandingNPC[] = [
        {
          id: "standing-0",
          targetSeatId: null,
          claimPriority: 0.5,
          characterSprite: 0,
          standingSpot: 0,
        },
      ];
      render(<StandingArea standingNPCs={npcs} lastClaimMessage={null} isPlayerSeated={true} />);

      const npcElement = screen.getByTestId("standing-npc-standing-0");
      // Check that it contains an SVG (character illustration)
      expect(npcElement.querySelector("svg")).toBeInTheDocument();
    });
  });
});
