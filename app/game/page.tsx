"use client";

/**
 * Game page - main game UI with compartment view
 */

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState, useCallback, useRef } from "react";
import {
  generateInitialState,
  revealDestination,
  claimSeat,
  advanceStation,
  setHoveredSeat,
  previewStationAdvance,
} from "@/lib/gameLogic";
import { GameState, Difficulty } from "@/lib/types";
import { STATIONS, DEFAULT_DIFFICULTY } from "@/lib/constants";
import { useTransitionController } from "@/lib/useTransitionController";
import { useSound } from "@/contexts/SoundContext";
import { GameHeader } from "@/components/game/GameHeader";
import { JourneyProgress } from "@/components/game/JourneyProgress";
import { Compartment } from "@/components/game/Compartment";
import { NextStationButton } from "@/components/game/NextStationButton";
import { GameEndModal } from "@/components/game/GameEndModal";
import { StandingArea } from "@/components/game/StandingArea";
import { GameStatusBar } from "@/components/game/GameStatusBar";

// Animation phase total duration in ms (must match useTransitionController phases)
// shaking(2500) + departing(400) + claiming(200) + settling(100) = 3200ms
const ANIMATION_TOTAL_DURATION = 3200;

export default function GamePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialState: GameState | null = useMemo(() => {
    const boardingParam = searchParams.get("boarding");
    const destinationParam = searchParams.get("destination");
    const difficultyParam = searchParams.get("difficulty");

    if (boardingParam === null || destinationParam === null) {
      return null;
    }

    const boarding = parseInt(boardingParam, 10);
    const destination = parseInt(destinationParam, 10);

    if (isNaN(boarding) || isNaN(destination)) {
      return null;
    }

    // Validate difficulty parameter
    const validDifficulties: Difficulty[] = ["easy", "normal", "rush"];
    const difficulty: Difficulty =
      difficultyParam && validDifficulties.includes(difficultyParam as Difficulty)
        ? (difficultyParam as Difficulty)
        : DEFAULT_DIFFICULTY;

    return generateInitialState(boarding, destination, difficulty);
  }, [searchParams]);

  const [gameState, setGameState] = useState<GameState | null>(initialState);
  const { playSound } = useSound();
  const {
    state: transitionState,
    startTransition,
    queueInteraction,
    isAnimating,
    triggerPlayerClaimSuccess,
  } = useTransitionController();

  // Ref to store pending game state update during animation
  const pendingStateRef = useRef<GameState | null>(null);

  const handleRevealDestination = useCallback(
    (seatId: number) => {
      playSound("seatClick");
      queueInteraction(() => {
        setGameState((prevState) => {
          if (!prevState) return null;
          return revealDestination(prevState, seatId);
        });
      });
    },
    [queueInteraction, playSound]
  );

  const handleClaimSeat = useCallback(
    (seatId: number) => {
      playSound("seatClaim");
      queueInteraction(() => {
        setGameState((prevState) => {
          if (!prevState) return null;
          return claimSeat(prevState, seatId);
        });
        // Trigger success animation
        triggerPlayerClaimSuccess();
      });
    },
    [queueInteraction, triggerPlayerClaimSuccess, playSound]
  );

  const handleAdvanceStation = useCallback(() => {
    if (!gameState || isAnimating) return;

    // Play train moving sound (start of journey)
    playSound("trainMoving");

    // Preview what will happen for animation
    const preview = previewStationAdvance(gameState);

    // Start the animation
    startTransition(preview.departingNpcIds, preview.claimingNpcId, preview.claimedSeatId);

    // Calculate the new state
    const newState = advanceStation(gameState);
    pendingStateRef.current = newState;

    // Sound timeline (all within shaking phase: 0-2500ms)
    // Train braking sounds
    setTimeout(() => {
      playSound("trainStopping");
    }, 300);

    // Station announcement
    setTimeout(() => {
      playSound("announcement");
    }, 1000);

    // Doors open/close (near end of journey)
    setTimeout(() => {
      playSound("doorClose");
    }, 1600);

    // NPC grab sound during claiming phase (after departing phase)
    // shaking(2500) + departing(400) = 2900ms
    setTimeout(() => {
      if (preview.claimingNpcId !== null) {
        playSound("npcGrab");
      }
    }, 2900);

    // Update game state after all animations complete
    setTimeout(() => {
      if (pendingStateRef.current) {
        setGameState(pendingStateRef.current);
        pendingStateRef.current = null;
      }
    }, ANIMATION_TOTAL_DURATION);
  }, [gameState, isAnimating, startTransition, playSound]);

  const handleHoverNear = useCallback(
    (seatId: number) => {
      queueInteraction(() => {
        setGameState((prevState) => {
          if (!prevState) return null;
          return setHoveredSeat(prevState, seatId);
        });
      });
    },
    [queueInteraction]
  );

  const handlePlayAgain = useCallback(() => {
    router.push("/");
  }, [router]);

  if (gameState === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-100 to-stone-200 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <p className="text-red-600 font-medium">Invalid game parameters.</p>
          <p className="text-stone-500 text-sm mt-2">Please select stations first.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-amber-400 text-white rounded-lg font-medium hover:bg-amber-500 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isGameOver = gameState.gameStatus !== "playing";
  const emptySeatsCount = gameState.seats.filter((s) => s.occupant === null).length;
  const stopsRemaining = gameState.playerDestination - gameState.currentStation;

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-stone-200 relative">
      {/* Header Bar */}
      <GameHeader
        currentStation={gameState.currentStation}
        playerDestination={gameState.playerDestination}
        playerSeated={gameState.playerSeated}
        difficulty={gameState.difficulty}
      />

      {/* Journey Progress */}
      <div className="max-w-2xl mx-auto bg-white shadow-md">
        <JourneyProgress
          stations={STATIONS}
          currentStation={gameState.currentStation}
          destination={gameState.playerDestination}
          boardingStation={gameState.playerBoardingStation}
          isAnimating={isAnimating}
        />
      </div>

      {/* Main Game Area */}
      <div className="max-w-2xl mx-auto p-4">
        <Compartment
          seats={gameState.seats}
          playerSeatId={gameState.seatId}
          isPlayerSeated={gameState.playerSeated}
          hoveredSeatId={gameState.hoveredSeatId}
          currentStation={gameState.currentStation}
          transitionState={transitionState}
          playerClaimSuccess={transitionState.playerClaimSuccess}
          onRevealDestination={handleRevealDestination}
          onClaimSeat={handleClaimSeat}
          onHoverNear={handleHoverNear}
          standingArea={
            <StandingArea
              standingNPCs={gameState.standingNPCs}
              lastClaimMessage={gameState.lastClaimMessage}
              transitionState={transitionState}
              isPlayerSeated={gameState.playerSeated}
              playerStandingSpot={gameState.playerStandingSpot}
            />
          }
          statusBar={
            <GameStatusBar
              emptySeatsCount={emptySeatsCount}
              standingNPCsCount={gameState.standingNPCs.length}
              stopsRemaining={stopsRemaining}
            />
          }
        />

        {/* Next Station Button */}
        {!isGameOver && (
          <NextStationButton
            currentStation={gameState.currentStation}
            onAdvance={handleAdvanceStation}
            disabled={isAnimating}
          />
        )}

        {/* Back to Menu */}
        <button
          onClick={handlePlayAgain}
          className="mt-3 w-full py-2 text-stone-500 hover:text-stone-700 font-medium transition-colors"
        >
          ← Back to Menu
        </button>
      </div>

      {/* Game End Modal */}
      {isGameOver && (
        <GameEndModal
          status={gameState.gameStatus as "won" | "lost"}
          destination={STATIONS[gameState.playerDestination]}
          stationsStanding={gameState.currentStation - gameState.playerBoardingStation}
          totalStations={gameState.playerDestination - gameState.playerBoardingStation}
          difficulty={gameState.difficulty}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
