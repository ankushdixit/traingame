/**
 * StandingArea component - displays standing NPCs and player (if not seated)
 * Matches single-shot design with 6 standing spots, grab handles, and "Aisle" label
 */

import { StandingNPC } from "@/lib/types";
import { TransitionState } from "@/lib/useTransitionController";
import { renderCharacter, PlayerCharacter } from "./characters";

interface StandingAreaProps {
  standingNPCs: StandingNPC[];
  lastClaimMessage: string | null;
  transitionState?: TransitionState;
  isPlayerSeated: boolean;
  /** Player's standing spot index (0-5) when not seated */
  playerStandingSpot?: number;
}

interface StandingSpotProps {
  index: number;
  occupant: StandingNPC | null;
  isPlayer: boolean;
  isMovingToSeat: boolean;
}

function GrabHandle() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-1 h-6 bg-stone-600 rounded" />
      <div className="w-4 h-4 rounded-full border-2 border-stone-600 bg-stone-400" />
    </div>
  );
}

function StandingSpot({ index, occupant, isPlayer, isMovingToSeat }: StandingSpotProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Handle bar */}
      <GrabHandle />

      {/* Standing spot */}
      <div
        className={`
          w-16 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-all mt-1
          ${
            isPlayer
              ? "border-amber-400 bg-amber-100/50"
              : occupant
                ? "border-stone-400 bg-stone-200/50"
                : "border-stone-300 bg-stone-100/30"
          }
          ${isMovingToSeat ? "animate-move-to-seat" : ""}
        `}
        data-testid={`standing-spot-${index}`}
      >
        {isPlayer ? (
          <div className="relative" data-testid="player-standing">
            <div className="w-9 h-14">
              <PlayerCharacter isSeated={false} />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full flex items-center justify-center text-[8px] border border-amber-500">
              ★
            </div>
          </div>
        ) : occupant ? (
          <div data-testid={`standing-npc-${occupant.id}`}>
            <div className="w-8 h-12">{renderCharacter(occupant.characterSprite, false)}</div>
          </div>
        ) : (
          <span className="text-stone-300 text-xs">#{index + 1}</span>
        )}
      </div>
    </div>
  );
}

export function StandingArea({
  standingNPCs,
  lastClaimMessage,
  transitionState,
  isPlayerSeated,
  playerStandingSpot = 0,
}: StandingAreaProps) {
  // Check if an NPC is currently moving to claim a seat
  const claimingNpcId = transitionState?.claimingNpcId;
  const isClaimingPhase = transitionState?.phase === "claiming";

  // Create array of 6 standing spots
  const spots = [...Array(6)].map((_, index) => {
    const npcInSpot = standingNPCs.find((npc) => npc.standingSpot === index);
    const isPlayerHere = !isPlayerSeated && playerStandingSpot === index;
    const isMovingToSeat = isClaimingPhase && npcInSpot?.id === claimingNpcId;
    return { index, occupant: npcInSpot || null, isPlayer: isPlayerHere, isMovingToSeat };
  });

  return (
    <div
      className="bg-gradient-to-b from-stone-300 to-stone-400 rounded-lg p-3 border-2 border-stone-500"
      data-testid="standing-area"
    >
      <div className="text-center text-stone-600 text-xs mb-1 font-medium uppercase tracking-wide">
        Aisle
      </div>
      <div className="grid grid-cols-6 gap-2 justify-items-center">
        {spots.map((spot) => (
          <StandingSpot
            key={spot.index}
            index={spot.index}
            occupant={spot.occupant}
            isPlayer={spot.isPlayer}
            isMovingToSeat={spot.isMovingToSeat}
          />
        ))}
      </div>

      {/* Claim message toast */}
      {lastClaimMessage && (
        <div
          className="mt-3 rounded-lg bg-amber-100 px-4 py-2 text-sm text-amber-800 border border-amber-200 text-center font-medium"
          data-testid="claim-message"
          role="alert"
        >
          {lastClaimMessage}
        </div>
      )}
    </div>
  );
}
