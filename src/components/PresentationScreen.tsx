import { useEffect, useMemo, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "../firebase";
import { getDashboardSummary } from "../dashboardSummary";
import { exitAppFullscreen, requestAppFullscreen } from "../fullscreen";
import { averageStats, type StoredRun } from "../runAnalytics";
import { getStatDisplayItems, STAT_DISPLAY_MAX } from "../statDisplay";

type Props = {
  onBack: () => void;
};

const PHONE_PLAY_URL = "http://172.24.23.243:5173/";

const slides = [
  { type: "image", src: "/presentation-slides/1.png", alt: "Presentation slide 1" },
  { type: "image", src: "/presentation-slides/2.png", alt: "Presentation slide 2" },
  { type: "image", src: "/presentation-slides/3.png", alt: "Presentation slide 3" },
  { type: "qr", title: "Play one run" },
  { type: "liveStats", title: "Data" },
  { type: "image", src: "/presentation-slides/6.png", alt: "Presentation slide 6" },
  { type: "image", src: "/presentation-slides/7.png", alt: "Presentation slide 7" },
  { type: "image", src: "/presentation-slides/8.png", alt: "Presentation slide 8" },
  { type: "image", src: "/presentation-slides/9.png", alt: "Presentation slide 9" },
  { type: "image", src: "/presentation-slides/10.png", alt: "Presentation slide 10" },
] as const;

function getPlayUrl() {
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return PHONE_PLAY_URL;
  }

  return window.location.origin;
}

export default function PresentationScreen({ onBack }: Props) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [fullscreenError, setFullscreenError] = useState(false);
  const [runs, setRuns] = useState<StoredRun[]>([]);
  const [showQrFullscreen, setShowQrFullscreen] = useState(false);
  const currentSlide = slides[slideIndex];
  const playUrl = useMemo(() => getPlayUrl(), []);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=${encodeURIComponent(playUrl)}`;
  const largeQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=520x520&data=${encodeURIComponent(playUrl)}`;
  const averageRunStats = averageStats(runs);
  const statItems = getStatDisplayItems(averageRunStats);
  const liveSummary = getDashboardSummary(averageRunStats, runs.length);

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
  }, [onBack]);

  const enterFullscreen = async () => {
    try {
      await requestAppFullscreen();
      setFullscreenError(false);
    } catch (error) {
      console.warn("Presentation fullscreen was blocked:", error);
      setFullscreenError(true);
    }
  };

  const openQrFullscreen = async () => {
    setShowQrFullscreen(true);

    try {
      await requestAppFullscreen();
      setFullscreenError(false);
    } catch (error) {
      console.warn("QR fullscreen request was blocked:", error);
      setFullscreenError(true);
    }
  };

  const closeQrFullscreen = async () => {
    setShowQrFullscreen(false);

    try {
      await exitAppFullscreen();
    } catch (error) {
      console.warn("Could not exit fullscreen:", error);
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
            <strong>
              {slideIndex + 1} / {slides.length}
            </strong>
          </div>
          <div className="presentation-actions">
            <button onClick={enterFullscreen}>Fullscreen</button>
            <button onClick={onBack}>Main Menu</button>
          </div>
        </header>

        {fullscreenError && (
          <p className="presentation-error">Fullscreen was blocked. Use the browser control if needed.</p>
        )}

        {currentSlide.type === "image" && (
          <article className="presentation-slide presentation-image-slide">
            <img className="presentation-slide-image" src={currentSlide.src} alt={currentSlide.alt} />
          </article>
        )}

        {currentSlide.type === "qr" && (
          <article className="presentation-slide slide-qr">
            <div className="presentation-copy">
              <p className="menu-kicker">CSE 312 Project - Eric Lu</p>
              <h1>{currentSlide.title}</h1>
              <div className="presentation-bullets presentation-qr-bullets">
                <p>Scan the QR code.</p>
                <p>Complete one run.</p>
                <p>Make choices you would actually make.</p>
                <p>We&apos;ll look at the class results after.</p>
              </div>
            </div>

            <div className="presentation-window qr-presentation-card">
              <div className="window-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <img src={qrCodeUrl} alt="QR code to play Run a Business" />
              <h2>Scan to join</h2>
              <p>{playUrl}</p>
              <button className="secondary-button presentation-qr-button" onClick={openQrFullscreen}>
                Fullscreen QR Code
              </button>
            </div>
          </article>
        )}

        {currentSlide.type === "liveStats" && (
          <article className="presentation-slide slide-liveStats">
            <div className="presentation-copy presentation-data-header">
              <p className="menu-kicker">CSE 312 Project - Eric Lu</p>
              <h1>{currentSlide.title}</h1>
              <div className="presentation-data-qr">
                <img src={qrCodeUrl} alt="QR code to join the game from the data slide" />
                <button className="secondary-button presentation-data-qr-button" onClick={openQrFullscreen}>
                  Fullscreen QR
                </button>
              </div>
            </div>

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

            <div className="presentation-live-summary">
              <span>Live Interpretation</span>
              <h2>{liveSummary.title}</h2>
              <p>{liveSummary.summary}</p>
            </div>
          </article>
        )}

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

      {showQrFullscreen && (
        <div className="qr-fullscreen" role="dialog" aria-modal="true" aria-label="Fullscreen QR code">
          <button className="qr-close-button" onClick={closeQrFullscreen}>
            Close
          </button>
          <div className="qr-fullscreen-content">
            <p className="menu-kicker">Scan to join</p>
            <h1>Run a Business</h1>
            <img src={largeQrCodeUrl} alt="QR code to play Run a Business" />
            <p>{playUrl}</p>
          </div>
        </div>
      )}
    </main>
  );
}
