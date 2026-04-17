import { push, ref, set } from "firebase/database";
import { db } from "./firebase";
import type { PlayerChoice, Stats } from "./gameData";
import type { Ending } from "./resultTakeaways";

export type CompletedRun = {
  timestamp: number;
  finalStats: Stats;
  endingId: string;
  endingTitle: string;
  endingTakeaway: string;
  choices: PlayerChoice[];
};

export async function saveCompletedRun(
  stats: Stats,
  ending: Ending,
  choices: PlayerChoice[]
) {
  const runRef = push(ref(db, "runs"));

  const run: CompletedRun = {
    timestamp: Date.now(),
    finalStats: stats,
    endingId: ending.id,
    endingTitle: ending.title,
    endingTakeaway: ending.takeaway,
    choices,
  };

  await set(runRef, run);
  return runRef.key;
}
