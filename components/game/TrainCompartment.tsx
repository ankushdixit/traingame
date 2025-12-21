/**
 * TrainCompartment component - themed Mumbai local train compartment wrapper
 * Provides the train interior visual context for the game
 * Matches single-shot design with stone gradient frame
 * Layout: Window -> Top Seats -> Aisle -> Bottom Seats -> Status Bar
 */

import { ReactNode } from "react";
import { TrainInterior } from "./TrainInterior";

interface TrainCompartmentProps {
  /** Top row of seats */
  topRow: ReactNode;
  /** Standing area / aisle */
  standingArea: ReactNode;
  /** Bottom row of seats */
  bottomRow: ReactNode;
  /** Status bar */
  statusBar: ReactNode;
  /** Current station index - used to trigger scenery animation */
  currentStation?: number;
  /** Whether the train is currently shaking (station transition) */
  isShaking?: boolean;
}

export function TrainCompartment({
  topRow,
  standingArea,
  bottomRow,
  statusBar,
  currentStation,
  isShaking = false,
}: TrainCompartmentProps) {
  return (
    <div
      className={`bg-gradient-to-b from-stone-300 to-stone-400 rounded-2xl p-4 shadow-xl border-4 border-stone-500 ${
        isShaking ? "animate-train-shake" : ""
      }`}
      data-testid="train-compartment"
    >
      {/* Interior elements (window, grab handles) */}
      <TrainInterior stationKey={currentStation} isMoving={isShaking} />

      {/* Top row of seats with amber background */}
      <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-xl p-4 border-2 border-amber-300">
        {topRow}
      </div>

      {/* Standing Area / Aisle - in the middle */}
      <div className="my-3">{standingArea}</div>

      {/* Bottom row of seats with amber background */}
      <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-xl p-4 border-2 border-amber-300">
        {bottomRow}
      </div>

      {/* Status Bar */}
      {statusBar}
    </div>
  );
}
