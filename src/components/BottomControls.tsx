import type { ChoiceSide } from "../gameData";

type Props = {
  lane: ChoiceSide;
  resolving: boolean;
  onMove: (lane: ChoiceSide) => void;
};

export default function BottomControls({ lane, resolving, onMove }: Props) {
  return (
    <div className="lane-controls" aria-label="Lane controls">
      <button
        className={lane === "left" ? "active" : ""}
        onClick={() => onMove("left")}
        disabled={resolving}
        aria-label="Move left"
      >
        {"\u2190"}
      </button>
      <button
        className={lane === "right" ? "active" : ""}
        onClick={() => onMove("right")}
        disabled={resolving}
        aria-label="Move right"
      >
        {"\u2192"}
      </button>
    </div>
  );
}
