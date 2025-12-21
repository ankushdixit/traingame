"use client";

import { Difficulty, DIFFICULTY_OPTIONS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  const selectedOption = DIFFICULTY_OPTIONS.find((o) => o.value === value);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Difficulty</label>

      <div
        className="flex overflow-hidden rounded-lg border border-gray-300"
        role="radiogroup"
        aria-label="Difficulty selection"
      >
        {DIFFICULTY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            onClick={() => onChange(option.value)}
            data-testid={`difficulty-${option.value}`}
            data-state={value === option.value ? "selected" : "unselected"}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-medium transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
              value === option.value
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500" data-testid="difficulty-description">
        {selectedOption?.description}
      </p>
    </div>
  );
}
