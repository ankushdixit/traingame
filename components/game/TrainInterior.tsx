/**
 * TrainInterior component - background elements of the train compartment
 * Renders ceiling handles, train window with parallax scenery
 * Matches single-shot design with sun, buildings, and electric poles
 */

interface TrainInteriorProps {
  /** Used to trigger scenery animation on station change */
  stationKey?: number;
  /** Whether the train is currently moving */
  isMoving?: boolean;
}

/**
 * Train window with animated parallax scenery background
 * Inspired by single-shot design with buildings and sun
 */
function TrainWindow({ isMoving }: { isMoving?: boolean }) {
  // Generate random building heights (consistent per render)
  const buildings = Array.from({ length: 12 }, (_, i) => ({
    width: 12 + ((i * 7) % 12),
    height: 20 + ((i * 13) % 35),
    opacity: 0.6 + ((i * 0.05) % 0.3),
  }));

  return (
    <div
      className="relative w-full h-24 rounded-lg overflow-hidden bg-gradient-to-b from-sky-300 to-sky-100 border-4 border-stone-400 shadow-inner"
      data-testid="train-window"
    >
      {/* Window frame */}
      <div className="absolute inset-0 border-8 border-stone-500 rounded pointer-events-none" />

      {/* Sun */}
      <div className="absolute top-3 right-6 w-8 h-8 bg-yellow-300 rounded-full shadow-lg shadow-yellow-200" />

      {/* Buildings background */}
      <div
        className={`absolute bottom-0 left-0 right-0 flex items-end gap-1 ${
          isMoving ? "transition-transform duration-1000 -translate-x-8" : "translate-x-0"
        }`}
      >
        {buildings.map((building, i) => (
          <div
            key={i}
            className="bg-stone-600"
            style={{
              width: `${building.width}px`,
              height: `${building.height}px`,
              opacity: building.opacity,
            }}
          />
        ))}
      </div>

      {/* Electric poles */}
      <div
        className={`absolute bottom-0 left-0 right-0 flex justify-around ${
          isMoving ? "transition-transform duration-500 -translate-x-4" : "translate-x-0"
        }`}
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-0.5 h-1 bg-stone-800" />
            <div className="w-6 h-0.5 bg-stone-800" />
            <div className="w-1 h-16 bg-stone-700" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrainInterior({ stationKey: _stationKey, isMoving }: TrainInteriorProps) {
  return (
    <>
      {/* Train Window at top */}
      <div className="mb-4">
        <TrainWindow isMoving={isMoving} />
      </div>
    </>
  );
}
