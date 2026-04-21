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
      subtitle: "A live game about platform incentives, pressure, and choice.",
      type: "cover",
    },
    {
      eyebrow: "The question",
      title: "What happens when survival choices are shaped by a platform?",
      bullets: [
        "The project is not about players making bad choices.",
        "It asks why certain tradeoffs start to feel rational.",
        "The system rewards choices that can make leaving harder later.",
      ],
      type: "text",
    },
    {
      eyebrow: "Core idea",
      title: "Short-term survival can slowly become long-term dependence.",
      bullets: [
        "Visibility can bring pressure instead of freedom.",
        "Convenience can make a system harder to leave.",
        "Growth can look successful while autonomy shrinks.",
      ],
      type: "text",
    },
    {
      eyebrow: "How we will play",
      title: "Scan the code, make fast choices, and watch the class pattern form.",
      bullets: [
        "The runner moves automatically toward each option.",
        "Players choose left or right before reaching the option.",
        "Every finished run saves the final stats and path.",
      ],
      type: "qr",
    },
    {
      eyebrow: "Live class results",
      title: "The room is producing data right now.",
      subtitle: "As runs finish, these averages update from Firebase in real time.",
      type: "liveStats",
    },
    {
      eyebrow: "Class interpretation",
      title: summary.title,
      subtitle: summary.summary,
      type: "interpretation",
    },
    {
      eyebrow: "Takeaway",
      title: "The platform makes some choices easier to choose.",
      bullets: [
        "This game is not about one perfect business strategy.",
        "It is about how repeated incentives normalize hidden costs.",
        "The final question is not only what players chose, but what the system made practical.",
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
                  <div className="mini-option">Keep Control</div>
                  <div className="mini-option selected">Boost Reach</div>
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
