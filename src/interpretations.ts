import type { Stats } from "./gameData";

export type Interpretation = {
  id: string;
  title: string;
  summary: string;
  example: string;
  pattern: string;
};

const interpretations: Interpretation[] = [
  {
    id: "high-profit-high-dependence",
    pattern: "High Profit + High Dependence",
    title: "High Profit + High Dependence",
    summary:
      "Growth came with increasing reliance on the system. This suggests that choices that boost profit also tie the business more closely to platforms over time.",
    example: "Example: Uber, DoorDash, or YouTube creators relying on platform algorithms.",
  },
  {
    id: "high-visibility-high-strain",
    pattern: "High Visibility + High Strain",
    title: "High Visibility + High Strain",
    summary:
      "Gaining attention also created pressure. As visibility increases, so does the need to maintain output and performance.",
    example: "Example: content creators constantly posting until visibility starts turning into burnout.",
  },
  {
    id: "low-dependence-lower-profit",
    pattern: "Low Dependence + Lower Profit",
    title: "Low Dependence + Lower Profit",
    summary:
      "Staying independent limited growth. Avoiding reliance on platforms can reduce pressure, but it also slows expansion.",
    example: "Example: a small business skipping delivery apps keeps more control, but reaches fewer customers.",
  },
  {
    id: "balanced-stats",
    pattern: "Balanced Stats",
    title: "Balanced Stats",
    summary:
      "The system forces tradeoffs between growth and control. No single path maximizes everything, which shows the limits built into the structure.",
    example: "Example: a business trying to balance profit, visibility, and independence without fully committing to one path.",
  },
  {
    id: "high-everything",
    pattern: "High Everything",
    title: "High Everything",
    summary:
      "Success amplified both rewards and pressures. Growth increases profit and visibility, but it also drives up dependence and strain.",
    example: "Example: influencers scaling fast while also facing burnout and deeper platform reliance.",
  },
  {
    id: "low-everything",
    pattern: "Low Everything",
    title: "Low Everything",
    summary:
      "Avoiding the system reduces both risk and opportunity. There is less pressure, but there is also less growth and visibility.",
    example: "Example: staying offline or keeping a business very small to avoid platform pressure.",
  },
];

export const possibleInterpretations = interpretations;
export const FORCE_INTERPRETATION_AFTER_RUNS = 20;
export const FORCED_INTERPRETATION_ID = "high-profit-high-dependence";

function getInterpretationById(id: string) {
  return interpretations.find((interpretation) => interpretation.id === id);
}

export function getInterpretation(stats: Stats, totalRuns = 1): Interpretation {
  if (totalRuns === 0) {
    return {
      id: "no-pattern-yet",
      pattern: "No data yet",
      title: "No Strong Pattern Yet",
      summary:
        "There is not enough class data yet to show a clear pattern. Once a few runs come in, the interpretation will shift based on the average stat mix.",
      example: "Example: after more people play, we can compare whether the room leans toward growth, pressure, or independence.",
    };
  }

  if (totalRuns >= FORCE_INTERPRETATION_AFTER_RUNS) {
    const forcedInterpretation = getInterpretationById(FORCED_INTERPRETATION_ID);
    if (forcedInterpretation) {
      return forcedInterpretation;
    }
  }

  const highProfit = stats.profit >= 48;
  const lowerProfit = stats.profit < 30;
  const highVisibility = stats.visibility >= 32;
  const highDependence = stats.dependence >= 28;
  const lowDependence = stats.dependence <= 14;
  const highStrain = stats.workerStrain >= 11;
  const lowEverything =
    stats.profit < 24 && stats.visibility < 16 && stats.dependence < 12 && stats.workerStrain < 8;
  const highEverything = highProfit && highVisibility && highDependence && highStrain;

  if (highEverything) {
    return interpretations[4];
  }

  if (lowEverything) {
    return interpretations[5];
  }

  if (highProfit && highDependence) {
    return interpretations[0];
  }

  if (highVisibility && highStrain) {
    return interpretations[1];
  }

  if (lowDependence && lowerProfit) {
    return interpretations[2];
  }

  return interpretations[3];
}
