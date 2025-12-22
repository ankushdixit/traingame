"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getStations,
  getDestinationOptions,
  DEFAULT_DIFFICULTY,
  DEFAULT_LINE,
} from "@/lib/constants";
import type { StationSelection, Difficulty, Line } from "@/lib/types";
import { DifficultySelector } from "./DifficultySelector";
import { LineSelector } from "./LineSelector";

const DIFFICULTY_STORAGE_KEY = "lastDifficulty";
const LINE_STORAGE_KEY = "lastLine";

function getStoredDifficulty(): Difficulty {
  if (typeof window === "undefined") return DEFAULT_DIFFICULTY;
  const stored = sessionStorage.getItem(DIFFICULTY_STORAGE_KEY);
  if (stored && ["easy", "normal", "rush"].includes(stored)) {
    return stored as Difficulty;
  }
  return DEFAULT_DIFFICULTY;
}

function getStoredLine(): Line {
  if (typeof window === "undefined") return DEFAULT_LINE;
  const stored = sessionStorage.getItem(LINE_STORAGE_KEY);
  if (stored && ["short", "full"].includes(stored)) {
    return stored as Line;
  }
  return DEFAULT_LINE;
}

export default function StationSelectForm() {
  const router = useRouter();
  const [selection, setSelection] = useState<StationSelection>({
    boardingStation: null,
    destination: null,
  });
  const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY);
  const [line, setLine] = useState<Line>(DEFAULT_LINE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Get stations based on selected line
  const stations = getStations(line);

  // Load last used difficulty and line from sessionStorage after hydration
  useEffect(() => {
    setDifficulty(getStoredDifficulty());
    setLine(getStoredLine());
    setIsHydrated(true);
  }, []);

  // Save difficulty and line to sessionStorage when they change
  useEffect(() => {
    if (isHydrated) {
      sessionStorage.setItem(DIFFICULTY_STORAGE_KEY, difficulty);
    }
  }, [difficulty, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      sessionStorage.setItem(LINE_STORAGE_KEY, line);
    }
  }, [line, isHydrated]);

  // Reset station selection when line changes
  const handleLineChange = (newLine: Line) => {
    setLine(newLine);
    setSelection({ boardingStation: null, destination: null });
  };

  const boardingOptions = stations.slice(0, -1); // All stations except last
  const destinationOptions =
    selection.boardingStation !== null
      ? getDestinationOptions(selection.boardingStation, line)
      : [];

  const isValid = selection.boardingStation !== null && selection.destination !== null;
  const stopsCount =
    selection.boardingStation !== null && selection.destination !== null
      ? selection.destination - selection.boardingStation
      : 0;

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
        `/game?boarding=${selection.boardingStation}&destination=${selection.destination}&difficulty=${difficulty}&line=${line}`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Line Selection */}
      <LineSelector value={line} onChange={handleLineChange} />

      {/* Difficulty Selection */}
      <DifficultySelector value={difficulty} onChange={setDifficulty} />

      {/* Boarding Station */}
      <div className="flex flex-col gap-2">
        <label htmlFor="boarding" className="text-sm font-semibold text-stone-700">
          📍 Boarding Station
        </label>
        <select
          id="boarding"
          value={selection.boardingStation ?? ""}
          onChange={handleBoardingChange}
          className="w-full p-3 rounded-xl border-2 border-stone-200 focus:border-amber-400 focus:ring-0 bg-white transition-all text-stone-800"
        >
          <option value="">Select station...</option>
          {boardingOptions.map((station, index) => (
            <option key={station} value={index}>
              {station}
            </option>
          ))}
        </select>
      </div>

      {/* Destination Station */}
      <div className="flex flex-col gap-2">
        <label htmlFor="destination" className="text-sm font-semibold text-stone-700">
          🚩 Destination
        </label>
        <select
          id="destination"
          value={selection.destination ?? ""}
          onChange={handleDestinationChange}
          disabled={selection.boardingStation === null}
          className="w-full p-3 rounded-xl border-2 border-stone-200 focus:border-amber-400 focus:ring-0 bg-white transition-all text-stone-800 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400"
        >
          <option value="">Select station...</option>
          {destinationOptions.map((stationIndex) => (
            <option key={stationIndex} value={stationIndex}>
              {stations[stationIndex]}
            </option>
          ))}
        </select>
      </div>

      {/* Journey Preview */}
      {isValid && (
        <div className="bg-stone-100 rounded-xl p-4">
          <div className="text-sm text-stone-600 text-center">
            Your journey:{" "}
            <span className="font-bold text-stone-800">{stations[selection.boardingStation!]}</span>
            <span className="mx-2">→</span>
            <span className="font-bold text-stone-800">{stations[selection.destination!]}</span>
            <span className="text-stone-500 ml-2">
              ({stopsCount} {stopsCount === 1 ? "stop" : "stops"})
            </span>
          </div>
        </div>
      )}

      {/* Start Button */}
      <button
        type="submit"
        disabled={!isValid}
        className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:from-stone-300 disabled:to-stone-400"
      >
        🚃 Board Train
      </button>
    </form>
  );
}
