export type Stats = {
  profit: number;
  visibility: number;
  dependence: number;
  workerStrain: number;
};

export type ChoiceSide = "left" | "right";

export type GateChoice = {
  icon: string;
  label: string;
  effects: Stats;
};

export type Gate = {
  id: number;
  left: GateChoice;
  right: GateChoice;
};

export type PlayerChoice = {
  gateId: number;
  gateNumber: number;
  side: ChoiceSide;
  icon: string;
  label: string;
  effects: Stats;
};

export const initialStats: Stats = {
  profit: 0,
  visibility: 0,
  dependence: 0,
  workerStrain: 0,
};

// Each option uses hand-tuned stat deltas rather than a generated formula.
// During a run, the game adds these values directly onto the current totals.
// Positive numbers increase a stat, and negative numbers reduce it.
export const gates: Gate[] = [
  {
    id: 1,
    left: {
      icon: "🏷",
      label: "Lower your prices",
      effects: { profit: 8, visibility: 3, dependence: 0, workerStrain: 1 },
    },
    right: {
      icon: "🎯",
      label: "Run targeted ads",
      effects: { profit: 12, visibility: 10, dependence: 8, workerStrain: 2 },
    },
  },
  {
    id: 2,
    left: {
      icon: "📦",
      label: "Pack orders yourself",
      effects: { profit: 4, visibility: 1, dependence: 0, workerStrain: 4 },
    },
    right: {
      icon: "🚚",
      label: "Offer faster / free delivery",
      effects: { profit: 10, visibility: 6, dependence: 7, workerStrain: 3 },
    },
  },
  {
    id: 3,
    left: {
      icon: "🗣",
      label: "Promote through friends",
      effects: { profit: 5, visibility: 2, dependence: 0, workerStrain: 0 },
    },
    right: {
      icon: "🎵",
      label: "Run TikTok ads",
      effects: { profit: 11, visibility: 9, dependence: 5, workerStrain: 2 },
    },
  },
  {
    id: 4,
    left: {
      icon: "🔒",
      label: "Respect user privacy",
      effects: { profit: 4, visibility: 1, dependence: -2, workerStrain: 1 },
    },
    right: {
      icon: "📊",
      label: "Use data to understand customers",
      effects: { profit: 12, visibility: 8, dependence: 10, workerStrain: 3 },
    },
  },
  {
    id: 5,
    left: {
      icon: "🏪",
      label: "Stay independent",
      effects: { profit: 6, visibility: 3, dependence: -1, workerStrain: 1 },
    },
    right: {
      icon: "🏬",
      label: "Expand to Amazon / big retailers",
      effects: { profit: 15, visibility: 12, dependence: 12, workerStrain: 4 },
    },
  },
];
