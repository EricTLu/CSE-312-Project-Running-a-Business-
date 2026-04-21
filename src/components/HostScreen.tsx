import { useEffect, useState } from "react";
import { onValue, ref, remove } from "firebase/database";
import { db } from "../firebase";
import { getDashboardSummary, possibleDashboardOutcomes } from "../dashboardSummary";
import { toggleAppFullscreen } from "../fullscreen";
import { getStatDisplayItems, STAT_DISPLAY_MAX, type StatTone } from "../statDisplay";
import { averageStats, recentRuns, type StoredRun } from "../runAnalytics";

type StatCardProps = {
  label: string;
  value: number;
  tone?: StatTone | "dark";
};

function StatCard({ label, value, tone = "blue" }: StatCardProps) {
  return (
    <div className={`host-stat-card tone-${tone}`}>
      <span>{label}</span>
      <strong>
        {value} / {STAT_DISPLAY_MAX}
      </strong>
      <div className="host-bar" aria-hidden="true">
        <div style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function HostScreen({ onBack }: { onBack: () => void }) {
  const [runs, setRuns] = useState<StoredRun[]>([]);
  const [fullscreenError, setFullscreenError] = useState(false);
  const [showOtherOutcomes, setShowOtherOutcomes] = useState(false);

  useEffect(() => {
    const runsRef = ref(db, "runs");

    const unsubscribe = onValue(runsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setRuns(Object.values(data) as StoredRun[]);
    });

    return () => unsubscribe();
  }, []);

  const clearStats = async () => {
    await remove(ref(db, "runs"));
  };

  const handleFullscreen = async () => {
    try {
      await toggleAppFullscreen();
      setFullscreenError(false);
    } catch (error) {
      console.warn("Dashboard fullscreen was blocked:", error);
      setFullscreenError(true);
    }
  };

  const averages = averageStats(runs);
  const averageDisplayItems = getStatDisplayItems(averages);
  const dashboardSummary = getDashboardSummary(averages, runs.length);
  const latestRuns = recentRuns(runs, 5);

  return (
    <main className="screen screen-host">
      <section className="host-mobile-message">
        <h1>Host Dashboard</h1>
        <p>Host dashboard is available on desktop only.</p>
        <button className="secondary-button" onClick={onBack}>
          Back
        </button>
      </section>

      <section className="host-dashboard">
        <header className="host-header">
          <div>
            <p className="eyebrow">Teacher view</p>
            <h1>Host Dashboard</h1>
          </div>
          <div className="host-actions">
            <button className="secondary-button" onClick={handleFullscreen}>
              Enter Fullscreen Dashboard
            </button>
            <button className="secondary-button" onClick={onBack}>
              Back
            </button>
          </div>
        </header>

        {fullscreenError && (
          <p className="fullscreen-help">Fullscreen was blocked. Try the browser fullscreen control instead.</p>
        )}

        <section className="host-grid" aria-label="Dashboard stats">
          <div className="host-total-card">
            <span>Total Runs</span>
            <strong>{runs.length}</strong>
            <p>Completed player sessions saved in Firebase.</p>
          </div>
          {averageDisplayItems.map((item) => (
            <StatCard key={item.key} label={`Avg ${item.label}`} value={item.value} tone={item.tone} />
          ))}
        </section>

        <section className="host-bottom-grid">
          <div className="dashboard-summary host-panel">
            <div className="interpretation-heading">
              <div>
                <p className="eyebrow">Class Interpretation</p>
                <h2>{dashboardSummary.title}</h2>
              </div>
              <button
                className="secondary-button outcomes-button"
                onClick={() => setShowOtherOutcomes((current) => !current)}
              >
                {showOtherOutcomes ? "Hide Other Outcomes" : "Other Possible Outcomes"}
              </button>
            </div>
            <p>{dashboardSummary.summary}</p>

            {showOtherOutcomes && (
              <div className="outcomes-panel">
                {possibleDashboardOutcomes.map((outcome) => (
                  <article key={outcome.pattern} className="outcome-item">
                    <span>{outcome.pattern}</span>
                    <h3>{outcome.title}</h3>
                    <p>{outcome.summary}</p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="choice-path host-panel">
            <p className="eyebrow">Recent endings</p>
            {latestRuns.length === 0 && <p>No runs saved yet.</p>}
            {latestRuns.map((run, index) => (
              <p key={index}>
                {"endingTitle" in run ? run.endingTitle : "Older saved run"}
              </p>
            ))}
          </div>
        </section>

        <footer className="host-footer">
          <button className="danger-button" onClick={clearStats}>
            Clear Stats
          </button>
        </footer>
      </section>
    </main>
  );
}
