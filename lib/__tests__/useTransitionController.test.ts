import { renderHook, act } from "@testing-library/react";
import { useTransitionController } from "../useTransitionController";

describe("useTransitionController", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("initial state", () => {
    it("starts in idle phase", () => {
      const { result } = renderHook(() => useTransitionController());

      expect(result.current.state.phase).toBe("idle");
      expect(result.current.isAnimating).toBe(false);
    });

    it("has empty departing NPC IDs", () => {
      const { result } = renderHook(() => useTransitionController());

      expect(result.current.state.departingNpcIds).toEqual([]);
    });

    it("has null claiming NPC ID", () => {
      const { result } = renderHook(() => useTransitionController());

      expect(result.current.state.claimingNpcId).toBeNull();
    });

    it("has null claimed seat ID", () => {
      const { result } = renderHook(() => useTransitionController());

      expect(result.current.state.claimedSeatId).toBeNull();
    });

    it("has playerClaimSuccess as false", () => {
      const { result } = renderHook(() => useTransitionController());

      expect(result.current.state.playerClaimSuccess).toBe(false);
    });
  });

  describe("startTransition", () => {
    it("sets phase to shaking immediately", () => {
      const { result } = renderHook(() => useTransitionController());

      act(() => {
        result.current.startTransition(["npc-1"], "standing-npc-0", 2);
      });

      expect(result.current.state.phase).toBe("shaking");
      expect(result.current.isAnimating).toBe(true);
    });

    it("stores departing NPC IDs", () => {
      const { result } = renderHook(() => useTransitionController());

      act(() => {
        result.current.startTransition(["npc-1", "npc-2"], null, null);
      });

      expect(result.current.state.departingNpcIds).toEqual(["npc-1", "npc-2"]);
    });

    it("stores claiming NPC ID", () => {
      const { result } = renderHook(() => useTransitionController());

      act(() => {
        result.current.startTransition([], "standing-npc-0", 3);
      });

      expect(result.current.state.claimingNpcId).toBe("standing-npc-0");
    });

    it("stores claimed seat ID", () => {
      const { result } = renderHook(() => useTransitionController());

      act(() => {
        result.current.startTransition([], "standing-npc-0", 3);
      });

      expect(result.current.state.claimedSeatId).toBe(3);
    });

    it("transitions to departing phase after 2500ms", () => {
      const { result } = renderHook(() => useTransitionController());

      act(() => {
        result.current.startTransition(["npc-1"], null, null);
      });

      expect(result.current.state.phase).toBe("shaking");

      act(() => {
        jest.advanceTimersByTime(2500);
      });

      expect(result.current.state.phase).toBe("departing");
    });

    it("transitions to claiming phase after 2900ms", () => {
      const { result } = renderHook(() => useTransitionController());

      act(() => {
        result.current.startTransition(["npc-1"], "standing-npc-0", 2);
      });

      act(() => {
        jest.advanceTimersByTime(2900);
      });

      expect(result.current.state.phase).toBe("claiming");
    });

    it("transitions to settling phase after 3100ms", () => {
      const { result } = renderHook(() => useTransitionController());

      act(() => {
        result.current.startTransition(["npc-1"], null, null);
      });

      act(() => {
        jest.advanceTimersByTime(3100);
      });

      expect(result.current.state.phase).toBe("settling");
    });

    it("returns to idle phase after 3200ms", () => {
      const { result } = renderHook(() => useTransitionController());

      act(() => {
        result.current.startTransition(["npc-1"], null, null);
      });

      act(() => {
        jest.advanceTimersByTime(3200);
      });

      expect(result.current.state.phase).toBe("idle");
      expect(result.current.isAnimating).toBe(false);
    });
  });

  describe("queueInteraction", () => {
    it("executes immediately when idle", () => {
      const { result } = renderHook(() => useTransitionController());
      const mockFn = jest.fn();

      act(() => {
        result.current.queueInteraction(mockFn);
      });

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("queues when animating and executes after completion", () => {
      const { result } = renderHook(() => useTransitionController());
      const mockFn = jest.fn();

      act(() => {
        result.current.startTransition(["npc-1"], null, null);
      });

      act(() => {
        result.current.queueInteraction(mockFn);
      });

      // Not executed yet
      expect(mockFn).not.toHaveBeenCalled();

      // Complete animation
      act(() => {
        jest.advanceTimersByTime(3200);
      });

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("queues multiple interactions and executes all", () => {
      const { result } = renderHook(() => useTransitionController());
      const mockFn1 = jest.fn();
      const mockFn2 = jest.fn();
      const mockFn3 = jest.fn();

      act(() => {
        result.current.startTransition(["npc-1"], null, null);
      });

      act(() => {
        result.current.queueInteraction(mockFn1);
        result.current.queueInteraction(mockFn2);
        result.current.queueInteraction(mockFn3);
      });

      expect(mockFn1).not.toHaveBeenCalled();
      expect(mockFn2).not.toHaveBeenCalled();
      expect(mockFn3).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(3200);
      });

      expect(mockFn1).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledTimes(1);
      expect(mockFn3).toHaveBeenCalledTimes(1);
    });
  });

  describe("triggerPlayerClaimSuccess", () => {
    it("sets playerClaimSuccess to true", () => {
      const { result } = renderHook(() => useTransitionController());

      act(() => {
        result.current.triggerPlayerClaimSuccess();
      });

      expect(result.current.state.playerClaimSuccess).toBe(true);
    });

    it("resets playerClaimSuccess to false after 400ms", () => {
      const { result } = renderHook(() => useTransitionController());

      act(() => {
        result.current.triggerPlayerClaimSuccess();
      });

      expect(result.current.state.playerClaimSuccess).toBe(true);

      act(() => {
        jest.advanceTimersByTime(400);
      });

      expect(result.current.state.playerClaimSuccess).toBe(false);
    });
  });

  describe("isAnimating", () => {
    it("is false when idle", () => {
      const { result } = renderHook(() => useTransitionController());

      expect(result.current.isAnimating).toBe(false);
    });

    it("is true during shaking", () => {
      const { result } = renderHook(() => useTransitionController());

      act(() => {
        result.current.startTransition([], null, null);
      });

      expect(result.current.isAnimating).toBe(true);
    });

    it("is true during departing", () => {
      const { result } = renderHook(() => useTransitionController());

      act(() => {
        result.current.startTransition([], null, null);
        jest.advanceTimersByTime(2500);
      });

      expect(result.current.isAnimating).toBe(true);
    });

    it("is true during claiming", () => {
      const { result } = renderHook(() => useTransitionController());

      act(() => {
        result.current.startTransition([], null, null);
        jest.advanceTimersByTime(2900);
      });

      expect(result.current.isAnimating).toBe(true);
    });

    it("is true during settling", () => {
      const { result } = renderHook(() => useTransitionController());

      act(() => {
        result.current.startTransition([], null, null);
        jest.advanceTimersByTime(3100);
      });

      expect(result.current.isAnimating).toBe(true);
    });
  });
});
