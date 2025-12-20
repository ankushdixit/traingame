"use client";

/**
 * Game page - main game UI with compartment view
 */

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useCallback } from "react";
import {
  generateInitialState,
  revealDestination,
  claimSeat,
  advanceStation,
} from "@/lib/gameLogic";
import { GameState } from "@/lib/types";
import { GameHeader } from "@/components/game/GameHeader";
import { Compartment } from "@/components/game/Compartment";
import { PlayerStatus } from "@/components/game/PlayerStatus";
import { NextStationButton } from "@/components/game/NextStationButton";

export default function GamePage() {
  const searchParams = useSearchParams();

  const initialState: GameState | null = useMemo(() => {
    const boardingParam = searchParams.get("boarding");
    const destinationParam = searchParams.get("destination");

    if (boardingParam === null || destinationParam === null) {
      return null;
    }

    const boarding = parseInt(boardingParam, 10);
    const destination = parseInt(destinationParam, 10);

    if (isNaN(boarding) || isNaN(destination)) {
      return null;
    }

    return generateInitialState(boarding, destination);
  }, [searchParams]);

  const [gameState, setGameState] = useState<GameState | null>(initialState);

  const handleRevealDestination = useCallback((seatId: number) => {
    setGameState((prevState) => {
      if (!prevState) return null;
      return revealDestination(prevState, seatId);
    });
  }, []);

  const handleClaimSeat = useCallback((seatId: number) => {
    setGameState((prevState) => {
      if (!prevState) return null;
      return claimSeat(prevState, seatId);
    });
  }, []);

  const handleAdvanceStation = useCallback(() => {
    setGameState((prevState) => {
      if (!prevState) return null;
      return advanceStation(prevState);
    });
  }, []);

  if (gameState === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">Invalid game parameters. Please select stations first.</p>
      </div>
    );
  }

  const isGameOver = gameState.gameStatus !== "playing";

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-8">
      <GameHeader
        currentStation={gameState.currentStation}
        playerDestination={gameState.playerDestination}
      />

      <Compartment
        seats={gameState.seats}
        playerSeatId={gameState.seatId}
        isPlayerSeated={gameState.playerSeated}
        onRevealDestination={handleRevealDestination}
        onClaimSeat={handleClaimSeat}
      />

      <PlayerStatus isSeated={gameState.playerSeated} />

      {isGameOver ? (
        <div
          className={`rounded-lg p-6 text-center ${
            gameState.gameStatus === "won"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
          data-testid="game-result"
        >
          <p className="text-xl font-bold" data-testid="game-result-message">
            {gameState.gameStatus === "won" ? "You Won!" : "You Lost!"}
          </p>
          <p className="mt-2 text-sm">
            {gameState.gameStatus === "won"
              ? "Congratulations! You got a seat before reaching your destination."
              : "You arrived at your destination without a seat."}
          </p>
        </div>
      ) : (
        <NextStationButton
          currentStation={gameState.currentStation}
          onAdvance={handleAdvanceStation}
          disabled={false}
        />
      )}
    </main>
  );
}
