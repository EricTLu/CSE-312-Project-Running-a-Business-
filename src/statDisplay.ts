import type { Stats } from "./gameData";

export const STAT_DISPLAY_MAX = 100;

export type StatTone = "blue" | "green" | "orange" | "red";

// Display-only ceilings based on the current run's possible stat range,
// with a little headroom so every stat can be shown on the same 0-100 scale.
const rawMaxByStat: Record<keyof Stats, number> = {
  profit: 65,
  visibility: 45,
  dependence: 45,
  workerStrain: 18,
};

export function normalizeStatValue(stat: keyof Stats, value: number) {
  const rawMax = rawMaxByStat[stat];
  return Math.max(0, Math.min(STAT_DISPLAY_MAX, Math.round((value / rawMax) * STAT_DISPLAY_MAX)));
}

export function getStatDisplayItems(stats: Stats): {
  key: keyof Stats;
  label: string;
  value: number;
  tone: StatTone;
}[] {
  return [
    {
      key: "profit" as const,
      label: "Profit",
      value: normalizeStatValue("profit", stats.profit),
      tone: "green",
    },
    {
      key: "visibility" as const,
      label: "Visibility",
      value: normalizeStatValue("visibility", stats.visibility),
      tone: "blue",
    },
    {
      key: "dependence" as const,
      label: "Dependence",
      value: normalizeStatValue("dependence", stats.dependence),
      tone: "orange",
    },
    {
      key: "workerStrain" as const,
      label: "Strain",
      value: normalizeStatValue("workerStrain", stats.workerStrain),
      tone: "red",
    },
  ];
}
