"use client";

import type { Line } from "@/lib/types";

interface LineSelectorProps {
  value: Line;
  onChange: (line: Line) => void;
}

interface LineOption {
  value: Line;
  label: string;
  description: string;
  icon: string;
}

const LINE_OPTIONS: LineOption[] = [
  {
    value: "short",
    label: "Short Line",
    description: "Churchgate to Dadar (6 stations)",
    icon: "🚃",
  },
  {
    value: "full",
    label: "Full Line",
    description: "Churchgate to Borivali (15 stations)",
    icon: "🚂",
  },
];

export function LineSelector({ value, onChange }: LineSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-stone-700">Journey Length</label>

      <div className="grid grid-cols-2 gap-3">
        {LINE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            data-testid={`line-option-${option.value}`}
            data-selected={value === option.value}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              value === option.value
                ? "border-amber-400 bg-amber-50"
                : "border-stone-200 hover:border-stone-300"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{option.icon}</span>
              <span className="font-medium text-stone-800">{option.label}</span>
            </div>
            <p className="text-sm text-stone-500">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
