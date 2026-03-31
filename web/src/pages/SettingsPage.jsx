import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import PageHeader from "../components/PageHeader";
import PageSkeleton from "../components/PageSkeleton";
import SettingToggle from "../components/SettingToggle";
import Toast from "../components/Toast";
import { useAppState } from "../context/AppStateContext";
import useFakeLoading from "../hooks/useFakeLoading";

function SettingsPage() {
  const navigate = useNavigate();
  const { state, toggleSetting, toggleActiveSpore, deleteMyData, leaveSupportSystem } =
    useAppState();
  const { settings: settingsState, spores } = state;
  const [toastMessage, setToastMessage] = useState("");
  const [confirmKind, setConfirmKind] = useState(null);
  const isLoading = useFakeLoading();

  const toggleSettings = [
    {
      id: "activity-tracking",
      label: "Activity awareness",
      description:
        "We’ll softly surface reconnection ideas from how recently people have been in touch—only on this device.",
      enabled: settingsState.activityTracking,
    },
    {
      id: "support-prompts",
      label: "Gentle prompts",
      description: "Show kind suggestions on your home view. Turn off anytime if you need a quieter screen.",
      enabled: settingsState.supportPrompts,
    },
  ];

  function onToggle(settingId) {
    if (settingId === "activity-tracking") {
      toggleSetting("activityTracking");
      setToastMessage("Activity awareness updated");
    } else if (settingId === "support-prompts") {
      toggleSetting("supportPrompts");
      setToastMessage("Gentle prompts updated");
    }
  }

  function handleConfirmDelete() {
    deleteMyData();
    setConfirmKind(null);
    setToastMessage("Your local activity data has been cleared.");
  }

  function handleConfirmLeave() {
    leaveSupportSystem();
    setConfirmKind(null);
    setToastMessage("You’ve stepped out—your sanctuary is empty until you add circles again.");
    navigate("/home", { replace: true });
  }

  if (isLoading) return <PageSkeleton cards={3} />;

  return (
    <section>
      <PageHeader
        title="Settings"
        subtitle="Everything here stays on your device—tune the experience to feel right for you."
      />

      <div className="page-section settings-privacy-block">
        <h2 className="settings-privacy-title">Privacy &amp; Data Control</h2>
        <p className="settings-privacy-lede muted">
          Manage how your sanctuary interacts with the digital world. We believe in radical transparency and your
          absolute ownership of data.
        </p>

        <article className="card settings-info-card settings-info-card--green">
          <span className="material-symbols-outlined settings-info-icon" aria-hidden>
            shield_with_heart
          </span>
          <h3 className="settings-info-heading">Your data is yours</h3>
          <p className="settings-info-body">
            Your raw data is never shared. We only use high-level trends to suggest support when you need it most.
          </p>
        </article>

        <article className="card settings-info-card settings-info-card--blue">
          <span className="material-symbols-outlined settings-info-icon" aria-hidden>
            lock
          </span>
          <h3 className="settings-info-heading">Encrypted at the core</h3>
          <p className="settings-info-body">
            All check-in data is encrypted before it leaves your device.
          </p>
        </article>
      </div>

      <div className="settings-group">
        <h3 className="settings-group-title">Preferences</h3>
        <div className="settings-group-inner">
          {toggleSettings.map((setting) => (
            <SettingToggle key={setting.id} setting={setting} onToggle={onToggle} />
          ))}
        </div>
      </div>

      <div className="settings-group">
        <h3 className="settings-group-title">Your spores</h3>
        <p className="muted" style={{ margin: "-0.25rem 0 0.75rem", maxWidth: "36rem" }}>
          Choose which circles appear on your home view. Nothing is hidden from you—this only simplifies what you see
          first.
        </p>
        <div className="settings-group-inner">
          <article className="setting-item">
            <div>
              <h4>Active on home</h4>
              <p>
                {settingsState.activeSporeIds.length} of {spores.length} spores visible
              </p>
            </div>
            <span className="badge badge-normal">Spores</span>
          </article>

          <article className="card" style={{ padding: "1.25rem 1.35rem" }}>
            <div className="stack-list" style={{ gap: "0.35rem" }}>
              {spores.length === 0 ? (
                <p className="muted" style={{ margin: 0 }}>
                  No spores yet. Create one from My Spores.
                </p>
              ) : (
                spores.map((spore) => (
                  <label className="form-checkbox" key={spore.id}>
                    <input
                      type="checkbox"
                      checked={settingsState.activeSporeIds.includes(spore.id)}
                      onChange={() => {
                        toggleActiveSpore(spore.id);
                        setToastMessage(
                          settingsState.activeSporeIds.includes(spore.id)
                            ? `${spore.name} rests from the home view`
                            : `${spore.name} is back on your home view`
                        );
                      }}
                    />
                    {spore.name}
                  </label>
                ))
              )}
            </div>
          </article>
        </div>
      </div>

      <div className="page-section">
        <article className="card settings-danger-zone">
          <div className="settings-danger-zone-copy">
            <h3 className="settings-danger-title">Data Deletion</h3>
            <p className="muted settings-danger-desc">
              Permanently remove all logs, check-ins, and support connections on this device. This resets activity
              signals for you and your circles here—it cannot be undone.
            </p>
          </div>
          <div className="settings-danger-actions">
            <button
              className="button-soft-danger"
              type="button"
              onClick={() => setConfirmKind("delete")}
            >
              Delete my data
            </button>
            <button
              className="button-soft-danger-outline"
              type="button"
              onClick={() => setConfirmKind("leave")}
            >
              Leave support system
            </button>
          </div>
        </article>
      </div>

      {confirmKind === "delete" && (
        <ConfirmModal
          title="Delete your data?"
          message="This clears check-ins, prompts history, and activity-style signals stored in this mock app. Your spore list stays, with member states reset to a calm baseline."
          confirmLabel="Yes, delete my data"
          cancelLabel="Cancel"
          danger
          onCancel={() => setConfirmKind(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {confirmKind === "leave" && (
        <ConfirmModal
          title="Leave the support system?"
          message="This removes all spores from this device and resets your profile to a fresh demo state. You can build a new sanctuary anytime."
          confirmLabel="Yes, leave"
          cancelLabel="Stay"
          danger
          onCancel={() => setConfirmKind(null)}
          onConfirm={handleConfirmLeave}
        />
      )}

      <Toast message={toastMessage} />
    </section>
  );
}

export default SettingsPage;
