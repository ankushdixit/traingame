"use client";

/**
 * Transition controller hook for coordinating station transition animations.
 * Manages animation phases and interaction queuing during transitions.
 */

import { useState, useCallback, useRef } from "react";

export type TransitionPhase = "idle" | "shaking" | "departing" | "claiming" | "settling";

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
// shaking = train journey (sounds play during this phase)
// departing = NPCs exit after train arrives
// claiming = standing NPCs grab vacated seats
// settling = final settle before idle
const PHASE_DURATIONS = {
  shaking: 2500,
  departing: 400,
  claiming: 200,
  settling: 100,
};

/**
 * Hook for controlling station transition animations.
 * Coordinates train shake, NPC departures, and seat claims.
 */
export function useTransitionController(): UseTransitionControllerReturn {
  const [state, setState] = useState<TransitionState>(INITIAL_STATE);
  const pendingInteractionsRef = useRef<(() => void)[]>([]);

  const startTransition = useCallback(
    (departingIds: string[], claimingId: string | null, claimedSeatId: number | null) => {
      // Start shaking phase
      setState({
        phase: "shaking",
        departingNpcIds: departingIds,
        claimingNpcId: claimingId,
        claimedSeatId,
        playerClaimSuccess: false,
      });

      // Phase: departing (after shake completes)
      setTimeout(() => {
        setState((s) => ({ ...s, phase: "departing" }));
      }, PHASE_DURATIONS.shaking);

      // Phase: claiming (after departures complete)
      setTimeout(() => {
        setState((s) => ({ ...s, phase: "claiming" }));
      }, PHASE_DURATIONS.shaking + PHASE_DURATIONS.departing);

      // Phase: settling (after claims complete)
      setTimeout(
        () => {
          setState((s) => ({ ...s, phase: "settling" }));
        },
        PHASE_DURATIONS.shaking + PHASE_DURATIONS.departing + PHASE_DURATIONS.claiming
      );

      // Phase: idle (after settling, execute pending interactions)
      setTimeout(
        () => {
          // Execute pending interactions
          pendingInteractionsRef.current.forEach((fn) => fn());
          pendingInteractionsRef.current = [];

          setState(INITIAL_STATE);
        },
        PHASE_DURATIONS.shaking +
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
