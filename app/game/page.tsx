"use client";

/**
 * Game page - main game UI with compartment view
 *
 * New game flow:
 * 1. Action Phase: Player takes 0-2 actions (Ask, Watch, Move)
 * 2. Click "Next Station"
 * 3. Travel animation with sounds
 * 4. NPCs exit → seats open
 * 5. Grab competition phase (if seats opened)
 * 6. Resolution: Winner takes seat or continue
 * 7. Check win/lose conditions
 */

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState, useCallback, useRef } from "react";
import {
  generateInitialState,
  advanceStation,
  askDestination,
  watchSeat,
  movePosition,
  playerGrabsSeat,
  npcGrabsSeat,
  fillEmptySeats,
  StationAdvanceResult,
} from "@/lib/gameLogic";
import { GameState, Difficulty, Line } from "@/lib/types";
import { getStations, DEFAULT_DIFFICULTY, DEFAULT_LINE } from "@/lib/constants";
import { useTransitionController, TOTAL_ANIMATION_DURATION } from "@/lib/useTransitionController";
import { useSound } from "@/contexts/SoundContext";
import { useGrabTimer } from "@/hooks/useGrabTimer";
import { GrabResult } from "@/lib/grabCompetition";
import { GameHeader } from "@/components/game/GameHeader";
import { JourneyProgress } from "@/components/game/JourneyProgress";
import { Compartment } from "@/components/game/Compartment";
import { NextStationButton } from "@/components/game/NextStationButton";
import { GameEndModal } from "@/components/game/GameEndModal";
import { StandingArea } from "@/components/game/StandingArea";
import { GameStatusBar } from "@/components/game/GameStatusBar";
import { ActionBar } from "@/components/game/ActionBar";
import { GrabPhaseOverlay } from "@/components/game/GrabPhaseOverlay";

// eslint-disable-next-line complexity, max-lines-per-function
export default function GamePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialState: GameState | null = useMemo(() => {
    const boardingParam = searchParams.get("boarding");
    const destinationParam = searchParams.get("destination");
    const difficultyParam = searchParams.get("difficulty");
    const lineParam = searchParams.get("line");

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

    // Validate line parameter
    const validLines: Line[] = ["short", "full"];
    const line: Line =
      lineParam && validLines.includes(lineParam as Line) ? (lineParam as Line) : DEFAULT_LINE;

    return generateInitialState(boarding, destination, difficulty, line);
  }, [searchParams]);

  const [gameState, setGameState] = useState<GameState | null>(initialState);
  const [targetStation, setTargetStation] = useState<number | null>(null);
  const { playSound } = useSound();
  const {
    state: transitionState,
    startTransition,
    isAnimating,
    triggerPlayerClaimSuccess,
  } = useTransitionController();

  // Refs for pending state during animation
  const pendingAdvanceResultRef = useRef<StationAdvanceResult | null>(null);

  // Ref to track latest game state for use in callbacks
  const gameStateRef = useRef<GameState | null>(gameState);
  gameStateRef.current = gameState;

  // Handle grab competition results
  const handleGrabComplete = useCallback(
    (results: GrabResult[]) => {
      // Use ref to get the latest game state (not stale closure state)
      const currentState = gameStateRef.current;
      if (!currentState) return;

      let updatedState = currentState;

      for (const result of results) {
        if (result.isPlayerWinner) {
          // Player wins - instant victory!
          playSound("seatClaim");
          updatedState = playerGrabsSeat(updatedState, result.seatId);
          triggerPlayerClaimSuccess();
          break;
        } else if (result.winnerId) {
          // NPC wins
          playSound("npcGrab");
          updatedState = npcGrabsSeat(updatedState, result.winnerId, result.seatId);
        }
      }

      // After grab phase, fill any remaining empty seats with new NPCs
      // This ensures no seats stay empty (realistic for Mumbai local!)
      updatedState = fillEmptySeats(updatedState);

      setGameState(updatedState);
    },
    [playSound, triggerPlayerClaimSuccess]
  );

  // Grab timer hook
  const grabTimer = useGrabTimer({
    playerPosition: gameState?.playerStandingSpot ?? 0,
    playerWatchedSeatId: gameState?.playerWatchedSeatId ?? null,
    standingNPCs: gameState?.standingNPCs ?? [],
    onGrabComplete: handleGrabComplete,
  });

  // Action handlers
  const handleAskDestination = useCallback(
    (seatId: number) => {
      if (!gameState || isAnimating || grabTimer.isActive) return;

      playSound("seatClick");
      setGameState(askDestination(gameState, seatId));
    },
    [gameState, isAnimating, grabTimer.isActive, playSound]
  );

  const handleWatchSeat = useCallback(
    (seatId: number) => {
      if (!gameState || isAnimating || grabTimer.isActive) return;

      playSound("seatClick");
      setGameState(watchSeat(gameState, seatId));
    },
    [gameState, isAnimating, grabTimer.isActive, playSound]
  );

  const handleMovePosition = useCallback(
    (newSpot: number) => {
      if (!gameState || isAnimating || grabTimer.isActive) return;

      playSound("seatClick");
      setGameState(movePosition(gameState, newSpot));
    },
    [gameState, isAnimating, grabTimer.isActive, playSound]
  );

  // Grab seat during grab phase
  const handleGrabSeat = useCallback(
    (seatId: number) => {
      if (!grabTimer.isActive) return;

      playSound("seatClick");
      grabTimer.playerTap(seatId);
    },
    [grabTimer, playSound]
  );

  // Advance to next station
  const handleAdvanceStation = useCallback(() => {
    if (!gameState || isAnimating || grabTimer.isActive) return;

    // Calculate the new state
    const advanceResult = advanceStation(gameState);
    pendingAdvanceResultRef.current = advanceResult;

    // Set target station for progress bar animation
    const nextStation = gameState.currentStation + 1;
    setTargetStation(nextStation);

    // Play train moving sound
    playSound("trainMoving");

    // Start animation (no NPC claiming in new system - that's handled by grab phase)
    startTransition(advanceResult.departingNpcIds, null, null);

    // Sound timeline (within traveling phase: 0-1800ms)
    setTimeout(() => playSound("trainStopping"), 800);
    setTimeout(() => playSound("announcement"), 1200);
    setTimeout(() => playSound("doorClose"), 1600);

    // After animation completes, apply state and maybe start grab phase
    setTimeout(() => {
      const result = pendingAdvanceResultRef.current;
      if (!result) return;

      // Apply the new state
      setGameState(result.state);
      setTargetStation(null);
      pendingAdvanceResultRef.current = null;

      // Get ALL empty seats (not just newly opened ones)
      // This allows grabbing seats that remained empty from previous turns
      const allEmptySeats = result.state.seats
        .filter((seat) => seat.occupant === null)
        .map((seat) => seat.id);

      // If there are empty seats and game still playing, start grab competition
      if (allEmptySeats.length > 0 && result.state.gameStatus === "playing") {
        // Small delay for visual feedback before grab starts
        setTimeout(() => {
          grabTimer.startGrab(allEmptySeats);
        }, 200);
      }
    }, TOTAL_ANIMATION_DURATION);
  }, [gameState, isAnimating, grabTimer, startTransition, playSound]);

  const handlePlayAgain = useCallback(() => {
    router.push("/");
  }, [router]);

  // Error state
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

      {/* Action Bar - shows actions remaining */}
      {!gameState.playerSeated && !isGameOver && (
        <div className="max-w-2xl mx-auto px-4 py-2 flex justify-center">
          <ActionBar actionsRemaining={gameState.actionsRemaining} />
        </div>
      )}

      {/* Journey Progress */}
      <div className="max-w-2xl mx-auto bg-white shadow-md">
        <JourneyProgress
          stations={getStations(gameState.line)}
          currentStation={gameState.currentStation}
          destination={gameState.playerDestination}
          boardingStation={gameState.playerBoardingStation}
          isAnimating={isAnimating}
          targetStation={targetStation ?? undefined}
        />
      </div>

      {/* Main Game Area */}
      <div className="max-w-2xl mx-auto p-4">
        <Compartment
          seats={gameState.seats}
          playerSeatId={gameState.seatId}
          isPlayerSeated={gameState.playerSeated}
          playerWatchedSeatId={gameState.playerWatchedSeatId}
          playerStandingSpot={gameState.playerStandingSpot}
          actionsRemaining={gameState.actionsRemaining}
          isGrabPhase={grabTimer.isActive}
          line={gameState.line}
          currentStation={gameState.currentStation}
          transitionState={transitionState}
          playerClaimSuccess={transitionState.playerClaimSuccess}
          onAskDestination={handleAskDestination}
          onWatchSeat={handleWatchSeat}
          onGrabSeat={handleGrabSeat}
          standingArea={
            <StandingArea
              standingNPCs={gameState.standingNPCs}
              lastClaimMessage={gameState.lastClaimMessage}
              transitionState={transitionState}
              isPlayerSeated={gameState.playerSeated}
              playerStandingSpot={gameState.playerStandingSpot}
              onMovePosition={handleMovePosition}
              actionsRemaining={gameState.actionsRemaining}
              isGrabPhase={grabTimer.isActive}
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
        {!isGameOver && !grabTimer.isActive && (
          <NextStationButton
            onAdvance={handleAdvanceStation}
            disabled={isAnimating}
            nextStationName={getStations(gameState.line)[gameState.currentStation + 1] || ""}
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

      {/* Grab Phase Overlay */}
      <GrabPhaseOverlay
        isActive={grabTimer.isActive}
        timeRemaining={grabTimer.timeRemaining}
        openSeatsCount={grabTimer.openSeats.length}
        playerTapped={grabTimer.playerTappedSeat !== null}
      />

      {/* Game End Modal */}
      {isGameOver && (
        <GameEndModal
          status={gameState.gameStatus as "won" | "lost"}
          destination={getStations(gameState.line)[gameState.playerDestination]}
          stationsStanding={gameState.currentStation - gameState.playerBoardingStation}
          totalStations={gameState.playerDestination - gameState.playerBoardingStation}
          difficulty={gameState.difficulty}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
