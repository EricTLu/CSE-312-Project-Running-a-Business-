import type { PlayerChoice, Stats } from "./gameData";
import { getInterpretation } from "./interpretations";

export type Ending = {
  id: string;
  title: string;
  takeaway: string;
  example: string;
};

export function getEnding(stats: Stats, choices: PlayerChoice[] = []): Ending {
  const interpretation = getInterpretation(stats, Math.max(choices.length, 1));

  return {
    id: interpretation.id,
    title: interpretation.title,
    takeaway: interpretation.summary,
    example: interpretation.example,
  };
}
