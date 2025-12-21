"use client";

/**
 * LoseScene component - sympathetic visuals for lose screen
 */

import { GameStats } from "./GameStats";
import { PlayerCharacterSad } from "./characters/PlayerCharacterSad";
import { Difficulty } from "@/lib/types";

interface LoseSceneProps {
  destination: string;
  stationsStanding: number;
  totalStations: number;
  difficulty: Difficulty;
}

export function LoseScene({
  destination,
  stationsStanding,
  totalStations,
  difficulty,
}: LoseSceneProps) {
  const closeMessage =
    stationsStanding >= totalStations - 1
      ? "So close! Just one more station..."
      : `You survived ${stationsStanding} station${stationsStanding !== 1 ? "s" : ""} standing!`;

  return (
    <div className="text-center" data-testid="lose-scene">
      {/* Disappointed character with crowded background suggestion */}
      <div className="relative mx-auto mb-4 h-32 w-32" data-testid="lose-character">
        {/* Background crowd silhouettes */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="absolute left-0 top-2 h-20 w-8 rounded-full bg-gray-500" />
          <div className="absolute right-0 top-4 h-18 w-7 rounded-full bg-gray-500" />
          <div className="absolute -left-2 bottom-0 h-16 w-6 rounded-full bg-gray-400" />
          <div className="absolute -right-2 bottom-2 h-16 w-6 rounded-full bg-gray-400" />
        </div>
        <PlayerCharacterSad />
      </div>

      <h1
        id="game-end-title"
        className="mb-4 text-4xl font-bold text-red-600"
        data-testid="game-end-title"
      >
        You Lost!
      </h1>

      <p className="mb-2 text-lg text-gray-700" data-testid="game-end-message">
        You arrived at {destination} still standing!
      </p>

      <p className="mb-4 text-md text-gray-500" data-testid="close-message">
        {closeMessage}
      </p>

      <GameStats stationsStanding={stationsStanding} difficulty={difficulty} isWin={false} />
    </div>
  );
}
