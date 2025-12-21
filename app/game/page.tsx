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
import { PlayerStatus } from "@/components/game/PlayerStatus";
import { NextStationButton } from "@/components/game/NextStationButton";
import { GameEndModal } from "@/components/game/GameEndModal";
import { StandingArea } from "@/components/game/StandingArea";

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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">Invalid game parameters. Please select stations first.</p>
      </div>
    );
  }

  const isGameOver = gameState.gameStatus !== "playing";

  return (
    <>
      <main className="flex min-h-screen flex-col items-center gap-6 p-8">
        <GameHeader
          currentStation={gameState.currentStation}
          playerDestination={gameState.playerDestination}
        />

        <JourneyProgress
          stations={STATIONS}
          currentStation={gameState.currentStation}
          destination={gameState.playerDestination}
          boardingStation={gameState.playerBoardingStation}
          isAnimating={isAnimating}
        />

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
        />

        <StandingArea
          standingNPCs={gameState.standingNPCs}
          lastClaimMessage={gameState.lastClaimMessage}
          transitionState={transitionState}
        />

        <PlayerStatus isSeated={gameState.playerSeated} />

        {!isGameOver && (
          <NextStationButton
            currentStation={gameState.currentStation}
            onAdvance={handleAdvanceStation}
            disabled={isAnimating}
          />
        )}
      </main>

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
    </>
  );
}
