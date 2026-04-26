import type { Stats } from "./gameData";
import { getInterpretation, possibleInterpretations } from "./interpretations";

export type DashboardSummary = {
  title: string;
  summary: string;
  example: string;
};

export type PossibleOutcome = DashboardSummary & {
  pattern: string;
};

export const possibleDashboardOutcomes: PossibleOutcome[] = possibleInterpretations;

export function getDashboardSummary(stats: Stats, totalRuns: number): DashboardSummary {
  const interpretation = getInterpretation(stats, totalRuns);

  return {
    title: interpretation.title,
    summary: interpretation.summary,
    example: interpretation.example,
  };
}
