import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppreciationModal from "../components/AppreciationModal";
import PageHeader from "../components/PageHeader";
import PageSkeleton from "../components/PageSkeleton";
import Toast from "../components/Toast";
import { useAppState } from "../context/AppStateContext";
import useFakeLoading from "../hooks/useFakeLoading";

import { sporeTypeIcon } from "../utils/sporeDisplay";

function AppreciationPage() {
  const { state, updateMember } = useAppState();
  const [toastMessage, setToastMessage] = useState("");
  const [modalMember, setModalMember] = useState(null);
  const isLoading = useFakeLoading();

  const sporesGrouped = useMemo(() => {
    const active = new Set(state.settings.activeSporeIds);
    return state.spores.filter(
      (s) => active.has(s.id) && (s.members?.length ?? 0) > 0
    );
  }, [state.spores, state.settings.activeSporeIds]);

  const memberTotal = useMemo(
    () => sporesGrouped.reduce((n, s) => n + s.members.length, 0),
    [sporesGrouped]
  );

  function handleSendAppreciation({ message, increaseEngagement }) {
    const id = modalMember?.id;
    const name = modalMember?.name;
    if (!id) return;
    if (increaseEngagement) {
      updateMember(id, (prev) => ({
        ...prev,
        positiveEngagement: Math.min(Number(prev.positiveEngagement ?? 50) + 5, 100),
      }));
    }
    setToastMessage(`Your words are on their way to ${name}.`);
    setModalMember(null);
  }

  if (isLoading) return <PageSkeleton cards={3} />;

  return (
    <section>
      <PageHeader
        title="Appreciation"
        subtitle="Send something kind to someone in your circles—small moments strengthen bonds."
      />

      <div className="page-section">
        <div className="appreciation-by-spore">
          {sporesGrouped.map((spore, index) => (
            <details
              className="appreciation-spore-disclosure"
              key={spore.id}
              open={index === 0}
            >
              <summary className="appreciation-spore-summary">
                <span
                  className="material-symbols-outlined appreciation-spore-summary__chevron"
                  aria-hidden
                >
                  expand_more
                </span>
                <span
                  className="material-symbols-outlined appreciation-spore-summary__icon"
                  aria-hidden
                >
                  {sporeTypeIcon(spore.type)}
                </span>
                <span className="appreciation-spore-summary__text">
                  <span className="appreciation-spore-summary__name">{spore.name}</span>
                  <span className="appreciation-spore-summary__meta muted">
                    {spore.members.length}{" "}
                    {spore.members.length === 1 ? "person" : "people"}
                  </span>
                </span>
              </summary>
              <div className="appreciation-spore-panel">
                {spore.members.map((member) => (
                  <div className="appreciation-member-row" key={member.id}>
                    <span className="appreciation-member-row__name">{member.name}</span>
                    <div className="appreciation-row-actions">
                      <Link className="ghost-button" to={`/member/${member.id}`}>
                        Profile
                      </Link>
                      <button
                        className="link-button"
                        onClick={() => setModalMember(member)}
                        type="button"
                      >
                        Send appreciation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
        {memberTotal === 0 && (
          <p className="muted">
            No members in your active spores yet. Add people from My Spores or turn a spore back
            on in Settings.
          </p>
        )}
      </div>

      {modalMember && (
        <AppreciationModal
          memberName={modalMember.name}
          onClose={() => setModalMember(null)}
          onSend={handleSendAppreciation}
        />
      )}
      <Toast message={toastMessage} />
    </section>
  );
}

export default AppreciationPage;
