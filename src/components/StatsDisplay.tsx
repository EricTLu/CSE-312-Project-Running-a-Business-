import type { Stats } from "../gameData";
import { getStatDisplayItems, STAT_DISPLAY_MAX } from "../statDisplay";

type Props = {
  stats: Stats;
};

export default function StatsDisplay({ stats }: Props) {
  const statItems = getStatDisplayItems(stats);

  return (
    <div className="stat-strip" aria-label="Current system stats">
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
  );
}
