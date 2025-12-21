/**
 * TrainCompartment component - themed Mumbai local train compartment wrapper
 * Provides the train interior visual context for the game
 */

import { ReactNode } from "react";
import { TrainInterior } from "./TrainInterior";

interface TrainCompartmentProps {
  children: ReactNode;
  /** Current station index - used to trigger scenery animation */
  currentStation?: number;
}

export function TrainCompartment({ children, currentStation }: TrainCompartmentProps) {
  return (
    <div
      className="relative min-h-[400px] w-full max-w-2xl overflow-hidden rounded-lg border-4 border-train-maroon bg-train-cream p-6 shadow-xl"
      data-testid="train-compartment"
    >
      {/* Interior elements (ceiling, poles, window, floor) */}
      <TrainInterior stationKey={currentStation} />

      {/* Main content area - seats and standing area */}
      <div className="relative z-10 mt-16 mb-6 px-8">{children}</div>
    </div>
  );
}
