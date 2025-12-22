"use client";

/**
 * Transition controller hook for coordinating station transition animations.
 * Manages animation phases and interaction queuing during transitions.
 */

import { useState, useCallback, useRef } from "react";

export type TransitionPhase =
  | "idle"
  | "traveling"
  | "arriving"
  | "departing"
  | "claiming"
  | "settling";

export interface TransitionState {
  phase: TransitionPhase;
  departingNpcIds: string[];
  claimingNpcId: string | null;
  claimedSeatId: number | null;
  playerClaimSuccess: boolean;
}

interface UseTransitionControllerReturn {
  state: TransitionState;
  startTransition: (
    departingIds: string[],
    claimingId: string | null,
    claimedSeatId: number | null
  ) => void;
  queueInteraction: (fn: () => void) => void;
  isAnimating: boolean;
  triggerPlayerClaimSuccess: () => void;
}

const INITIAL_STATE: TransitionState = {
  phase: "idle",
  departingNpcIds: [],
  claimingNpcId: null,
  claimedSeatId: null,
  playerClaimSuccess: false,
};

// Animation phase durations in milliseconds
// traveling = train journey (sounds play, progress bar animates)
// arriving = train has arrived at station (brief pause)
// departing = NPCs exit after train arrives
// claiming = standing NPCs grab vacated seats
// settling = final settle before idle
export const PHASE_DURATIONS = {
  traveling: 1800, // Progress bar animation syncs with train sounds
  arriving: 200, // Brief pause after arrival
  departing: 400, // NPCs exit seats
  claiming: 200, // Standing NPCs grab seats
  settling: 100, // Final settle
};

// Calculate total animation duration
export const TOTAL_ANIMATION_DURATION =
  PHASE_DURATIONS.traveling +
  PHASE_DURATIONS.arriving +
  PHASE_DURATIONS.departing +
  PHASE_DURATIONS.claiming +
  PHASE_DURATIONS.settling;

/**
 * Hook for controlling station transition animations.
 * Coordinates train shake, NPC departures, and seat claims.
 */
export function useTransitionController(): UseTransitionControllerReturn {
  const [state, setState] = useState<TransitionState>(INITIAL_STATE);
  const pendingInteractionsRef = useRef<(() => void)[]>([]);

  const startTransition = useCallback(
    (departingIds: string[], claimingId: string | null, claimedSeatId: number | null) => {
      // Start traveling phase (train journey - sounds play, progress bar animates)
      setState({
        phase: "traveling",
        departingNpcIds: departingIds,
        claimingNpcId: claimingId,
        claimedSeatId,
        playerClaimSuccess: false,
      });

      // Phase: arriving (train has arrived at next station)
      setTimeout(() => {
        setState((s) => ({ ...s, phase: "arriving" }));
      }, PHASE_DURATIONS.traveling);

      // Phase: departing (NPCs exit after train arrives)
      setTimeout(() => {
        setState((s) => ({ ...s, phase: "departing" }));
      }, PHASE_DURATIONS.traveling + PHASE_DURATIONS.arriving);

      // Phase: claiming (standing NPCs grab vacated seats)
      setTimeout(
        () => {
          setState((s) => ({ ...s, phase: "claiming" }));
        },
        PHASE_DURATIONS.traveling + PHASE_DURATIONS.arriving + PHASE_DURATIONS.departing
      );

      // Phase: settling (final settle before idle)
      setTimeout(
        () => {
          setState((s) => ({ ...s, phase: "settling" }));
        },
        PHASE_DURATIONS.traveling +
          PHASE_DURATIONS.arriving +
          PHASE_DURATIONS.departing +
          PHASE_DURATIONS.claiming
      );

      // Phase: idle (after settling, execute pending interactions)
      setTimeout(
        () => {
          // Execute pending interactions
          pendingInteractionsRef.current.forEach((fn) => fn());
          pendingInteractionsRef.current = [];

          setState(INITIAL_STATE);
        },
        PHASE_DURATIONS.traveling +
          PHASE_DURATIONS.arriving +
          PHASE_DURATIONS.departing +
          PHASE_DURATIONS.claiming +
          PHASE_DURATIONS.settling
      );
    },
    []
  );

  const queueInteraction = useCallback(
    (fn: () => void) => {
      if (state.phase !== "idle") {
        pendingInteractionsRef.current.push(fn);
      } else {
        fn();
      }
    },
    [state.phase]
  );

  const triggerPlayerClaimSuccess = useCallback(() => {
    setState((s) => ({ ...s, playerClaimSuccess: true }));
    // Reset after animation
    setTimeout(() => {
      setState((s) => ({ ...s, playerClaimSuccess: false }));
    }, 400);
  }, []);

  return {
    state,
    startTransition,
    queueInteraction,
    isAnimating: state.phase !== "idle",
    triggerPlayerClaimSuccess,
  };
}
