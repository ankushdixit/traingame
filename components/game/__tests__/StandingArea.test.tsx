import { render, screen, fireEvent } from "@testing-library/react";
import { StandingArea } from "../StandingArea";
import { StandingNPC } from "@/lib/types";

const defaultProps = {
  standingNPCs: [] as StandingNPC[],
  lastClaimMessage: null,
  isPlayerSeated: true,
  playerStandingSpot: 0,
  onMovePosition: jest.fn(),
  actionsRemaining: 2,
  isGrabPhase: false,
};

const createNPC = (overrides: Partial<StandingNPC> = {}): StandingNPC => ({
  id: "standing-0",
  watchedSeatId: null,
  responseTimeBase: 500,
  characterSprite: 0,
  standingSpot: 0,
  ...overrides,
});

describe("StandingArea", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when player is seated and no standing NPCs", () => {
    it("renders the standing area with empty spots", () => {
      render(<StandingArea {...defaultProps} />);

      expect(screen.getByTestId("standing-area")).toBeInTheDocument();
      // All 6 spots should be rendered
      for (let i = 0; i < 6; i++) {
        expect(screen.getByTestId(`standing-spot-${i}`)).toBeInTheDocument();
      }
    });
  });

  describe("when there are standing NPCs", () => {
    it("renders the standing area", () => {
      const npcs: StandingNPC[] = [createNPC()];
      render(<StandingArea {...defaultProps} standingNPCs={npcs} isPlayerSeated={false} />);

      expect(screen.getByTestId("standing-area")).toBeInTheDocument();
    });

    it("renders each standing NPC in their spot", () => {
      const npcs: StandingNPC[] = [
        createNPC({ id: "standing-0", standingSpot: 0 }),
        createNPC({ id: "standing-1", standingSpot: 2, characterSprite: 1 }),
        createNPC({ id: "standing-2", standingSpot: 4, characterSprite: 2 }),
      ];
      render(<StandingArea {...defaultProps} standingNPCs={npcs} />);

      expect(screen.getByTestId("standing-npc-standing-0")).toBeInTheDocument();
      expect(screen.getByTestId("standing-npc-standing-1")).toBeInTheDocument();
      expect(screen.getByTestId("standing-npc-standing-2")).toBeInTheDocument();
    });

    it("displays 'Aisle' label", () => {
      const npcs: StandingNPC[] = [createNPC()];
      render(<StandingArea {...defaultProps} standingNPCs={npcs} isPlayerSeated={false} />);

      expect(screen.getByText("Aisle")).toBeInTheDocument();
    });

    it("renders all 6 standing spots", () => {
      const npcs: StandingNPC[] = [createNPC()];
      render(<StandingArea {...defaultProps} standingNPCs={npcs} isPlayerSeated={false} />);

      for (let i = 0; i < 6; i++) {
        expect(screen.getByTestId(`standing-spot-${i}`)).toBeInTheDocument();
      }
    });

    it("displays player when not seated", () => {
      render(<StandingArea {...defaultProps} isPlayerSeated={false} playerStandingSpot={2} />);

      expect(screen.getByTestId("player-standing")).toBeInTheDocument();
    });

    it("does not display player when seated", () => {
      render(<StandingArea {...defaultProps} isPlayerSeated={true} playerStandingSpot={2} />);

      expect(screen.queryByTestId("player-standing")).not.toBeInTheDocument();
    });
  });

  describe("claim message", () => {
    it("displays claim message when provided", () => {
      render(<StandingArea {...defaultProps} lastClaimMessage="A passenger grabbed the seat!" />);

      expect(screen.getByTestId("claim-message")).toBeInTheDocument();
      expect(screen.getByText("A passenger grabbed the seat!")).toBeInTheDocument();
    });

    it("has alert role for accessibility", () => {
      render(<StandingArea {...defaultProps} lastClaimMessage="A passenger grabbed the seat!" />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("displays claim message even with standing NPCs", () => {
      const npcs: StandingNPC[] = [createNPC()];
      render(
        <StandingArea
          {...defaultProps}
          standingNPCs={npcs}
          isPlayerSeated={false}
          lastClaimMessage="A passenger grabbed the seat!"
        />
      );

      expect(screen.getByTestId("standing-area")).toBeInTheDocument();
      expect(screen.getByTestId("claim-message")).toBeInTheDocument();
    });

    it("does not show claim message when null", () => {
      const npcs: StandingNPC[] = [createNPC()];
      render(<StandingArea {...defaultProps} standingNPCs={npcs} lastClaimMessage={null} />);

      expect(screen.queryByTestId("claim-message")).not.toBeInTheDocument();
    });
  });

  describe("visual elements", () => {
    it("renders character illustration for each standing NPC", () => {
      const npcs: StandingNPC[] = [createNPC()];
      render(<StandingArea {...defaultProps} standingNPCs={npcs} />);

      const npcElement = screen.getByTestId("standing-npc-standing-0");
      // Check that it contains an SVG (character illustration)
      expect(npcElement.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("move position", () => {
    it("calls onMovePosition when clicking an empty spot", () => {
      const onMovePosition = jest.fn();
      render(
        <StandingArea
          {...defaultProps}
          isPlayerSeated={false}
          playerStandingSpot={0}
          onMovePosition={onMovePosition}
          actionsRemaining={2}
        />
      );

      // Click on an empty spot (spot 1)
      fireEvent.click(screen.getByTestId("standing-spot-1"));

      expect(onMovePosition).toHaveBeenCalledWith(1);
    });

    it("does not call onMovePosition when no actions remaining", () => {
      const onMovePosition = jest.fn();
      render(
        <StandingArea
          {...defaultProps}
          isPlayerSeated={false}
          playerStandingSpot={0}
          onMovePosition={onMovePosition}
          actionsRemaining={0}
        />
      );

      // Click on an empty spot (spot 1)
      fireEvent.click(screen.getByTestId("standing-spot-1"));

      expect(onMovePosition).not.toHaveBeenCalled();
    });
  });
});
