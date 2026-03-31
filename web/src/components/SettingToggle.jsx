function SettingToggle({ setting, onToggle }) {
  return (
    <article className="setting-item">
      <div>
        <h4>{setting.label}</h4>
        <p>{setting.description}</p>
      </div>
      <button
        aria-label={`Toggle ${setting.label}`}
        className={`toggle${setting.enabled ? " enabled" : ""}`}
        onClick={() => onToggle(setting.id)}
        type="button"
      >
        <span />
      </button>
    </article>
  );
}

export default SettingToggle;
