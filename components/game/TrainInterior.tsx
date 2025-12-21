/**
 * TrainInterior component - background elements of the train compartment
 * Renders ceiling handles, poles, windows with scenery
 */

import { cn } from "@/lib/utils";

interface TrainInteriorProps {
  /** Used to trigger scenery animation on station change */
  stationKey?: number;
}

/**
 * Ceiling handle bar element
 */
function CeilingHandle() {
  return (
    <div className="flex h-10 w-2 flex-col items-center" data-testid="ceiling-handle">
      {/* Attachment point */}
      <div className="h-2 w-2 rounded-full bg-train-metallic-dark" />
      {/* Handle strap */}
      <div className="h-6 w-1 bg-train-handle" />
      {/* Grip ring */}
      <div className="h-3 w-3 rounded-full border-2 border-train-handle bg-transparent" />
    </div>
  );
}

/**
 * Vertical pole element
 */
function Pole({ position }: { position: "left" | "right" }) {
  return (
    <div
      className={cn(
        "absolute top-0 bottom-0 w-2 rounded-full bg-train-metallic",
        "shadow-md",
        position === "left" ? "left-4" : "right-4"
      )}
      data-testid={`pole-${position}`}
    />
  );
}

/**
 * Train window with animated scenery background
 */
function TrainWindow({ stationKey }: { stationKey?: number }) {
  return (
    <div
      className="absolute right-0 top-16 bottom-16 w-20 overflow-hidden rounded-l-lg border-l-4 border-train-metallic-dark"
      data-testid="train-window"
    >
      {/* Window glass */}
      <div className="absolute inset-0 bg-train-window opacity-70" />

      {/* Scenery background */}
      <div
        key={stationKey}
        className={cn(
          "absolute inset-0",
          stationKey !== undefined && stationKey > 0 && "animate-scenery"
        )}
        style={{
          background: `linear-gradient(
            to bottom,
            #87CEEB 0%,
            #87CEEB 55%,
            #4A7023 55%,
            #3D5A1F 70%,
            #2D4A0F 100%
          )`,
        }}
        data-testid="window-scenery"
      />

      {/* Window frame */}
      <div className="absolute inset-2 rounded border-2 border-train-metallic opacity-50" />
    </div>
  );
}

export function TrainInterior({ stationKey }: TrainInteriorProps) {
  return (
    <>
      {/* Ceiling with handle bars */}
      <div
        className="absolute top-0 right-0 left-0 flex h-14 items-end justify-around rounded-t-lg bg-train-metallic-dark px-8"
        data-testid="train-ceiling"
      >
        {[...Array(5)].map((_, i) => (
          <CeilingHandle key={i} />
        ))}
      </div>

      {/* Vertical poles on sides */}
      <Pole position="left" />
      <Pole position="right" />

      {/* Window with scenery */}
      <TrainWindow stationKey={stationKey} />

      {/* Floor */}
      <div
        className="absolute right-0 bottom-0 left-0 h-4 rounded-b-lg bg-train-floor"
        data-testid="train-floor"
      />
    </>
  );
}
