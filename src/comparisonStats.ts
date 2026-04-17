import type { PlayerChoice, Stats } from "./gameData";

export type ComparisonStat = {
  percent: number;
  label: string;
  text: string;
};

function clampPercent(value: number) {
  return Math.max(52, Math.min(92, Math.round(value)));
}

export function getComparisonStats(stats: Stats, choices: PlayerChoice[]): ComparisonStat[] {
  const platformChoices = choices.filter((choice) => choice.side === "right").length;
  const totalChoices = Math.max(choices.length, 1);
  const platformRate = platformChoices / totalChoices;
  const profitPressure = stats.profit + stats.visibility * 0.7 + platformChoices * 5;
  const dependencePressure = stats.dependence + stats.workerStrain * 1.5 + platformChoices * 4;

  if (stats.dependence >= 30) {
    return [
      {
        percent: clampPercent(62 + dependencePressure * 0.55),
        label: "made a similar dependency tradeoff",
        text:
          "Illustrative comparison: when convenience keeps the run moving, most players accept more platform reliance than they planned.",
      },
    ];
  }

  if (stats.visibility >= 30) {
    return [
      {
        percent: clampPercent(58 + stats.visibility * 0.8),
        label: "chased visibility too",
        text:
          "Illustrative comparison: attention often feels necessary, even when it makes the system more demanding.",
      },
    ];
  }

  if (platformRate >= 0.6) {
    return [
      {
        percent: clampPercent(56 + platformRate * 34),
        label: "leaned into the high-growth path",
        text:
          "Illustrative comparison: your choices followed the path many players take when short-term survival is on the line.",
      },
    ];
  }

  if (stats.workerStrain >= 10) {
    return [
      {
        percent: clampPercent(55 + stats.workerStrain * 2.4),
        label: "normalized the extra pressure",
        text:
          "Illustrative comparison: strain tends to feel acceptable when the system frames it as the cost of staying competitive.",
      },
    ];
  }

  if (stats.profit >= 30 && stats.dependence <= 18) {
    return [
      {
        percent: clampPercent(54 + profitPressure * 0.35),
        label: "tried to balance growth and control",
        text:
          "Illustrative comparison: this path suggests careful participation, taking some benefit without giving the platform every lever.",
      },
    ];
  }

  return [
    {
      percent: clampPercent(64 - platformRate * 18),
      label: "protected independence more than speed",
      text:
        "Illustrative comparison: this route is less flashy, but it resists the idea that every convenient shortcut is inevitable.",
    },
  ];
}
