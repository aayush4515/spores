import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import PageSkeleton from "../components/PageSkeleton";
import Toast from "../components/Toast";
import { HOME_CHECK_IN_MOODS } from "../constants/moodCheckIn";
import { useAppState } from "../context/AppStateContext";
import { useSupportPrompts } from "../hooks/useSupportPrompts";
import useFakeLoading from "../hooks/useFakeLoading";
import {
  calculateSporeHealth,
  getActivityStatus,
  getWorkIntensity,
  summarizeActivityInsights,
  summarizeWorkInsights,
} from "../utils/logic";
import { initials, sporeTypeIcon, sporeVibeLabel } from "../utils/sporeDisplay";

function findMember(state, memberId, sporeId) {
  if (!memberId || !sporeId) return null;
  const spore = state.spores.find((s) => s.id === sporeId);
  return spore?.members?.find((m) => m.id === memberId) ?? null;
}

function supportDetailLine(member, prompt) {
  if (!member) {
    return prompt?.recommendedAction ?? "A gentle check-in could help.";
  }
  const act = getActivityStatus(member);
  const work = getWorkIntensity(member);
  if (work.level === "overworking" && act.key === "inactive") {
    return "Extended work hours and low movement—this may indicate burnout risk.";
  }
  if (work.level === "overworking" && member.checkInStatus === "missing") {
    return "Long work sessions and missed check-ins—a soft hello fits well.";
  }
  if (work.level === "overworking") {
    return "Working longer than usual today—a gentle nudge could help.";
  }
  if (act.key === "inactive" && member.checkInStatus === "missing") {
    return "Quiet movement and missed check-ins—a soft hello fits well.";
  }
  if (member.checkInStatus === "missing") {
    return "Missed several daily check-ins recently.";
  }
  if (act.key === "inactive" || act.key === "low_activity") {
    return `${act.message.replace(/\.$/, "")}—worth a gentle check-in.`;
  }
  const sc = Number(member.signalsCount ?? 0);
  if (sc >= 3) {
    return `${sc} stress signals showing up lately—worth a soft reach-out.`;
  }
  if (member.checkInStatus === "not_great") {
    return "Their latest check-in suggested a heavier day.";
  }
  return prompt?.recommendedAction ?? "A small hello can go a long way.";
}

function AppHomePage() {
  const { state, updateCurrentUserCheckIn, dismissPrompt, saveCheckInNote, updateCurrentUserWorkData } =
    useAppState();
  const { currentUser, settings } = state;
  const { activeSpores, activePrompts } = useSupportPrompts();
  const isLoading = useFakeLoading();

  const [noteDraft, setNoteDraft] = useState(state.checkInNote ?? "");
  const [toastMessage, setToastMessage] = useState("");
  const [workHours, setWorkHours] = useState(
    String(currentUser.workData?.hoursWorkedToday ?? "")
  );
  const [workMode, setWorkMode] = useState(
    currentUser.workData?.workMode ?? "home"
  );

  const supportPrompt = useMemo(
    () => activePrompts.find((p) => p.kind === "support"),
    [activePrompts]
  );
  const reconnectPrompt = useMemo(
    () => activePrompts.find((p) => p.kind === "reconnection"),
    [activePrompts]
  );

  const supportMember = supportPrompt
    ? findMember(state, supportPrompt.memberId, supportPrompt.sporeId)
    : null;

  const friendsNeedingCount = useMemo(() => {
    const ids = new Set();
    for (const p of activePrompts) {
      if (p.kind === "support" && p.memberId) ids.add(p.memberId);
    }
    return ids.size;
  }, [activePrompts]);

  const appreciationPromptsCount = useMemo(() => {
    return activeSpores.reduce(
      (n, spore) =>
        n + spore.members.filter((m) => m.checkInStatus === "good").length,
      0
    );
  }, [activeSpores]);

  const missedCheckInsCount = useMemo(() => {
    const membersMissed = activeSpores.reduce(
      (n, spore) =>
        n + spore.members.filter((m) => m.checkInStatus === "missing").length,
      0
    );
    const selfMissed = currentUser.checkInStatus === "missing" ? 1 : 0;
    return membersMissed + selfMissed;
  }, [activeSpores, currentUser.checkInStatus]);

  const activeSporesCount = settings.activeSporeIds.length;

  const { lowMovementCount, stayedHomeCount } = useMemo(
    () => summarizeActivityInsights(state.spores, settings.activeSporeIds),
    [state.spores, settings.activeSporeIds]
  );

  const { overworkingCount, longSessionCount } = useMemo(
    () => summarizeWorkInsights(state.spores, settings.activeSporeIds),
    [state.spores, settings.activeSporeIds]
  );

  function plural(n, one, many) {
    return n === 1 ? one : many;
  }

  function handleMood(value) {
    updateCurrentUserCheckIn(value);
    const note = noteDraft.trim();
    if (note) saveCheckInNote(note);
    const label = HOME_CHECK_IN_MOODS.find((m) => m.value === value)?.label ?? value;
    setToastMessage(
      note ? `Saved: ${label}. Your note is kept on this device.` : `Saved: ${label}.`
    );
  }

  if (isLoading) return <PageSkeleton cards={4} />;

  return (
    <div className="home-dashboard">
      <div className="home-dashboard__main">
        <div className="home-metrics-row" aria-label="At a glance">
          <Link className="home-metric-card" to="/support-prompts">
            <span className="material-symbols-outlined home-metric-card__icon" aria-hidden>
              sentiment_satisfied
            </span>
            <span className="home-metric-card__value">{friendsNeedingCount}</span>
            <p className="home-metric-card__label">
              {friendsNeedingCount}{" "}
              {plural(friendsNeedingCount, "friend needs", "friends need")} a check-in
            </p>
          </Link>
          <Link className="home-metric-card" to="/appreciation">
            <span className="material-symbols-outlined home-metric-card__icon" aria-hidden>
              favorite
            </span>
            <span className="home-metric-card__value">{appreciationPromptsCount}</span>
            <p className="home-metric-card__label">
              {appreciationPromptsCount}{" "}
              {plural(appreciationPromptsCount, "appreciation prompt", "appreciation prompts")}
            </p>
          </Link>
          <Link className="home-metric-card" to="/check-ins">
            <span className="material-symbols-outlined home-metric-card__icon" aria-hidden>
              event_busy
            </span>
            <span className="home-metric-card__value">{missedCheckInsCount}</span>
            <p className="home-metric-card__label">
              {missedCheckInsCount}{" "}
              {plural(missedCheckInsCount, "missed check-in today", "missed check-ins today")}
            </p>
          </Link>
          <Link className="home-metric-card" to="/spores">
            <span className="material-symbols-outlined home-metric-card__icon" aria-hidden>
              potted_plant
            </span>
            <span className="home-metric-card__value">{activeSporesCount}</span>
            <p className="home-metric-card__label">
              {activeSporesCount} active {plural(activeSporesCount, "spore", "spores")}
            </p>
          </Link>
        </div>

        <article className="home-activity-insight-card">
          <div className="home-activity-insight-card__head">
            <span className="material-symbols-outlined home-activity-insight-card__icon" aria-hidden>
              monitoring
            </span>
            <h3 className="home-activity-insight-card__title">Activity insights</h3>
          </div>
          <p className="home-activity-insight-card__line">
            {lowMovementCount > 0 ? (
              <>
                {lowMovementCount} member{lowMovementCount === 1 ? "" : "s"} have lower activity
                today
              </>
            ) : (
              <>Movement looks steady across your spores today.</>
            )}
          </p>
          {stayedHomeCount > 0 ? (
            <p className="home-activity-insight-card__line home-activity-insight-card__line--soft">
              {stayedHomeCount} member{stayedHomeCount === 1 ? "" : "s"} haven&apos;t left home
              recently
            </p>
          ) : null}
        </article>

        <article className="home-activity-insight-card home-activity-insight-card--work">
          <div className="home-activity-insight-card__head">
            <span className="material-symbols-outlined home-activity-insight-card__icon" aria-hidden>
              laptop_mac
            </span>
            <h3 className="home-activity-insight-card__title">Workload insights</h3>
          </div>
          <p className="home-activity-insight-card__line">
            {overworkingCount > 0 ? (
              <>
                {overworkingCount} member{overworkingCount === 1 ? "" : "s"}{" "}
                {overworkingCount === 1 ? "is" : "are"} overworking today
              </>
            ) : (
              <>Work balance looks healthy across your spores.</>
            )}
          </p>
          {longSessionCount > 0 && (
            <p className="home-activity-insight-card__line home-activity-insight-card__line--soft">
              {longSessionCount} member{longSessionCount === 1 ? "" : "s"} had long
              continuous sessions
            </p>
          )}
        </article>

        <article className="home-checkin-card">
          <h2 className="home-checkin-card__title">
            How are you feeling, {currentUser.name}?
          </h2>
          <p className="home-checkin-card__sub">Take a moment for yourself today.</p>

          <div className="home-mood-row">
            {HOME_CHECK_IN_MOODS.map((m) => (
              <button
                key={m.value}
                type="button"
                className={`home-mood-btn${
                  currentUser.checkInStatus === m.value ? " home-mood-btn--active" : ""
                }`}
                onClick={() => handleMood(m.value)}
              >
                <span className="home-mood-btn__emoji" aria-hidden>
                  {m.emoji}
                </span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          <div className="home-checkin-note">
            <label htmlFor="home-checkin-note" className="sr-only">
              Optional note about your day
            </label>
            <textarea
              id="home-checkin-note"
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Write a short note about your day… (optional)"
              rows={4}
            />
          </div>
        </article>

        <section>
          <div className="home-section-head">
            <h2>My Spores</h2>
            <Link to="/spores">View all</Link>
          </div>
          <div className="home-spores-grid">
            {activeSpores.length === 0 ? (
              <div className="home-spores-empty">
                <p className="muted">
                  No active spores right now.{" "}
                  <Link to="/settings">Turn one on in Settings</Link> or{" "}
                  <Link to="/create-spore">create a new one</Link>.
                </p>
              </div>
            ) : (
              activeSpores.map((spore) => {
                const { score, label } = calculateSporeHealth(spore);
                const vibe = sporeVibeLabel(score);
                const preview = spore.members.slice(0, 4);
                return (
                  <Link key={spore.id} className="home-spore-card" to={`/spore/${spore.id}`}>
                    <div className="home-spore-card__top">
                      <span
                        className="material-symbols-outlined home-spore-card__icon"
                        aria-hidden
                      >
                        {sporeTypeIcon(spore.type)}
                      </span>
                      <div>
                        <p className="home-spore-card__name">{spore.name}</p>
                        <p className="home-spore-card__count">
                          {spore.members.length}{" "}
                          {plural(spore.members.length, "member", "members")}
                        </p>
                      </div>
                    </div>
                    <div className="home-spore-card__avatars" aria-hidden="true">
                      {preview.map((m) => (
                        <span key={m.id} className="home-avatar home-avatar--sm" title={m.name}>
                          {initials(m.name)}
                        </span>
                      ))}
                    </div>
                    <span
                      className={`home-spore-card__status home-spore-card__status--${vibe.key}`}
                    >
                      {vibe.label}
                    </span>
                    <span className="sr-only">Health: {label}</span>
                  </Link>
                );
              })
            )}
          </div>
        </section>
      </div>

      <aside className="home-dashboard__rail" aria-label="Support and care">
        <section className="home-rail__section">
          <h2 className="home-rail__title">Support feed</h2>

          {supportPrompt ? (
            <article className="home-feed-card">
              <div className="home-feed-card__head">
                <span className="home-avatar" aria-hidden="true">
                  {initials(supportPrompt.memberName)}
                </span>
                <div>
                  <h3 className="home-feed-card__title">{supportPrompt.message}</h3>
                </div>
              </div>
              <div className="home-feed-card__body">
                <p className="home-feed-card__msg">
                  {supportDetailLine(supportMember, supportPrompt)}
                </p>
                <div className="home-feed-card__actions">
                  {supportPrompt.memberId ? (
                    <Link
                      className="home-btn-primary"
                      to={`/member/${supportPrompt.memberId}`}
                    >
                      View profile
                    </Link>
                  ) : (
                    <Link className="home-btn-primary" to="/support-prompts">
                      View prompts
                    </Link>
                  )}
                </div>
                <div className="home-feed-card__snooze">
                  <button type="button" onClick={() => dismissPrompt(supportPrompt.id)}>
                    Snooze for today
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <div className="home-insight-hint">
              <p>No one needs an extra nudge right now. Enjoy the quiet.</p>
            </div>
          )}

          {reconnectPrompt ? (
            <article className="home-feed-card">
              <div className="home-feed-card__head">
                <span className="home-avatar" aria-hidden="true">
                  {initials(reconnectPrompt.memberName)}
                </span>
                <div>
                  <h3 className="home-feed-card__title">
                    Reconnect with {reconnectPrompt.memberName}
                  </h3>
                </div>
              </div>
              <div className="home-feed-card__body">
                <p className="home-feed-card__msg">
                  You haven&apos;t connected recently.
                </p>
                {reconnectPrompt.memberId ? (
                  <Link
                    className="home-btn-primary home-btn-hello"
                    to={`/member/${reconnectPrompt.memberId}`}
                  >
                    Say hello
                  </Link>
                ) : (
                  <Link className="home-btn-primary home-btn-hello" to="/support-prompts">
                    Say hello
                  </Link>
                )}
              </div>
            </article>
          ) : null}
        </section>

        <article className="home-gratitude-card">
          <h3>Send a little gratitude today</h3>
          <p>Small moments of appreciation strengthen your spore.</p>
          <Link to="/appreciation">Write a prompt →</Link>
        </article>

        <article className="home-work-log-card">
          <h3>Log work session</h3>
          <p>Track your pace—no judgment, just awareness.</p>
          <div className="home-work-log-card__fields">
            <label className="home-work-log-card__label">
              <span>Hours worked today</span>
              <input
                className="form-input"
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={workHours}
                onChange={(e) => setWorkHours(e.target.value)}
                placeholder="e.g. 6"
              />
            </label>
            <label className="home-work-log-card__label">
              <span>Work mode</span>
              <select
                className="form-input"
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
                <option value="unknown">Other / Unknown</option>
              </select>
            </label>
          </div>
          <button
            className="home-btn-primary"
            type="button"
            style={{ marginTop: "0.75rem", width: "100%" }}
            onClick={() => {
              const h = parseFloat(workHours) || 0;
              updateCurrentUserWorkData({
                workMode,
                hoursWorkedToday: h,
                manualWorkEntry: true,
              });
              setToastMessage("Work session logged.");
            }}
          >
            Update work data
          </button>
        </article>

        <div className="home-insight-hint">
          <p>
            Everything here is a suggestion—you can move at the pace that feels right.
          </p>
        </div>
      </aside>

      <Toast message={toastMessage} />
    </div>
  );
}

export default AppHomePage;
