import { useState } from "react";
import { Link } from "react-router-dom";
import AppreciationModal from "../components/AppreciationModal";
import PageHeader from "../components/PageHeader";
import PageSkeleton from "../components/PageSkeleton";
import Toast from "../components/Toast";
import { useAppState } from "../context/AppStateContext";
import { useSupportPrompts } from "../hooks/useSupportPrompts";
import useFakeLoading from "../hooks/useFakeLoading";
import { feedIconClass, feedIconGlyph } from "../utils/supportFeedDisplay";

function SupportPromptsPage() {
  const [toastMessage, setToastMessage] = useState("");
  const [appreciationTarget, setAppreciationTarget] = useState(null);
  const { dismissPrompt, updateMember } = useAppState();
  const { activePrompts } = useSupportPrompts();
  const isLoading = useFakeLoading();

  function handlePrompt(promptId) {
    dismissPrompt(promptId);
    setToastMessage("Marked as tended to");
  }

  function handleSendAppreciation({ increaseEngagement }) {
    if (increaseEngagement && appreciationTarget?.memberId) {
      updateMember(appreciationTarget.memberId, (prev) => ({
        ...prev,
        positiveEngagement: Math.min(Number(prev.positiveEngagement ?? 50) + 5, 100),
      }));
    }
    setToastMessage(`Your words are on their way to ${appreciationTarget?.memberName ?? "them"}.`);
    setAppreciationTarget(null);
  }

  if (isLoading) return <PageSkeleton cards={4} />;

  return (
    <section>
      <PageHeader
        title="Support prompts"
        subtitle="Gentle suggestions when someone in your circles might welcome care—take them at your pace."
      />

      <div className="page-section">
        <div className="feed-list">
          {activePrompts.map((prompt) => (
            <article className="feed-item" key={prompt.id}>
              <span
                className={`feed-item-icon ${feedIconClass(prompt.supportLabel)}`}
                aria-hidden
              >
                {feedIconGlyph(prompt.supportLabel)}
              </span>
              <div className="feed-item-body">
                <h4>{prompt.message}</h4>
                <p className="feed-context">
                  {prompt.memberName}
                  {prompt.sporeName && prompt.sporeName !== "Personal"
                    ? ` · ${prompt.sporeName}`
                    : ""}
                </p>
                <p className="feed-hint">{prompt.recommendedAction}</p>
                <div className="feed-item-actions">
                  {prompt.memberId ? (
                    <button
                      className="link-button"
                      onClick={() => setAppreciationTarget(prompt)}
                      type="button"
                    >
                      Send appreciation
                    </button>
                  ) : null}
                  <button
                    className="ghost-button"
                    onClick={() => handlePrompt(prompt.id)}
                    type="button"
                  >
                    I&apos;ll tend to this
                  </button>
                  {prompt.memberId ? (
                    <Link className="button-secondary" to={`/member/${prompt.memberId}`}>
                      View profile
                    </Link>
                  ) : null}
                  {prompt.sporeId ? (
                    <Link className="button-secondary" to={`/spore/${prompt.sporeId}`}>
                      View spore
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
          {activePrompts.length === 0 && (
            <article className="feed-item" style={{ opacity: 0.92 }}>
              <span className="feed-item-icon feed-item-icon--normal" aria-hidden>
                {"\u2713"}
              </span>
              <div className="feed-item-body">
                <h4>Nothing asking for attention right now</h4>
                <p className="feed-message" style={{ margin: 0 }}>
                  When something surfaces, it will appear here in a calm way.
                </p>
              </div>
            </article>
          )}
        </div>
      </div>

      {appreciationTarget && (
        <AppreciationModal
          memberName={appreciationTarget.memberName}
          onClose={() => setAppreciationTarget(null)}
          onSend={handleSendAppreciation}
        />
      )}
      <Toast message={toastMessage} />
    </section>
  );
}

export default SupportPromptsPage;
