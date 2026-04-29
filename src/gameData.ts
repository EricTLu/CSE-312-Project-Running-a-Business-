export type Stats = {
  profit: number;
  visibility: number;
  dependence: number;
  workerStrain: number;
};

export type ChoiceSide = "left" | "right";

export type ChoiceDrivers = {
  growth: number;
  reach: number;
  platformReliance: number;
  manualLoad: number;
  dataUse: number;
  independence: number;
};

export type GateChoice = {
  icon: string;
  label: string;
  drivers: ChoiceDrivers;
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

function clampMin(value: number, min = 0) {
  return Math.max(min, value);
}

// The game now uses a small formula instead of hand-entered stat totals.
//
// Each option has a few hidden drivers:
// - growth: how strongly the option pushes short-term business growth
// - reach: how much visibility or exposure it creates
// - platformReliance: how much it ties the business to a larger system
// - manualLoad: how much labor it adds directly onto the player/business
// - dataUse: how much it relies on tracking or customer data
// - independence: how much control it preserves outside a platform
//
// Those drivers are converted into the four visible stats with the formula below.
// This keeps the logic explainable: options that increase growth, reach, platform
// reliance, or data use tend to boost profit/visibility, but they also increase
// dependence or strain in predictable ways.
export function calculateChoiceEffects(drivers: ChoiceDrivers): Stats {
  const profit = 4 + drivers.growth * 2 + drivers.reach + drivers.dataUse;
  const visibility = 1 + drivers.reach * 3 + drivers.growth + drivers.dataUse;
  const dependence =
    drivers.platformReliance * 3 + drivers.dataUse * 2 - drivers.independence * 2;
  const workerStrain = clampMin(
    drivers.manualLoad * 2 +
      drivers.growth +
      Math.max(drivers.reach - 1, 0) -
      Math.min(drivers.platformReliance, 1) -
      drivers.independence
  );

  return {
    profit,
    visibility,
    dependence,
    workerStrain,
  };
}

function buildChoice(icon: string, label: string, drivers: ChoiceDrivers): GateChoice {
  return {
    icon,
    label,
    drivers,
    effects: calculateChoiceEffects(drivers),
  };
}

export const gates: Gate[] = [
  {
    id: 1,
    left: buildChoice("🏷", "Lower your prices", {
      growth: 2,
      reach: 0,
      platformReliance: 0,
      manualLoad: 0,
      dataUse: 0,
      independence: 0,
    }),
    right: buildChoice("🎯", "Run targeted ads", {
      growth: 2,
      reach: 2,
      platformReliance: 2,
      manualLoad: 0,
      dataUse: 1,
      independence: 0,
    }),
  },
  {
    id: 2,
    left: buildChoice("📦", "Pack orders yourself", {
      growth: 0,
      reach: 0,
      platformReliance: 0,
      manualLoad: 2,
      dataUse: 0,
      independence: 1,
    }),
    right: buildChoice("🚚", "Offer faster / free delivery", {
      growth: 2,
      reach: 1,
      platformReliance: 2,
      manualLoad: 1,
      dataUse: 0,
      independence: 0,
    }),
  },
  {
    id: 3,
    left: buildChoice("🗣", "Promote through friends", {
      growth: 1,
      reach: 0,
      platformReliance: 0,
      manualLoad: 0,
      dataUse: 0,
      independence: 1,
    }),
    right: buildChoice("🎵", "Run TikTok ads", {
      growth: 2,
      reach: 2,
      platformReliance: 1,
      manualLoad: 0,
      dataUse: 1,
      independence: 0,
    }),
  },
  {
    id: 4,
    left: buildChoice("🔒", "Respect user privacy", {
      growth: 0,
      reach: 0,
      platformReliance: 0,
      manualLoad: 0,
      dataUse: 0,
      independence: 1,
    }),
    right: buildChoice("📊", "Use data to understand customers", {
      growth: 2,
      reach: 1,
      platformReliance: 2,
      manualLoad: 1,
      dataUse: 3,
      independence: 0,
    }),
  },
  {
    id: 5,
    left: buildChoice("🏪", "Stay independent", {
      growth: 1,
      reach: 0,
      platformReliance: 0,
      manualLoad: 0,
      dataUse: 0,
      independence: 1,
    }),
    right: buildChoice("🏬", "Expand to Amazon / big retailers", {
      growth: 3,
      reach: 2,
      platformReliance: 3,
      manualLoad: 1,
      dataUse: 1,
      independence: 0,
    }),
  },
];
