import type { Stats } from "./gameData";

export type DashboardSummary = {
  title: string;
  summary: string;
};

export type PossibleOutcome = DashboardSummary & {
  pattern: string;
};

export const possibleDashboardOutcomes: PossibleOutcome[] = [
  {
    pattern: "High profit + high dependence",
    title: "Growth Through Dependence",
    summary:
      "When profit rises with dependence, the game is showing how monetization can make reliance feel normal. The player is not simply choosing wrong; the system rewards choices that make leaving harder later.",
  },
  {
    pattern: "High visibility + high strain",
    title: "Seen, But Stretched",
    summary:
      "When visibility and strain rise together, attention starts to look less like freedom and more like pressure. This connects to class themes about platforms steering behavior by making visibility feel necessary.",
  },
  {
    pattern: "High dependence across outcomes",
    title: "Locked Into the System",
    summary:
      "High dependence shows that the structure of the options matters. Even different player paths can end up moving toward the same platform-controlled environment.",
  },
  {
    pattern: "High strain regardless of profit",
    title: "Efficiency With a Human Cost",
    summary:
      "High strain points to the hidden labor behind smooth tech systems. What looks efficient from the outside can push stress onto workers, sellers, creators, or users.",
  },
  {
    pattern: "Low profit + low dependence",
    title: "Independence Without Momentum",
    summary:
      "Lower dependence can protect autonomy, but it may also limit growth. The game frames independence as possible, but not always rewarded by the platform economy.",
  },
  {
    pattern: "Balanced growth + lower dependence",
    title: "Careful Participation",
    summary:
      "Balanced outcomes suggest a narrow path where players use the system without fully giving themselves over to it. That balance is fragile because the strongest incentives still point toward scale, data, and dependence.",
  },
];

export function getDashboardSummary(stats: Stats, totalRuns: number): DashboardSummary {
  if (totalRuns === 0) {
    return {
      title: "No Strong Pattern Yet",
      summary:
        "There is not enough data yet to show a clear trend. As more runs are recorded, the dashboard can show whether players tend to prioritize monetization, visibility, independence, or survival under pressure.",
    };
  }

  const highProfit = stats.profit >= 48;
  const moderateProfit = stats.profit >= 28 && stats.profit < 48;
  const lowProfit = stats.profit < 24;
  const highVisibility = stats.visibility >= 32;
  const lowVisibility = stats.visibility < 16;
  const highDependence = stats.dependence >= 28;
  const lowDependence = stats.dependence <= 16;
  const highStrain = stats.workerStrain >= 11;

  if (highProfit && highVisibility && highDependence && highStrain) {
    return {
      title: "Expansion at Full Cost",
      summary:
        "The strongest growth outcomes also came with the strongest signs of pressure and reliance. This connects to class themes about technological capitalism: expansion is rewarded, but the reward often depends on more data, more responsiveness, and less independence.",
    };
  }

  if (highProfit && highDependence) {
    return {
      title: "Growth Through Dependence",
      summary:
        "The runs suggest that success often came from choices that increased reliance on the system itself. Profit looks rewarding in the short term, but the pattern shows how platforms can make dependence feel like the normal cost of staying competitive.",
    };
  }

  if (highVisibility && highStrain) {
    return {
      title: "Seen, But Stretched",
      summary:
        "These runs point to a pattern where gaining attention also intensified pressure. The system rewards visibility, but visibility can also become a form of behavioral steering: post more, respond faster, optimize constantly.",
    };
  }

  if (highDependence) {
    return {
      title: "Locked Into the System",
      summary:
        "Even when outcomes differed, the runs still moved toward platform reliance. That suggests the game is not just about individual choices; it is about how the environment makes certain choices feel practical, profitable, and eventually hard to exit.",
    };
  }

  if (highStrain) {
    return {
      title: "Efficiency With a Human Cost",
      summary:
        "The data suggests that staying active in the system created pressure even when the rewards were uneven. This is an ethical tech issue: what looks efficient from the outside may shift the burden onto workers, creators, or small operators.",
    };
  }

  if (lowProfit && lowVisibility) {
    return {
      title: "Independence Without Momentum",
      summary:
        "These runs suggest that avoiding deeper platform entanglement may preserve some autonomy, but it can also limit growth and exposure. The game reflects how resisting a dominant system can carry real economic costs.",
    };
  }

  if (moderateProfit && lowDependence) {
    return {
      title: "Careful Participation",
      summary:
        "These outcomes suggest that it is possible to benefit from the system without fully giving into it, though that balance is fragile. Survival depends on managing incentives rather than escaping them entirely.",
    };
  }

  return {
    title: "Mixed Incentives",
    summary:
      "The averages show a compromise between growth, attention, pressure, and independence. That fits the main idea of the project: technology does not simply reflect behavior; it shapes the environment where behavior happens.",
  };
}
