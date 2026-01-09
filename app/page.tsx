import Image from "next/image";
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
          <Image
            src="/logo.png"
            alt="Mumbai Local Rush"
            width={220}
            height={220}
            className="mx-auto"
            priority
          />
          <p className="text-stone-600 mt-2">Can you find a seat before your stop?</p>
        </div>

        {/* Setup Card */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6 border border-stone-200">
          <StationSelectForm />
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white/60 backdrop-blur rounded-xl p-5 text-sm text-stone-600">
          <h3 className="font-bold text-stone-800 mb-4 text-base">How to Play</h3>

          {/* Goal Section */}
          <div className="bg-emerald-50 rounded-lg p-3 mb-4 border border-emerald-200">
            <p className="font-semibold text-emerald-700">
              🎯 Goal: Grab a seat before reaching your destination!
            </p>
            <p className="text-emerald-600 text-xs mt-1">
              Win instantly when you get a seat. Lose if you arrive standing.
            </p>
          </div>

          {/* Actions Section */}
          <div className="mb-4">
            <p className="font-semibold text-stone-700 mb-2">Your Actions (2 per turn)</p>
            <div className="space-y-2 pl-1">
              <div className="flex gap-2">
                <span className="text-lg">📋</span>
                <div>
                  <span className="font-medium text-stone-700">Ask</span>
                  <span className="text-stone-500">
                    {" "}
                    — Tap a seated passenger to see which station they&apos;re getting off
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-lg">👁️</span>
                <div>
                  <span className="font-medium text-stone-700">Watch</span>
                  <span className="text-stone-500">
                    {" "}
                    — Keep an eye on a nearby seat for a speed bonus when grabbing
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-lg">🚶</span>
                <div>
                  <span className="font-medium text-stone-700">Move</span>
                  <span className="text-stone-500">
                    {" "}
                    — Change your position in the aisle to be near different seats
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grab Phase Section */}
          <div className="mb-4">
            <p className="font-semibold text-stone-700 mb-2">When Seats Open</p>
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 text-stone-600">
              <p className="mb-2">
                When passengers exit, a <strong>2-second grab window</strong> opens:
              </p>
              <ul className="space-y-1 text-xs">
                <li>
                  ⚡ <strong>Tap the empty seat</strong> to compete for it
                </li>
                <li>
                  🎯 Being <strong>adjacent</strong> to the seat = faster grab
                </li>
                <li>
                  👁️ <strong>Watching</strong> the seat = even faster!
                </li>
                <li>🏃 Other passengers will also try to grab it</li>
              </ul>
            </div>
          </div>

          {/* Tips Section */}
          <div className="text-xs text-stone-500 bg-stone-100 rounded-lg p-3">
            <p className="font-medium text-stone-600 mb-1">💡 Tips</p>
            <ul className="space-y-0.5">
              <li>• Ask passengers to find who&apos;s leaving soon</li>
              <li>• Position yourself near seats that will open</li>
              <li>• Watch a seat before it opens for the best chance</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
