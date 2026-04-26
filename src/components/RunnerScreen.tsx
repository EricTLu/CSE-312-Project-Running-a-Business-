import { useCallback, useEffect, useRef, useState } from "react";
import type { ChoiceSide, Gate, Stats } from "../gameData";
import BottomControls from "./BottomControls";
import StatsDisplay from "./StatsDisplay";
import { toggleAppFullscreen } from "../fullscreen";
import Player, { type PlayerType } from "./Player";

type Props = {
  gate: Gate;
  gateNumber: number;
  totalGates: number;
  stats: Stats;
  onChoose: (side: ChoiceSide) => void;
};

const RUN_DURATION_MS = 7200;
const BOOST_MULTIPLIER = 2.2;
const BOOST_DURATION_MS = 950;
const PLAYER_TYPE: PlayerType = "mascotSheet";

export default function RunnerScreen({
  gate,
  gateNumber,
  totalGates,
  stats,
  onChoose,
}: Props) {
  const [lane, setLane] = useState<ChoiceSide>("left");
  const [progress, setProgress] = useState(0);
  const [resolving, setResolving] = useState(false);
  const [boosted, setBoosted] = useState(false);
  const [fullscreenError, setFullscreenError] = useState(false);
  const laneRef = useRef<ChoiceSide>("left");
  const onChooseRef = useRef(onChoose);
  const resolvedRef = useRef(false);
  const progressRef = useRef(0);
  const boostUntilRef = useRef(0);
  const boostTimeoutRef = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    onChooseRef.current = onChoose;
  }, [onChoose]);

  const chooseLane = useCallback(
    (nextLane: ChoiceSide) => {
      if (resolving) return;
      laneRef.current = nextLane;
      setLane(nextLane);
    },
    [resolving]
  );

  const triggerBoost = useCallback(() => {
    if (resolving) return;

    boostUntilRef.current = performance.now() + BOOST_DURATION_MS;
    setBoosted(true);
    window.clearTimeout(boostTimeoutRef.current);
    boostTimeoutRef.current = window.setTimeout(() => {
      setBoosted(false);
    }, BOOST_DURATION_MS);
  }, [resolving]);

  const handleFullscreenToggle = async () => {
    try {
      await toggleAppFullscreen();
      setFullscreenError(false);
    } catch (error) {
      console.warn("Fullscreen toggle was blocked:", error);
      setFullscreenError(true);
    }
  };

  useEffect(() => {
    laneRef.current = "left";
    resolvedRef.current = false;
    progressRef.current = 0;
    boostUntilRef.current = 0;
    touchStart.current = null;
    window.clearTimeout(boostTimeoutRef.current);
    setLane("left");
    setProgress(0);
    setResolving(false);
    setBoosted(false);
    setFullscreenError(false);
  }, [gate.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        chooseLane("left");
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        chooseLane("right");
      }

      if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
        triggerBoost();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [chooseLane, triggerBoost]);

  useEffect(() => {
    let lastTick = performance.now();

    const interval = window.setInterval(() => {
      const now = performance.now();
      const delta = now - lastTick;
      lastTick = now;

      const speed = now < boostUntilRef.current ? BOOST_MULTIPLIER : 1;
      const nextProgress = Math.min(
        progressRef.current + (delta / RUN_DURATION_MS) * 100 * speed,
        100
      );

      progressRef.current = nextProgress;
      setProgress(nextProgress);

      if (nextProgress >= 100 && !resolvedRef.current) {
        resolvedRef.current = true;
        setResolving(true);
        setBoosted(false);
        window.clearInterval(interval);

        window.setTimeout(() => {
          onChooseRef.current(laneRef.current);
        }, 260);
      }
    }, 33);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(boostTimeoutRef.current);
    };
  }, [gate.id]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStart.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStart.current === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStart.current.x;
    const deltaY = event.changedTouches[0].clientY - touchStart.current.y;
    const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX);

    if (isVerticalSwipe && deltaY < -45) {
      triggerBoost();
    } else if (!isVerticalSwipe && deltaX < -35) {
      chooseLane("left");
    } else if (!isVerticalSwipe && deltaX > 35) {
      chooseLane("right");
    }

    touchStart.current = null;
  };

  const gateScale = 0.96 + progress * 0.0012;
  const gateTop = 12 + (100 - progress) * 0.08;
  const playerTop = 78 - progress * 0.5;

  return (
    <main className="screen screen-game">
      <section className="game-phone">
        <header className="game-header">
          <div>
            <p className="eyebrow">Option {gateNumber} of {totalGates}</p>
            <h1>Choose an Option</h1>
          </div>
          <button className="fullscreen-button" onClick={handleFullscreenToggle}>
            Fullscreen
          </button>
        </header>
        {fullscreenError && (
          <p className="fullscreen-help">Use the browser fullscreen control if this button is blocked.</p>
        )}

        <div
          className={`runner-stage ${boosted ? "boosted" : ""}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="road" />
          <div className="lane-divider" />
          <div className="approach-line" />
          {boosted && <div className="boost-label">Fast forward</div>}

          <div
            className="gate-row"
            style={{
              top: `${gateTop}%`,
              transform: `translateX(-50%) scale(${gateScale})`,
            }}
          >
            <div className={`gate-card gate-left ${lane === "left" ? "selected" : ""}`}>
              <span>Left</span>
              <div className="gate-icon" aria-hidden="true">{gate.left.icon}</div>
              <strong>{gate.left.label}</strong>
            </div>
            <div className={`gate-card gate-right ${lane === "right" ? "selected" : ""}`}>
              <span>Right</span>
              <div className="gate-icon" aria-hidden="true">{gate.right.icon}</div>
              <strong>{gate.right.label}</strong>
            </div>
          </div>

          <Player lane={lane} resolving={resolving} topPercent={playerTop} type={PLAYER_TYPE} />

          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <BottomControls lane={lane} resolving={resolving} onMove={chooseLane} />
        <StatsDisplay stats={stats} />
      </section>
    </main>
  );
}
