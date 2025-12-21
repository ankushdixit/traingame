/**
 * Character registry for Mumbai Local Train Game
 * Provides 8 distinct NPC characters with Mumbai commuter attire variety
 */

import { ComponentType, ReactElement } from "react";
import { Character1 } from "./Character1";
import { Character2 } from "./Character2";
import { Character3 } from "./Character3";
import { Character4 } from "./Character4";
import { Character5 } from "./Character5";
import { Character6 } from "./Character6";
import { Character7 } from "./Character7";
import { Character8 } from "./Character8";
import { PlayerCharacter } from "./PlayerCharacter";

export interface CharacterProps {
  isSeated?: boolean;
}

/**
 * Array of all NPC character components
 * Each character has unique appearance with Mumbai commuter diversity:
 * 1. Young professional man with glasses (blue shirt)
 * 2. Middle-aged woman in traditional kurta (maroon)
 * 3. Elderly uncle with white hair (white shirt)
 * 4. College student with earphones (green t-shirt)
 * 5. Business woman with handbag (formal blazer)
 * 6. Working man in checkered shirt (red)
 * 7. Elderly aunty in saree (green)
 * 8. Young woman with ponytail (yellow top)
 */
export const CHARACTERS: ComponentType<CharacterProps>[] = [
  Character1,
  Character2,
  Character3,
  Character4,
  Character5,
  Character6,
  Character7,
  Character8,
];

export const CHARACTER_COUNT = CHARACTERS.length;

/**
 * Get a character component by sprite index
 * Wraps around if index exceeds available characters
 */
export function getCharacterComponent(spriteIndex: number): ComponentType<CharacterProps> {
  return CHARACTERS[spriteIndex % CHARACTER_COUNT];
}

/**
 * Render a character element with the specified sprite and seated state
 */
export function renderCharacter(spriteIndex: number, isSeated: boolean): ReactElement {
  const CharComponent = getCharacterComponent(spriteIndex);
  return <CharComponent isSeated={isSeated} />;
}

// Re-export individual components for direct use
export {
  Character1,
  Character2,
  Character3,
  Character4,
  Character5,
  Character6,
  Character7,
  Character8,
  PlayerCharacter,
};
