"use client";

/**
 * Game page - main game UI with compartment view
 */

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { generateInitialState } from "@/lib/gameLogic";
import { GameState } from "@/lib/types";
import { GameHeader } from "@/components/game/GameHeader";
import { Compartment } from "@/components/game/Compartment";
import { PlayerStatus } from "@/components/game/PlayerStatus";

export default function GamePage() {
  const searchParams = useSearchParams();

  const gameState: GameState | null = useMemo(() => {
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

  if (gameState === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">Invalid game parameters. Please select stations first.</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-8">
      <GameHeader
        currentStation={gameState.currentStation}
        playerDestination={gameState.playerDestination}
      />

      <Compartment seats={gameState.seats} playerSeatId={gameState.seatId} />

      <PlayerStatus isSeated={gameState.playerSeated} />
    </main>
  );
}
