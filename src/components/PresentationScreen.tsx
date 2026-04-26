import { useEffect, useMemo, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "../firebase";
import { getDashboardSummary } from "../dashboardSummary";
import { requestAppFullscreen } from "../fullscreen";
import { averageStats, recentRuns, type StoredRun } from "../runAnalytics";
import { getStatDisplayItems, STAT_DISPLAY_MAX } from "../statDisplay";

type Props = {
  onBack: () => void;
};

const PHONE_PLAY_URL = "http://172.24.23.243:5173/";

function getPlayUrl() {
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return PHONE_PLAY_URL;
  }

  return window.location.origin;
}

export default function PresentationScreen({ onBack }: Props) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [runs, setRuns] = useState<StoredRun[]>([]);
  const [fullscreenError, setFullscreenError] = useState(false);

  const playUrl = useMemo(() => getPlayUrl(), []);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=${encodeURIComponent(playUrl)}`;
  const averages = averageStats(runs);
  const statItems = getStatDisplayItems(averages);
  const summary = getDashboardSummary(averages, runs.length);
  const latestRuns = recentRuns(runs, 3);

  const slides = [
    {
      eyebrow: "CSE 312 Project",
      title: "Run a Business",
      subtitle: "An interactive simulation of decision-making in platform systems.",
      type: "cover",
    },
    {
      eyebrow: "Before we play",
      title: "How the game works",
      bullets: [
        "Your character runs forward automatically.",
        "Before each option, move left or right to choose.",
        "Use arrow keys, A/D, touch buttons, or swipes.",
      ],
      type: "text",
    },
    {
      eyebrow: "What it tracks",
      title: "What is tracked",
      bullets: [
        "There are no good or bad options. They are tradeoffs.",
        "Profit: how much the business gains.",
        "Visibility: how much attention the business gets.",
        "Dependence and strain: how much outside pressure the path creates.",
      ],
      type: "text",
    },
    {
      eyebrow: "Live game",
      title: "Scan the code and play one run.",
      bullets: [
        "Make choices that seem reasonable in the moment.",
        "The game saves the final stats when each run ends.",
        "After everyone plays, we will look at the class pattern.",
      ],
      type: "qr",
    },
    {
      eyebrow: "Live class results",
      title: "Now the room becomes the dataset.",
      subtitle: "As runs finish, the class averages update from Firebase in real time.",
      type: "liveStats",
    },
    {
      eyebrow: "What the results mean",
      title: "The result depends on the final stat pattern.",
      bullets: [
        "High Profit + High Dependence means growth came with reliance.",
        "High Visibility + High Strain means attention also created pressure.",
        "Balanced stats show the system forcing tradeoffs between growth and control.",
      ],
      type: "interpretation",
    },
    {
      eyebrow: "Project argument",
      title: "This is a simplified simulation of how systems shape decisions.",
      bullets: [
        "The game is not trying to be a full platform.",
        "A real platform would need many more rules, incentives, and feedback loops.",
        "The simplified version keeps the pattern visible enough for a classroom demo.",
      ],
      type: "text",
    },
    {
      eyebrow: "Example",
      title: "A delivery app can make dependence feel like a normal business choice.",
      bullets: [
        "A restaurant joins an app to increase visibility and sales.",
        "That choice makes sense in the short term.",
        "Over time, fees, ranking, customer access, and app rules can reduce control.",
      ],
      type: "text",
    },
    {
      eyebrow: "Class connection",
      title: "The structure of a system can create predictable outcomes.",
      bullets: [
        "Individual choices can seem independent while still moving toward a dominant pattern.",
        "The game rewards profit and visibility, so players naturally move toward those outcomes.",
        "That is the gamification angle: the system makes certain behaviors feel like the obvious path.",
      ],
      type: "text",
    },
    {
      eyebrow: "Final thought",
      title: "The platform makes some choices easier to choose.",
      bullets: [
        "The point is not that players are making bad decisions.",
        "The point is that incentives can reward growth while producing dependence.",
        "A different system with different priorities might reward different choices.",
      ],
      type: "takeaway",
    },
  ];

  const currentSlide = slides[slideIndex];

  useEffect(() => {
    const runsRef = ref(db, "runs");
    const unsubscribe = onValue(runsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setRuns(Object.values(data) as StoredRun[]);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        setSlideIndex((current) => Math.min(current + 1, slides.length - 1));
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        setSlideIndex((current) => Math.max(current - 1, 0));
      }

      if (event.key === "Escape") {
        onBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack, slides.length]);

  const enterFullscreen = async () => {
    try {
      await requestAppFullscreen();
      setFullscreenError(false);
    } catch (error) {
      console.warn("Presentation fullscreen was blocked:", error);
      setFullscreenError(true);
    }
  };

  return (
    <main className="presentation-mode">
      <section className="presentation-mobile-message">
        <h1>Presentation Mode</h1>
        <p>Presentation Mode is available on desktop only.</p>
        <button className="secondary-button" onClick={onBack}>
          Back
        </button>
      </section>

      <section className="presentation-stage" aria-label="Presentation mode">
        <header className="presentation-topbar">
          <div>
            <span>Run a Business</span>
            <strong>{slideIndex + 1} / {slides.length}</strong>
          </div>
          <div className="presentation-actions">
            <button onClick={enterFullscreen}>Fullscreen</button>
            <button onClick={onBack}>Main Menu</button>
          </div>
        </header>

        {fullscreenError && <p className="presentation-error">Fullscreen was blocked. Use the browser control if needed.</p>}

        <article className={`presentation-slide slide-${currentSlide.type}`}>
          <div className="presentation-copy">
            <p className="menu-kicker">{currentSlide.eyebrow}</p>
            <h1>{currentSlide.title}</h1>
            {currentSlide.subtitle && <p className="presentation-subtitle">{currentSlide.subtitle}</p>}
            {"bullets" in currentSlide && currentSlide.bullets && (
              <div className="presentation-bullets">
                {currentSlide.bullets.map((bullet) => (
                  <p key={bullet}>{bullet}</p>
                ))}
              </div>
            )}
          </div>

          {currentSlide.type === "cover" && (
            <div className="presentation-window game-preview-window">
              <div className="window-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="presentation-mini-game">
                <h2>Choose an Option</h2>
                <div className="mini-road">
                  <div className="mini-option">🔒 Respect privacy</div>
                  <div className="mini-option selected">🎯 Targeted ads</div>
                  <div className="mini-runner">YOU</div>
                </div>
              </div>
            </div>
          )}

          {currentSlide.type === "qr" && (
            <div className="presentation-window qr-presentation-card">
              <div className="window-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <img src={qrCodeUrl} alt="QR code to play Run a Business" />
              <h2>Play on Your Phone</h2>
              <p>{playUrl}</p>
            </div>
          )}

          {currentSlide.type === "liveStats" && (
            <div className="presentation-live-panel">
              <div className="presentation-total">
                <span>Total Runs</span>
                <strong>{runs.length}</strong>
              </div>
              <div className="presentation-stat-grid">
                {statItems.map((item) => (
                  <div key={item.key} className={`presentation-stat tone-${item.tone}`}>
                    <span>{item.label}</span>
                    <strong>{item.value} / {STAT_DISPLAY_MAX}</strong>
                    <div className="host-bar" aria-hidden="true">
                      <div style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSlide.type === "interpretation" && (
            <div className="presentation-window interpretation-live-card">
              <p className="menu-kicker">Live dashboard reading</p>
              <h2>{summary.title}</h2>
              <p>{summary.summary}</p>
              <p className="dashboard-example">{summary.example}</p>
              <div className="recent-run-list">
                <span>Recent endings</span>
                {latestRuns.length === 0 && <p>No runs yet.</p>}
                {latestRuns.map((run, index) => (
                  <p key={index}>{"endingTitle" in run ? run.endingTitle : "Older saved run"}</p>
                ))}
              </div>
            </div>
          )}

          {currentSlide.type === "takeaway" && (
            <div className="presentation-final-mark">
              <span>Platform</span>
              <span>Incentives</span>
              <span>Choice</span>
            </div>
          )}
        </article>

        <footer className="presentation-controls">
          <button disabled={slideIndex === 0} onClick={() => setSlideIndex((current) => Math.max(current - 1, 0))}>
            Previous
          </button>
          <div className="presentation-progress">
            <div style={{ width: `${((slideIndex + 1) / slides.length) * 100}%` }} />
          </div>
          <button
            disabled={slideIndex === slides.length - 1}
            onClick={() => setSlideIndex((current) => Math.min(current + 1, slides.length - 1))}
          >
            Next
          </button>
        </footer>
      </section>
    </main>
  );
}
