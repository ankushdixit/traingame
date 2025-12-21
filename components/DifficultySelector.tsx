"use client";

import { Difficulty, DIFFICULTY_OPTIONS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-stone-700">Difficulty</label>

      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Difficulty selection">
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
              "p-3 rounded-xl border-2 transition-all text-center",
              value === option.value
                ? "border-amber-400 bg-amber-50 shadow-md"
                : "border-stone-200 hover:border-stone-300 bg-white"
            )}
          >
            <div className="text-2xl mb-1">{option.emoji}</div>
            <div className="font-semibold text-sm text-stone-800">{option.label}</div>
            <div className="text-xs text-stone-500 mt-1 leading-tight">{option.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
