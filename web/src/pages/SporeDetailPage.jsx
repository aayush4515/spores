import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import PageSkeleton from "../components/PageSkeleton";
import Toast from "../components/Toast";
import { useAppState } from "../context/AppStateContext";
import useFakeLoading from "../hooks/useFakeLoading";
import { displaySporeHealthLabel, displaySupportLevelLabel } from "../utils/displayLabels";
import {
  calculateSporeHealth,
  getActivityStatus,
  getSporeById,
  getSupportLevel,
  getWorkIntensity,
} from "../utils/logic";

function activityIcon(key) {
  const map = {
    very_active: "fitness_center",
    active: "directions_run",
    steady: "avg_pace",
    low_activity: "directions_walk",
    inactive: "cottage",
  };
  return map[key] ?? "avg_pace";
}

function workIcon(level) {
  const map = {
    overworking: "local_fire_department",
    balanced: "laptop_mac",
    low_engagement: "schedule",
  };
  return map[level] ?? "laptop_mac";
}

function SporeDetailPage() {
  const { sporeId } = useParams();
  const { state, addSignal } = useAppState();
  const [toastMessage, setToastMessage] = useState("");
  const [confirmSignalFor, setConfirmSignalFor] = useState(null);
  const isLoading = useFakeLoading();

  const sourceSpore = getSporeById(state.spores, sporeId);

  const membersWithSupport = useMemo(
    () =>
      (sourceSpore?.members ?? []).map((member) => ({
        ...member,
        support: getSupportLevel(member),
        activity: getActivityStatus(member),
        work: getWorkIntensity(member),
      })),
    [sourceSpore]
  );

  const health = sourceSpore ? calculateSporeHealth(sourceSpore) : null;

  if (!sourceSpore) {
    return (
      <section>
        <Link className="back-link" to="/spores">
          &larr; My Spores
        </Link>
        <PageHeader title="Spore not found" subtitle="Choose a spore from My Spores." />
      </section>
    );
  }

  if (isLoading) return <PageSkeleton cards={3} />;

  const healthClass = health.label.toLowerCase().replace(/\s+/g, "-");

  function handleConfirmSignal() {
    if (!confirmSignalFor) return;
    addSignal(sourceSpore.id, confirmSignalFor.id);
    setToastMessage(`Noted—we'll keep an eye on ${confirmSignalFor.name}.`);
    setConfirmSignalFor(null);
  }

  return (
    <section>
      <Link className="back-link" to="/spores">
        &larr; My Spores
      </Link>
      <PageHeader
        title={sourceSpore.name}
        subtitle={`${sourceSpore.type} · ${sourceSpore.members.length} member${sourceSpore.members.length !== 1 ? "s" : ""}`}
      />

      <div className="page-section">
        <article className="card" style={{ maxWidth: "420px" }}>
          <p className="section-label" style={{ marginBottom: "0.5rem" }}>
            How the group is doing
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.65rem", flexWrap: "wrap" }}>
            <span className={`badge badge-${healthClass}`}>
              {displaySporeHealthLabel(health.label)}
            </span>
          </div>
          <div className="health-bar" style={{ marginTop: "1rem" }} aria-hidden>
            <div className={`health-bar-fill ${healthClass}`} style={{ width: `${health.score}%` }} />
          </div>
        </article>
      </div>

      <div className="page-section">
        <h3 className="section-label">People here</h3>
        <div className="member-grid">
          {membersWithSupport.map((member) => (
            <article className="card member-card-simple" key={member.id}>
              <div className="card-top">
                <h3>{member.name}</h3>
                <span className={`badge badge-${member.support.label}`}>
                  {displaySupportLevelLabel(member.support.label)}
                </span>
              </div>
              <p className="member-msg">{member.support.message}</p>
              <div className="member-activity-today" aria-label="Activity today">
                <span
                  className="material-symbols-outlined member-activity-today__icon"
                  aria-hidden
                >
                  {activityIcon(member.activity.key)}
                </span>
                <div className="member-activity-today__text">
                  <span className="member-activity-today__label">Activity today</span>
                  <span
                    className={`activity-pill activity-pill--${member.activity.key}`}
                  >
                    {member.activity.label}
                  </span>
                </div>
              </div>
              <div className="member-activity-today" aria-label="Work status">
                <span
                  className="material-symbols-outlined member-activity-today__icon"
                  aria-hidden
                >
                  {workIcon(member.work.level)}
                </span>
                <div className="member-activity-today__text">
                  <span className="member-activity-today__label">Work status</span>
                  <span
                    className={`activity-pill work-pill--${member.work.level}`}
                  >
                    {member.work.level === "overworking"
                      ? "Overworking"
                      : member.work.level === "low_engagement"
                        ? "Low engagement"
                        : "Balanced"}
                  </span>
                </div>
              </div>
              <div className="card-bottom">
                <Link className="link-button" to={`/member/${member.id}`}>
                  View profile
                </Link>
                <button
                  className="ghost-button"
                  onClick={() => setConfirmSignalFor(member)}
                  type="button"
                >
                  Flag concern
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {confirmSignalFor && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="flag-concern-title"
        >
          <div className="modal-panel" style={{ maxWidth: "26rem" }}>
            <div className="modal-header">
              <h3 id="flag-concern-title">Flag a concern?</h3>
            </div>
            <div className="modal-body">
              <p style={{ margin: 0, color: "var(--text-soft)", lineHeight: 1.55 }}>
                This will gently raise{" "}
                <strong>{confirmSignalFor.name}&apos;s</strong> support
                priority so Spore pays closer attention. It&apos;s not a message
                to them—just a private note for your circle.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="ghost-button"
                onClick={() => setConfirmSignalFor(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="link-button"
                onClick={handleConfirmSignal}
                type="button"
              >
                Yes, flag concern
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toastMessage} />
    </section>
  );
}

export default SporeDetailPage;
