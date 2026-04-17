import type { PlayerChoice, Stats } from "./gameData";

export type Ending = {
  id: string;
  title: string;
  takeaway: string;
};

export function getEnding(stats: Stats, choices: PlayerChoice[] = []): Ending {
  const platformChoices = choices.filter((choice) => choice.side === "right").length;
  const independenceChoices = choices.length - platformChoices;

  if (stats.profit >= 55 && stats.dependence >= 35) {
    return {
      id: "fast-growth-tight-leash",
      title: "Fast Growth, Tight Leash",
      takeaway:
        "You made choices that helped the business grow quickly, but each boost also made the platform harder to leave. The run shows how dependence can be built out of reasonable short-term moves, not bad judgment.",
    };
  }

  if (stats.visibility >= 35 && stats.workerStrain >= 12) {
    return {
      id: "visible-under-pressure",
      title: "Visible Under Pressure",
      takeaway:
        "More attention brought more pressure. The platform made visibility feel like freedom, but the extra reach also came with more labor, faster reactions, and less room to slow down.",
    };
  }

  if (stats.dependence >= 35 && stats.profit < 55) {
    return {
      id: "locked-in-before-payoff",
      title: "Locked In Before the Payoff",
      takeaway:
        "You gave the system more control before the rewards fully arrived. That is one of the traps here: convenience can feel harmless option by option, then later it becomes the condition for staying alive.",
    };
  }

  if (stats.profit >= 42 && stats.workerStrain >= 12) {
    return {
      id: "growth-with-a-cost",
      title: "Growth With a Cost",
      takeaway:
        "The business survived, but the work got heavier. The game is not saying growth is wrong; it is showing how systems can turn ordinary survival choices into pressure that someone else has to absorb.",
    };
  }

  if (stats.profit >= 35 && stats.dependence <= 18) {
    return {
      id: "slower-more-yours",
      title: "Slower, More Yours",
      takeaway:
        "You kept more control, but the game made that path less flashy. That tradeoff matters: independent choices often look inefficient inside a system designed to reward scale, speed, and predictability.",
    };
  }

  if (stats.visibility >= 28 && stats.dependence >= 24) {
    return {
      id: "seen-and-steered",
      title: "Seen and Steered",
      takeaway:
        "Your choices made the business easier to notice, but also easier to guide. The platform did not just watch what worked; it shaped which options felt practical in the first place.",
    };
  }

  if (platformChoices > independenceChoices) {
    return {
      id: "nudged-forward",
      title: "Nudged Forward",
      takeaway:
        "You often chose the option that looked more useful right now. Over time, those small nudges formed a path. The point is not that you chose wrong, but that the course was built to make some choices feel obvious.",
    };
  }

  return {
    id: "held-the-line",
    title: "Held the Line",
    takeaway:
      "You resisted some of the easiest platform shortcuts. That protected autonomy, but it also made survival feel harder. The run shows how independence can be possible while still being structurally discouraged.",
  };
}
