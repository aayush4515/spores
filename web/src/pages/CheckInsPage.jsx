import { useState } from "react";
import PageHeader from "../components/PageHeader";
import PageSkeleton from "../components/PageSkeleton";
import Toast from "../components/Toast";
import { CHECK_IN_OPTIONS_FULL } from "../constants/moodCheckIn";
import { useAppState } from "../context/AppStateContext";
import useFakeLoading from "../hooks/useFakeLoading";

const checkInOptions = CHECK_IN_OPTIONS_FULL;

function formatWhen(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
}

function CheckInsPage() {
  const [toastMessage, setToastMessage] = useState("");
  const { state, updateCurrentUserCheckIn } = useAppState();
  const { currentUser } = state;
  const isLoading = useFakeLoading();

  const currentLabel =
    checkInOptions.find((o) => o.value === currentUser.checkInStatus)?.label ?? null;
  const hasCheckedIn = currentLabel !== null && currentUser.checkInStatus !== "missing";

  function handleUserCheckIn(value) {
    updateCurrentUserCheckIn(value);
    const label = checkInOptions.find((o) => o.value === value)?.label ?? value;
    setToastMessage(`Updated to: ${label}`);
  }

  if (isLoading) return <PageSkeleton cards={2} />;

  return (
    <section>
      <PageHeader
        title="Check-ins"
        subtitle="A moment for you. Your check-in stays private on this device."
      />

      {hasCheckedIn && (
        <div className="page-section">
          <article className="card" style={{ maxWidth: "28rem" }}>
            <p className="section-label" style={{ marginBottom: "0.5rem" }}>
              You checked in today
            </p>
            <p style={{ margin: 0, fontSize: "1.15rem", color: "var(--text)" }}>
              <strong style={{ fontWeight: 600 }}>{currentLabel}</strong>
            </p>
            <p className="muted" style={{ marginTop: "0.65rem", marginBottom: 0 }}>
              Last updated {formatWhen(currentUser.lastInteraction)}
            </p>
          </article>
        </div>
      )}

      <div className="page-section">
        <article className="card checkin-hero">
          <h2>{hasCheckedIn ? "Want to change it?" : "How are you arriving today?"}</h2>
          <p className="checkin-sub">
            Your check-in helps gently tune what you see here—not a score, just a signal.
          </p>
          <div className="checkin-hero-grid">
            {checkInOptions.map((opt) => (
              <button
                key={opt.value}
                className={`checkin-btn-large${currentUser.checkInStatus === opt.value ? " active" : ""}`}
                onClick={() => handleUserCheckIn(opt.value)}
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </article>
      </div>

      {state.checkInNote ? (
        <div className="page-section">
          <article className="card" style={{ maxWidth: "28rem" }}>
            <p className="section-label" style={{ marginBottom: "0.5rem" }}>
              Your note
            </p>
            <p style={{ margin: 0, color: "var(--text-soft)", fontSize: "0.95rem", lineHeight: 1.55 }}>
              {state.checkInNote}
            </p>
          </article>
        </div>
      ) : null}

      <Toast message={toastMessage} />
    </section>
  );
}

export default CheckInsPage;
