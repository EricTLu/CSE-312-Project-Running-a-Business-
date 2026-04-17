import { useEffect, useState } from "react";
import type { ChoiceSide } from "../gameData";

export type PlayerType = "arrow" | "human" | "mascot" | "mascotSheet" | "pixel";

type Props = {
  lane: ChoiceSide;
  resolving: boolean;
  topPercent: number;
  type?: PlayerType;
  mascotSrc?: string;
  spriteSheetSrc?: string;
};

export default function Player({
  lane,
  resolving,
  topPercent,
  type = "pixel",
  mascotSrc,
  spriteSheetSrc,
}: Props) {
  const resolvedSpriteSheetSrc = spriteSheetSrc ?? "/wolfie-forward-walk-strip.png";
  const [spriteReady, setSpriteReady] = useState(false);

  useEffect(() => {
    if (type !== "mascotSheet") return;

    const image = new Image();
    image.onload = () => setSpriteReady(true);
    image.onerror = () => setSpriteReady(false);
    image.src = resolvedSpriteSheetSrc;
  }, [resolvedSpriteSheetSrc, type]);

  return (
    <div
      className={`player player-${lane} player-type-${type} ${resolving ? "player-resolving" : ""}`}
      style={{ top: `${topPercent}%` }}
      aria-label="You"
    >
      {type === "arrow" && (
        <>
          <span className="player-arrow">{"\u25B2"}</span>
          <span className="player-label">YOU</span>
        </>
      )}

      {type === "human" && (
        <span className="player-figure" aria-hidden="true">
          <span className="figure-head" />
          <span className="figure-body" />
          <span className="figure-legs" />
        </span>
      )}

      {type === "pixel" && (
        <span className="pixel-runner" aria-hidden="true">
          <svg className="pixel-frame frame-1" viewBox="0 0 16 16" shapeRendering="crispEdges">
            <rect x="5" y="1" width="6" height="2" fill="#d52027" />
            <rect x="4" y="3" width="8" height="2" fill="#b10d18" />
            <rect x="5" y="5" width="6" height="3" fill="#f1c7a4" />
            <rect x="4" y="8" width="8" height="4" fill="#1d1d1f" />
            <rect x="3" y="9" width="2" height="2" fill="#f1c7a4" />
            <rect x="11" y="9" width="2" height="2" fill="#f1c7a4" />
            <rect x="5" y="12" width="2" height="3" fill="#2f6fdd" />
            <rect x="9" y="12" width="2" height="3" fill="#2f6fdd" />
            <rect x="4" y="15" width="3" height="1" fill="#1d1d1f" />
            <rect x="9" y="15" width="3" height="1" fill="#1d1d1f" />
          </svg>
          <svg className="pixel-frame frame-2" viewBox="0 0 16 16" shapeRendering="crispEdges">
            <rect x="5" y="1" width="6" height="2" fill="#d52027" />
            <rect x="4" y="3" width="8" height="2" fill="#b10d18" />
            <rect x="5" y="5" width="6" height="3" fill="#f1c7a4" />
            <rect x="4" y="8" width="8" height="4" fill="#1d1d1f" />
            <rect x="2" y="8" width="2" height="3" fill="#f1c7a4" />
            <rect x="12" y="10" width="2" height="3" fill="#f1c7a4" />
            <rect x="4" y="12" width="2" height="3" fill="#2f6fdd" />
            <rect x="10" y="12" width="2" height="3" fill="#2f6fdd" />
            <rect x="3" y="15" width="3" height="1" fill="#1d1d1f" />
            <rect x="10" y="15" width="3" height="1" fill="#1d1d1f" />
          </svg>
          <svg className="pixel-frame frame-3" viewBox="0 0 16 16" shapeRendering="crispEdges">
            <rect x="5" y="1" width="6" height="2" fill="#d52027" />
            <rect x="4" y="3" width="8" height="2" fill="#b10d18" />
            <rect x="5" y="5" width="6" height="3" fill="#f1c7a4" />
            <rect x="4" y="8" width="8" height="4" fill="#1d1d1f" />
            <rect x="3" y="10" width="2" height="2" fill="#f1c7a4" />
            <rect x="11" y="8" width="2" height="3" fill="#f1c7a4" />
            <rect x="5" y="12" width="2" height="3" fill="#2f6fdd" />
            <rect x="9" y="12" width="2" height="3" fill="#2f6fdd" />
            <rect x="4" y="15" width="3" height="1" fill="#1d1d1f" />
            <rect x="9" y="15" width="3" height="1" fill="#1d1d1f" />
          </svg>
          <svg className="pixel-frame frame-4" viewBox="0 0 16 16" shapeRendering="crispEdges">
            <rect x="5" y="1" width="6" height="2" fill="#d52027" />
            <rect x="4" y="3" width="8" height="2" fill="#b10d18" />
            <rect x="5" y="5" width="6" height="3" fill="#f1c7a4" />
            <rect x="4" y="8" width="8" height="4" fill="#1d1d1f" />
            <rect x="2" y="10" width="2" height="3" fill="#f1c7a4" />
            <rect x="12" y="8" width="2" height="3" fill="#f1c7a4" />
            <rect x="4" y="12" width="2" height="3" fill="#2f6fdd" />
            <rect x="10" y="12" width="2" height="3" fill="#2f6fdd" />
            <rect x="3" y="15" width="3" height="1" fill="#1d1d1f" />
            <rect x="10" y="15" width="3" height="1" fill="#1d1d1f" />
          </svg>
        </span>
      )}

      {type === "mascot" && (
        <>
          {mascotSrc ? (
            <img className="player-mascot-image" src={mascotSrc} alt="" />
          ) : (
            // Add a real mascot image to public/stony-brook-mascot.png, then pass mascotSrc.
            <span className="player-mascot-placeholder" aria-hidden="true">
              SB
            </span>
          )}
        </>
      )}

      {type === "mascotSheet" && (
        <>
          {spriteReady ? (
            <span
              className="mascot-sprite"
              style={{
                // This expects a transparent 4-frame horizontal strip in public/wolfie-forward-walk-strip.png.
                backgroundImage: `url(${resolvedSpriteSheetSrc})`,
              }}
              aria-hidden="true"
            />
          ) : (
            <span className="player-mascot-placeholder" aria-hidden="true">
              SB
            </span>
          )}
        </>
      )}
    </div>
  );
}
