/**
 * StandingArea component - displays standing NPCs who compete for seats
 * Uses character illustrations with standing posture
 */

import { StandingNPC } from "@/lib/types";
import { TransitionState } from "@/lib/useTransitionController";
import { renderCharacter } from "./characters";

interface StandingAreaProps {
  standingNPCs: StandingNPC[];
  lastClaimMessage: string | null;
  transitionState?: TransitionState;
}

export function StandingArea({
  standingNPCs,
  lastClaimMessage,
  transitionState,
}: StandingAreaProps) {
  if (standingNPCs.length === 0 && !lastClaimMessage) {
    return null;
  }

  // Check if an NPC is currently moving to claim a seat
  const claimingNpcId = transitionState?.claimingNpcId;
  const isClaimingPhase = transitionState?.phase === "claiming";

  return (
    <div className="flex flex-col items-center gap-2" data-testid="standing-area">
      <div className="text-sm text-gray-600">Standing Passengers</div>
      <div className="flex justify-center gap-3">
        {standingNPCs.map((npc) => {
          const isMovingToSeat = isClaimingPhase && npc.id === claimingNpcId;

          return (
            <div
              key={npc.id}
              className={`flex h-16 w-10 items-center justify-center rounded-lg bg-orange-100 border-2 border-orange-300 p-1 ${
                isMovingToSeat ? "animate-move-to-seat" : ""
              }`}
              data-testid={`standing-npc-${npc.id}`}
              role="img"
              aria-label={`Standing passenger ${npc.id}`}
            >
              {renderCharacter(npc.characterSprite, false)}
            </div>
          );
        })}
        {standingNPCs.length === 0 && !lastClaimMessage && (
          <span className="text-sm text-gray-500">None</span>
        )}
      </div>
      {lastClaimMessage && (
        <div
          className="mt-2 rounded-md bg-red-100 px-4 py-2 text-sm text-red-700 border border-red-300"
          data-testid="claim-message"
          role="alert"
        >
          {lastClaimMessage}
        </div>
      )}
    </div>
  );
}
