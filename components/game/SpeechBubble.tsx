/**
 * SpeechBubble component - displays destination as a speech bubble overlay
 * Shows revealed destination while keeping the character visible underneath
 */

interface SpeechBubbleProps {
  stationName: string;
  position?: "top" | "bottom";
}

export function SpeechBubble({ stationName, position = "top" }: SpeechBubbleProps) {
  const positionClasses = position === "top" ? "bottom-full mb-1" : "top-full mt-1";

  const tailClasses =
    position === "top" ? "top-full border-t-white" : "bottom-full rotate-180 border-t-white";

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 ${positionClasses} z-20`}
      data-testid="speech-bubble"
    >
      <div className="bg-white border-2 border-gray-400 rounded-lg px-2 py-1 shadow-md">
        <span
          className="text-xs font-medium whitespace-nowrap text-gray-800"
          data-testid="speech-bubble-destination"
        >
          &rarr; {stationName}
        </span>
      </div>
      {/* Speech bubble tail */}
      <div className={`absolute left-1/2 -translate-x-1/2 ${tailClasses}`} aria-hidden="true">
        <div
          className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white"
          style={{
            filter: "drop-shadow(0 1px 0 rgb(156 163 175))",
          }}
        />
      </div>
    </div>
  );
}
