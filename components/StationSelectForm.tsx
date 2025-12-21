"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { STATIONS, getDestinationOptions, DEFAULT_DIFFICULTY } from "@/lib/constants";
import type { StationSelection, Difficulty } from "@/lib/types";
import { DifficultySelector } from "./DifficultySelector";

const DIFFICULTY_STORAGE_KEY = "lastDifficulty";

function getStoredDifficulty(): Difficulty {
  if (typeof window === "undefined") return DEFAULT_DIFFICULTY;
  const stored = sessionStorage.getItem(DIFFICULTY_STORAGE_KEY);
  if (stored && ["easy", "normal", "rush"].includes(stored)) {
    return stored as Difficulty;
  }
  return DEFAULT_DIFFICULTY;
}

export default function StationSelectForm() {
  const router = useRouter();
  const [selection, setSelection] = useState<StationSelection>({
    boardingStation: null,
    destination: null,
  });
  const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load last used difficulty from sessionStorage after hydration
  useEffect(() => {
    setDifficulty(getStoredDifficulty());
    setIsHydrated(true);
  }, []);

  // Save difficulty to sessionStorage when it changes
  useEffect(() => {
    if (isHydrated) {
      sessionStorage.setItem(DIFFICULTY_STORAGE_KEY, difficulty);
    }
  }, [difficulty, isHydrated]);

  const boardingOptions = STATIONS.slice(0, -1); // All stations except Dadar
  const destinationOptions =
    selection.boardingStation !== null ? getDestinationOptions(selection.boardingStation) : [];

  const isValid = selection.boardingStation !== null && selection.destination !== null;

  const handleBoardingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const boardingIndex = value === "" ? null : parseInt(value, 10);

    setSelection({
      boardingStation: boardingIndex,
      destination: null, // Reset destination when boarding changes
    });
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const destinationIndex = value === "" ? null : parseInt(value, 10);

    setSelection((prev) => ({
      ...prev,
      destination: destinationIndex,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      router.push(
        `/game?boarding=${selection.boardingStation}&destination=${selection.destination}&difficulty=${difficulty}`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="boarding" className="text-sm font-medium">
          Board at
        </label>
        <select
          id="boarding"
          value={selection.boardingStation ?? ""}
          onChange={handleBoardingChange}
          className="rounded-md border border-gray-300 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select station...</option>
          {boardingOptions.map((station, index) => (
            <option key={station} value={index}>
              {station}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="destination" className="text-sm font-medium">
          Get off at
        </label>
        <select
          id="destination"
          value={selection.destination ?? ""}
          onChange={handleDestinationChange}
          disabled={selection.boardingStation === null}
          className="rounded-md border border-gray-300 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          <option value="">Select station...</option>
          {destinationOptions.map((stationIndex) => (
            <option key={stationIndex} value={stationIndex}>
              {STATIONS[stationIndex]}
            </option>
          ))}
        </select>
      </div>

      <DifficultySelector value={difficulty} onChange={setDifficulty} />

      <button
        type="submit"
        disabled={!isValid}
        className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        Start Game
      </button>
    </form>
  );
}
