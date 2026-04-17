import type { PlayerChoice, Stats } from "../gameData";
import type { Ending } from "../resultTakeaways";
import { getComparisonStats } from "../comparisonStats";
import { getStatDisplayItems, STAT_DISPLAY_MAX } from "../statDisplay";

type Props = {
  stats: Stats;
  choices: PlayerChoice[];
  ending: Ending;
  saveStatus: "idle" | "saving" | "saved" | "error";
  onRestart: () => void;
  onMainMenu: () => void;
};

const saveMessages = {
  idle: "Run ready.",
  saving: "Saving run data...",
  saved: "Run saved to the host dashboard.",
  error: "Run finished, but the save did not complete. Check Firebase setup.",
};

export default function ResultScreen({
  stats,
  choices,
  ending,
  saveStatus,
  onRestart,
  onMainMenu,
}: Props) {
  const comparisonStats = getComparisonStats(stats, choices);
  const statItems = getStatDisplayItems(stats);

  return (
    <main className="screen screen-result">
      <section className="phone-shell result-card">
        <p className="eyebrow">Run complete</p>
        <h1>{ending.title}</h1>
        <p className="takeaway">{ending.takeaway}</p>

        <div className="result-stats">
          {statItems.map((item) => (
            <div key={item.key} className={`stat-pill tone-${item.tone}`}>
              <span>{item.label}</span>
              <strong>
                {item.value} / {STAT_DISPLAY_MAX}
              </strong>
              <div className="stat-mini-bar" aria-hidden="true">
                <div style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="comparison-card">
          <h2>Compared With Other Players</h2>
          {comparisonStats.map((comparison) => (
            <div key={comparison.label} className="comparison-item">
              <strong>
                <span className="comparison-percent">{comparison.percent}%</span>
                <span>{comparison.label}</span>
              </strong>
              <p>{comparison.text}</p>
            </div>
          ))}
        </div>

        <div className="choice-path">
          <h2>Your Path</h2>
          {choices.map((choice) => (
            <p key={choice.gateId}>
              Option {choice.gateNumber}: {choice.side.toUpperCase()} - {choice.label}
            </p>
          ))}
        </div>

        <p className={`save-status save-${saveStatus}`}>{saveMessages[saveStatus]}</p>

        <div className="button-row">
          <button className="primary-button" onClick={onRestart}>
            Play Again
          </button>
          <button className="secondary-button" onClick={onMainMenu}>
            Main Menu
          </button>
        </div>
      </section>
    </main>
  );
}
