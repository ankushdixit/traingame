/**
 * StandingArea component - displays standing NPCs and player (if not seated)
 * Updated for new game mechanics:
 * - Player can click empty spots to move (costs 1 action)
 * - Shows which positions are adjacent to seats
 */

import { StandingNPC } from "@/lib/types";
import { TransitionState } from "@/lib/useTransitionController";
import { renderCharacter, PlayerCharacter } from "./characters";
import { getAdjacentSeats } from "@/lib/constants";

interface StandingAreaProps {
  standingNPCs: StandingNPC[];
  lastClaimMessage: string | null;
  transitionState?: TransitionState;
  isPlayerSeated: boolean;
  playerStandingSpot: number;
  onMovePosition: (newSpot: number) => void;
  actionsRemaining: number;
  isGrabPhase: boolean;
}

interface StandingSpotProps {
  index: number;
  occupant: StandingNPC | null;
  isPlayer: boolean;
  isMovingToSeat: boolean;
  isEmpty: boolean;
  canMoveTo: boolean;
  canSwapWith: boolean;
  onClick: () => void;
}

function GrabHandle() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-1 h-6 bg-stone-600 rounded" />
      <div className="w-4 h-4 rounded-full border-2 border-stone-600 bg-stone-400" />
    </div>
  );
}

// eslint-disable-next-line complexity
function StandingSpot({
  index,
  occupant,
  isPlayer,
  isMovingToSeat,
  isEmpty: _isEmpty,
  canMoveTo,
  canSwapWith,
  onClick,
}: StandingSpotProps) {
  const adjacentSeats = getAdjacentSeats(index);
  const isInteractive = canMoveTo || canSwapWith;

  return (
    <div className="flex flex-col items-center">
      {/* Handle bar */}
      <GrabHandle />

      {/* Standing spot */}
      <button
        onClick={onClick}
        disabled={!isInteractive}
        className={`
          w-16 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-all mt-1
          ${
            isPlayer
              ? "border-amber-400 bg-amber-100/50"
              : canSwapWith
                ? "border-green-400 bg-green-100/30 hover:bg-green-200/50 cursor-pointer"
                : occupant
                  ? "border-stone-400 bg-stone-200/50"
                  : canMoveTo
                    ? "border-blue-400 bg-blue-100/30 hover:bg-blue-200/50 cursor-pointer"
                    : "border-stone-300 bg-stone-100/30"
          }
          ${isMovingToSeat ? "animate-move-to-seat" : ""}
          ${isInteractive ? "hover:scale-105" : ""}
        `}
        data-testid={`standing-spot-${index}`}
        type="button"
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
          <div className="relative" data-testid={`standing-npc-${occupant.id}`}>
            <div className="w-8 h-12">{renderCharacter(occupant.characterSprite, false)}</div>
            {canSwapWith && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[7px] px-1 rounded">
                Swap
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {canMoveTo ? (
              <>
                <span className="text-blue-500 text-lg">👆</span>
                <span className="text-blue-500 text-[8px]">Move</span>
              </>
            ) : (
              <span className="text-stone-300 text-xs">#{index + 1}</span>
            )}
          </div>
        )}
      </button>

      {/* Adjacent seats indicator */}
      {isPlayer && (
        <div className="text-[8px] text-stone-500 mt-0.5">
          Near #{adjacentSeats.map((s) => s + 1).join(", #")}
        </div>
      )}
    </div>
  );
}

export function StandingArea({
  standingNPCs,
  lastClaimMessage,
  transitionState,
  isPlayerSeated,
  playerStandingSpot,
  onMovePosition,
  actionsRemaining,
  isGrabPhase,
}: StandingAreaProps) {
  // Check if an NPC is currently moving to claim a seat
  const claimingNpcId = transitionState?.claimingNpcId;
  const isClaimingPhase = transitionState?.phase === "claiming";

  // Maximum distance player can move in one action
  const MAX_MOVE_DISTANCE = 2;

  // Pre-compute whether player can interact with any spots
  const playerCanInteract = actionsRemaining > 0 && !isPlayerSeated && !isGrabPhase;

  // Helper to check if a spot is within movement range
  const isSpotInRange = (spotIndex: number) => {
    const distance = Math.abs(spotIndex - playerStandingSpot);
    return distance <= MAX_MOVE_DISTANCE && distance > 0;
  };

  // Create array of 6 standing spots
  const spots = [...Array(6)].map((_, index) => {
    const npcInSpot = standingNPCs.find((npc) => npc.standingSpot === index);
    const isPlayerHere = !isPlayerSeated && playerStandingSpot === index;
    const isMovingToSeat = isClaimingPhase && npcInSpot?.id === claimingNpcId;
    const isEmpty = !npcInSpot && !isPlayerHere;
    const canInteract = playerCanInteract && isSpotInRange(index);

    return {
      index,
      occupant: npcInSpot || null,
      isPlayer: isPlayerHere,
      isMovingToSeat,
      isEmpty,
      canMoveTo: isEmpty && canInteract,
      canSwapWith: !!npcInSpot && canInteract,
    };
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
            isEmpty={spot.isEmpty}
            canMoveTo={spot.canMoveTo}
            canSwapWith={spot.canSwapWith}
            onClick={() => {
              if (spot.canMoveTo || spot.canSwapWith) {
                onMovePosition(spot.index);
              }
            }}
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
