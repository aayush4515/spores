import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppreciationModal from "../components/AppreciationModal";
import PageHeader from "../components/PageHeader";
import PageSkeleton from "../components/PageSkeleton";
import Toast from "../components/Toast";
import { useAppState } from "../context/AppStateContext";
import useFakeLoading from "../hooks/useFakeLoading";
import { displaySupportLevelLabel } from "../utils/displayLabels";
import {
  getActivityPrivacyInsights,
  getActivityStatus,
  getSupportLevel,
  getSupportReasons,
  getWorkIntensity,
  getWorkPrivacyInsights,
} from "../utils/logic";

function warmthLabel(engagement) {
  if (engagement >= 80) return "Strong bond";
  if (engagement >= 60) return "Growing warmth";
  if (engagement >= 40) return "Steady connection";
  return "Room to grow";
}

function MemberDetailPage() {
  const { memberId } = useParams();
  const { state, updateMember } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const isLoading = useFakeLoading();

  const memberContext = useMemo(
    () =>
      state.spores
        .flatMap((spore) => spore.members.map((member) => ({ member, spore })))
        .find((entry) => entry.member.id === memberId),
    [state.spores, memberId]
  );

  const currentSpore = memberContext?.spore ?? null;
  const memberState = memberContext?.member ?? null;

  if (!memberState) {
    return (
      <section>
        <Link className="back-link" to="/spores">
          &larr; My Spores
        </Link>
        <PageHeader title="Member not found" subtitle="They may no longer be in your spores." />
      </section>
    );
  }

  if (isLoading) return <PageSkeleton cards={4} />;

  const support = getSupportLevel(memberState);
  const reasons = getSupportReasons(memberState);
  const activityStatus = getActivityStatus(memberState);
  const activityInsights = getActivityPrivacyInsights(memberState);
  const workIntensity = getWorkIntensity(memberState);
  const workInsights = getWorkPrivacyInsights(memberState);
  const engagement = Number(memberState.positiveEngagement ?? 50);
  const memberSpores = state.spores.filter((spore) =>
    spore.members.some((m) => m.id === memberState.id)
  );

  function handleSendAppreciation({ message, increaseEngagement }) {
    if (increaseEngagement) {
      updateMember(memberState.id, (prev) => ({
        ...prev,
        positiveEngagement: Math.min(Number(prev.positiveEngagement ?? 50) + 5, 100),
      }));
    }
    setToastMessage(`Your words are on their way.`);
    setIsModalOpen(false);
  }

  const statusLine = [
    `Check-in: ${memberState.checkInStatus.replace(/_/g, " ")}`,
    `Rhythm: ${memberState.activityTrend.replace(/_/g, " ")}`,
  ].join(" · ");

  return (
    <section>
      {currentSpore ? (
        <Link className="back-link" to={`/spore/${currentSpore.id}`}>
          &larr; {currentSpore.name}
        </Link>
      ) : (
        <Link className="back-link" to="/spores">
          &larr; My Spores
        </Link>
      )}
      <PageHeader
        title={memberState.name}
        subtitle={currentSpore ? `With you in ${currentSpore.name}` : "Someone in your circle"}
        action={
          <button className="link-button" onClick={() => setIsModalOpen(true)} type="button">
            Send appreciation
          </button>
        }
      />

      <div className="member-stack">
        <article className="card support-summary-card">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.65rem" }}>
            <span className={`badge badge-${support.label}`} style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>
              {displaySupportLevelLabel(support.label)}
            </span>
          </div>
          <p className="lead">{support.message}</p>
          <p className="muted" style={{ marginTop: "0.75rem", marginBottom: 0, fontSize: "0.88rem" }}>
            {statusLine}
          </p>
        </article>

        <article className="card activity-insights-card">
          <h4>What we&apos;re noticing</h4>
          <p className="activity-insights-lead">
            <span className={`activity-pill activity-pill--${activityStatus.key}`}>
              {activityStatus.label}
            </span>
            <span className="muted activity-insights-sub">{activityStatus.message}</span>
          </p>
          <ul className="activity-insights-list">
            {activityInsights.map((line) => (
              <li key={line}>{line}</li>
            ))}
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </article>

        <article className="card work-insights-card">
          <h4>
            <span className="material-symbols-outlined work-insights-card__icon" aria-hidden>
              {workIntensity.level === "overworking"
                ? "local_fire_department"
                : workIntensity.level === "low_engagement"
                  ? "schedule"
                  : "laptop_mac"}
            </span>
            Work &amp; Study Insights
          </h4>
          <p className="activity-insights-lead">
            <span className={`activity-pill work-pill--${workIntensity.level}`}>
              {workIntensity.level === "overworking"
                ? "Overworking"
                : workIntensity.level === "low_engagement"
                  ? "Low engagement"
                  : "Balanced"}
            </span>
            <span className="muted activity-insights-sub">{workIntensity.message}</span>
          </p>
          <ul className="activity-insights-list">
            {workInsights.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h4>A gentle next step</h4>
          <p style={{ margin: "0.5rem 0 0", color: "var(--text-soft)", fontSize: "1rem", lineHeight: 1.55 }}>
            {support.recommendedAction}
          </p>
          <div className="actions-row" style={{ marginTop: "1.1rem" }}>
            <button className="link-button" onClick={() => setIsModalOpen(true)} type="button">
              Send appreciation
            </button>
            {currentSpore && (
              <Link className="ghost-button" to={`/spore/${currentSpore.id}`}>
                Back to spore
              </Link>
            )}
          </div>
        </article>

        <article className="card">
          <h4>Warmth shared</h4>
          <p className="muted" style={{ marginTop: "0.35rem", fontSize: "0.88rem" }}>
            A simple sense of connection—not a scoreboard.
          </p>
          <p className="stat-value" style={{ fontSize: "1.35rem", marginTop: "0.5rem" }}>
            {warmthLabel(engagement)}
          </p>
          <div className="health-bar" style={{ marginTop: "0.65rem" }} aria-hidden>
            <div className="health-bar-fill healthy" style={{ width: `${engagement}%` }} />
          </div>
        </article>

        <article className="card">
          <h4>Also in</h4>
          <ul className="plain-list" style={{ marginTop: "0.5rem" }}>
            {memberSpores.map((spore) => (
              <li key={spore.id}>
                <Link to={`/spore/${spore.id}`}>{spore.name}</Link>
              </li>
            ))}
          </ul>
        </article>
      </div>

      {isModalOpen && (
        <AppreciationModal
          memberName={memberState.name}
          onClose={() => setIsModalOpen(false)}
          onSend={handleSendAppreciation}
        />
      )}
      <Toast message={toastMessage} />
    </section>
  );
}

export default MemberDetailPage;
