export type Stats = {
  profit: number;
  visibility: number;
  dependence: number;
  workerStrain: number;
};

export type ChoiceSide = "left" | "right";

export type GateChoice = {
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
  label: string;
  effects: Stats;
};

export const initialStats: Stats = {
  profit: 0,
  visibility: 0,
  dependence: 0,
  workerStrain: 0,
};

export const gates: Gate[] = [
  {
    id: 1,
    left: {
      label: "Drop prices",
      effects: { profit: 8, visibility: 3, dependence: 0, workerStrain: 1 },
    },
    right: {
      label: "Buy targeted promo",
      effects: { profit: 12, visibility: 10, dependence: 8, workerStrain: 2 },
    },
  },
  {
    id: 2,
    left: {
      label: "Pack orders yourself",
      effects: { profit: 4, visibility: 1, dependence: 0, workerStrain: 4 },
    },
    right: {
      label: "Offer free delivery",
      effects: { profit: 10, visibility: 6, dependence: 7, workerStrain: 3 },
    },
  },
  {
    id: 3,
    left: {
      label: "Grow your niche",
      effects: { profit: 5, visibility: 2, dependence: 0, workerStrain: 0 },
    },
    right: {
      label: "Make TikTok ads",
      effects: { profit: 11, visibility: 9, dependence: 5, workerStrain: 2 },
    },
  },
  {
    id: 4,
    left: {
      label: "Avoid data tracking",
      effects: { profit: 4, visibility: 1, dependence: -2, workerStrain: 1 },
    },
    right: {
      label: "Use AI tracking",
      effects: { profit: 12, visibility: 8, dependence: 10, workerStrain: 3 },
    },
  },
  {
    id: 5,
    left: {
      label: "Stay independent",
      effects: { profit: 6, visibility: 3, dependence: -1, workerStrain: 1 },
    },
    right: {
      label: "Sell through the app",
      effects: { profit: 15, visibility: 12, dependence: 12, workerStrain: 4 },
    },
  },
];
