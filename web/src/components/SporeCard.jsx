import { Link } from "react-router-dom";
import { displaySporeHealthLabel } from "../utils/displayLabels";
import { calculateSporeHealth } from "../utils/logic";
import { sporeVibeLabel } from "../utils/sporeDisplay";

function healthClass(label) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

function SporeCard({ spore }) {
  const health = calculateSporeHealth(spore);
  const vibe = sporeVibeLabel(health.score);

  return (
    <article className="card spore-card-inner">
      <div className="card-top">
        <div>
          <h3>{spore.name}</h3>
          <p className="spore-meta">
            {spore.type} · {spore.members.length} member{spore.members.length !== 1 ? "s" : ""}
          </p>
        </div>
        <span className={`badge badge-${healthClass(health.label)}`}>
          {displaySporeHealthLabel(health.label)}
        </span>
      </div>
      <div className="health-bar" aria-hidden>
        <div
          className={`health-bar-fill ${healthClass(health.label)}`}
          style={{ width: `${health.score}%` }}
        />
      </div>
      <div style={{ marginTop: "0.65rem", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.75rem" }}>
        <span className={`home-spore-card__status home-spore-card__status--${vibe.key}`}>
          {vibe.label}
        </span>
        <span className="spore-trend">Steady rhythm</span>
      </div>
      <div className="card-bottom">
        <span className="muted">Overall warmth</span>
        <Link className="link-button" to={`/spore/${spore.id}`}>
          Step inside
        </Link>
      </div>
    </article>
  );
}

export default SporeCard;
