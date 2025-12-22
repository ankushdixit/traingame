"use client";

/**
 * useGrabTimer - Custom hook for managing grab competition timing
 *
 * Handles:
 * - Starting/stopping the grab window timer
 * - Recording player tap time
 * - Calculating winner when timer ends
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { StandingNPC } from "@/lib/types";
import { GRAB_WINDOW_MS } from "@/lib/constants";
import { GrabResult, resolveMultipleSeatCompetitions } from "@/lib/grabCompetition";

export interface GrabTimerState {
  isActive: boolean;
  openSeats: number[];
  timeRemaining: number;
  playerTappedSeat: number | null;
  playerTapTime: number | null;
}

interface UseGrabTimerOptions {
  playerPosition: number;
  playerWatchedSeatId: number | null;
  standingNPCs: StandingNPC[];
  onGrabComplete: (results: GrabResult[]) => void;
}

export function useGrabTimer({
  playerPosition,
  playerWatchedSeatId,
  standingNPCs,
  onGrabComplete,
}: UseGrabTimerOptions) {
  const [state, setState] = useState<GrabTimerState>({
    isActive: false,
    openSeats: [],
    timeRemaining: GRAB_WINDOW_MS,
    playerTappedSeat: null,
    playerTapTime: null,
  });

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  // Ref to always have access to latest endGrab function
  const endGrabRef = useRef<() => void>(() => {});

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /**
   * Start the grab competition for given open seats
   */
  const startGrab = useCallback((openSeats: number[]) => {
    if (openSeats.length === 0) return;

    startTimeRef.current = performance.now();

    setState({
      isActive: true,
      openSeats,
      timeRemaining: GRAB_WINDOW_MS,
      playerTappedSeat: null,
      playerTapTime: null,
    });

    // Update time remaining with requestAnimationFrame
    const updateTime = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const remaining = Math.max(0, GRAB_WINDOW_MS - elapsed);

      setState((prev) => ({
        ...prev,
        timeRemaining: remaining,
      }));

      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(updateTime);
      }
    };
    rafRef.current = requestAnimationFrame(updateTime);

    // End grab after timeout - use ref to get latest endGrab function
    timerRef.current = setTimeout(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      endGrabRef.current();
    }, GRAB_WINDOW_MS);
  }, []);

  /**
   * Record player's tap on a seat
   */
  const playerTap = useCallback(
    (seatId: number) => {
      if (!state.isActive) return;
      if (!state.openSeats.includes(seatId)) return;
      if (state.playerTappedSeat !== null) return; // Already tapped

      const tapTime = performance.now() - startTimeRef.current;

      setState((prev) => ({
        ...prev,
        playerTappedSeat: seatId,
        playerTapTime: tapTime,
      }));
    },
    [state.isActive, state.openSeats, state.playerTappedSeat]
  );

  /**
   * End the grab competition and resolve winner
   */
  const endGrab = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    // Get current state for resolution
    setState((prev) => {
      if (!prev.isActive) return prev;

      // Resolve competition
      const results = resolveMultipleSeatCompetitions(
        prev.openSeats,
        prev.playerTapTime,
        prev.playerTappedSeat,
        playerPosition,
        playerWatchedSeatId,
        standingNPCs
      );

      // Call completion handler
      setTimeout(() => onGrabComplete(results), 0);

      return {
        isActive: false,
        openSeats: [],
        timeRemaining: 0,
        playerTappedSeat: null,
        playerTapTime: null,
      };
    });
  }, [playerPosition, playerWatchedSeatId, standingNPCs, onGrabComplete]);

  // Keep the ref updated with latest endGrab function
  endGrabRef.current = endGrab;

  /**
   * Cancel grab without resolving (e.g., game ended)
   */
  const cancelGrab = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    setState({
      isActive: false,
      openSeats: [],
      timeRemaining: 0,
      playerTappedSeat: null,
      playerTapTime: null,
    });
  }, []);

  return {
    ...state,
    startGrab,
    playerTap,
    endGrab,
    cancelGrab,
  };
}
