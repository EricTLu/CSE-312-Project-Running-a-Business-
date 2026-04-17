import { useRef, useState } from "react";
import StartScreen from "./components/StartScreen";
import RunnerScreen from "./components/RunnerScreen";
import ResultScreen from "./components/ResultScreen";
import HostScreen from "./components/HostScreen";
import { gates, initialStats, type ChoiceSide, type PlayerChoice, type Stats } from "./gameData";
import { getEnding, type Ending } from "./resultTakeaways";
import { saveCompletedRun } from "./runStorage";

type Screen = "start" | "game" | "result" | "host";
type SaveStatus = "idle" | "saving" | "saved" | "error";

type FinalRun = {
  stats: Stats;
  choices: PlayerChoice[];
  ending: Ending;
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [currentGateIndex, setCurrentGateIndex] = useState(0);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [choices, setChoices] = useState<PlayerChoice[]>([]);
  const [finalRun, setFinalRun] = useState<FinalRun | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const saveStartedRef = useRef(false);

  const handleStart = () => {
    setStats(initialStats);
    setChoices([]);
    setFinalRun(null);
    setSaveStatus("idle");
    saveStartedRef.current = false;
    setCurrentGateIndex(0);
    setScreen("game");
  };

  const handleMainMenu = () => {
    setStats(initialStats);
    setChoices([]);
    setFinalRun(null);
    setSaveStatus("idle");
    saveStartedRef.current = false;
    setCurrentGateIndex(0);
    setScreen("start");
  };

  const handleChoose = (side: ChoiceSide) => {
    const gate = gates[currentGateIndex];
    const choice = gate[side];

    const newStats = {
      profit: stats.profit + choice.effects.profit,
      visibility: stats.visibility + choice.effects.visibility,
      dependence: stats.dependence + choice.effects.dependence,
      workerStrain: stats.workerStrain + choice.effects.workerStrain,
    };

    const choiceRecord: PlayerChoice = {
      gateId: gate.id,
      gateNumber: currentGateIndex + 1,
      side,
      label: choice.label,
      effects: choice.effects,
    };

    const nextChoices = [...choices, choiceRecord];

    setStats(newStats);
    setChoices(nextChoices);

    if (currentGateIndex === gates.length - 1) {
      const ending = getEnding(newStats, nextChoices);
      setFinalRun({ stats: newStats, choices: nextChoices, ending });
      setScreen("result");

      if (!saveStartedRef.current) {
        saveStartedRef.current = true;
        setSaveStatus("saving");

        saveCompletedRun(newStats, ending, nextChoices)
          .then(() => setSaveStatus("saved"))
          .catch((error) => {
            console.error("Could not save run:", error);
            setSaveStatus("error");
          });
      }
    } else {
      setCurrentGateIndex(currentGateIndex + 1);
    }
  };

  if (screen === "start") {
    return (
      <StartScreen
        onStart={handleStart}
        onHost={() => setScreen("host")}
      />
    );
  }

  if (screen === "host") {
    return <HostScreen onBack={() => setScreen("start")} />;
  }

  if (screen === "game") {
    return (
      <RunnerScreen
        gate={gates[currentGateIndex]}
        gateNumber={currentGateIndex + 1}
        totalGates={gates.length}
        stats={stats}
        onChoose={handleChoose}
      />
    );
  }

  return (
    <ResultScreen
      stats={finalRun?.stats ?? stats}
      choices={finalRun?.choices ?? choices}
      ending={finalRun?.ending ?? getEnding(stats, choices)}
      saveStatus={saveStatus}
      onRestart={handleStart}
      onMainMenu={handleMainMenu}
    />
  );
}
