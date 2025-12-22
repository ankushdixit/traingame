"use client";

/**
 * GrabPhaseOverlay - Lightweight overlay shown during grab competition
 *
 * Features:
 * - Semi-transparent overlay with timer bar
 * - "SEAT AVAILABLE! TAP TO GRAB!" message
 * - Timer counts down from 2 seconds
 * - Seats pulse/flash in-place (handled by Seat component)
 */

import { GRAB_WINDOW_MS } from "@/lib/constants";

interface GrabPhaseOverlayProps {
  isActive: boolean;
  timeRemaining: number;
  openSeatsCount: number;
  playerTapped: boolean;
}

export function GrabPhaseOverlay({
  isActive,
  timeRemaining,
  openSeatsCount,
  playerTapped,
}: GrabPhaseOverlayProps) {
  if (!isActive) return null;

  const progress = (timeRemaining / GRAB_WINDOW_MS) * 100;
  const isUrgent = timeRemaining < 500;

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none flex flex-col items-center justify-start pt-20"
      data-testid="grab-phase-overlay"
    >
      {/* Timer bar at top */}
      <div className="w-full max-w-md px-4 mb-4">
        <div className="bg-stone-800/80 rounded-full p-1 backdrop-blur-sm">
          <div
            className={`h-2 rounded-full transition-all duration-100 ${
              isUrgent ? "bg-red-500" : "bg-emerald-400"
            }`}
            style={{ width: `${progress}%` }}
            data-testid="grab-timer-bar"
          />
        </div>
      </div>

      {/* Message */}
      <div
        className={`bg-stone-900/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-2xl border-2 ${
          isUrgent ? "border-red-500 animate-pulse" : "border-emerald-400"
        }`}
      >
        {playerTapped ? (
          <div className="text-center">
            <p className="text-emerald-400 font-bold text-lg">GRABBING...</p>
            <p className="text-stone-300 text-sm mt-1">Wait for result!</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-white font-bold text-lg animate-pulse">
              {openSeatsCount > 1 ? `${openSeatsCount} SEATS AVAILABLE!` : "SEAT AVAILABLE!"}
            </p>
            <p className="text-emerald-400 font-medium text-sm mt-1">TAP THE SEAT TO GRAB!</p>
            <p className="text-stone-400 text-xs mt-2">
              {Math.ceil(timeRemaining / 1000)}s remaining
            </p>
          </div>
        )}
      </div>

      {/* Hint about position */}
      {!playerTapped && (
        <p className="text-white/70 text-xs mt-3 bg-stone-900/70 px-3 py-1 rounded-full">
          Adjacent position = faster grab
        </p>
      )}
    </div>
  );
}
