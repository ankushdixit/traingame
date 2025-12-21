import StationSelectForm from "@/components/StationSelectForm";

/**
 * Home Page - Station Selection Screen
 *
 * Entry point for the Mumbai Local Train Game where players
 * select their boarding station and destination.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🚃</div>
          <h1 className="text-3xl font-bold text-stone-800 mb-2">Mumbai Local</h1>
          <p className="text-stone-600">Can you find a seat before your stop?</p>
        </div>

        {/* Setup Card */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6 border border-stone-200">
          <StationSelectForm />
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white/60 backdrop-blur rounded-xl p-4 text-sm text-stone-600">
          <h3 className="font-semibold text-stone-800 mb-2">How to Play</h3>
          <ul className="space-y-1">
            <li>• Tap seats to see options</li>
            <li>• Ask passengers where they&apos;re getting off</li>
            <li>• Claim an empty seat before your destination</li>
            <li>• Watch out for other passengers competing for seats!</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
