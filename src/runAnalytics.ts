import type { Stats } from "./gameData";
import type { CompletedRun } from "./runStorage";

export type StoredRun = CompletedRun | (Stats & { timestamp?: number });

export const emptyStats: Stats = {
  profit: 0,
  visibility: 0,
  dependence: 0,
  workerStrain: 0,
};

export function getRunStats(run: StoredRun): Stats {
  if ("finalStats" in run) {
    return run.finalStats;
  }

  return {
    profit: run.profit,
    visibility: run.visibility,
    dependence: run.dependence,
    workerStrain: run.workerStrain,
  };
}

export function averageStats(runs: StoredRun[]): Stats {
  if (runs.length === 0) return emptyStats;

  const totals = runs.reduce(
    (sum, run) => {
      const stats = getRunStats(run);
      return {
        profit: sum.profit + stats.profit,
        visibility: sum.visibility + stats.visibility,
        dependence: sum.dependence + stats.dependence,
        workerStrain: sum.workerStrain + stats.workerStrain,
      };
    },
    emptyStats
  );

  return {
    profit: Math.round(totals.profit / runs.length),
    visibility: Math.round(totals.visibility / runs.length),
    dependence: Math.round(totals.dependence / runs.length),
    workerStrain: Math.round(totals.workerStrain / runs.length),
  };
}

export function recentRuns(runs: StoredRun[], count = 5) {
  return [...runs]
    .sort((a, b) => ("timestamp" in b ? b.timestamp ?? 0 : 0) - ("timestamp" in a ? a.timestamp ?? 0 : 0))
    .slice(0, count);
}
