import { useEffect, useRef, useState } from "react";

const templates = [
  "Thank you for showing up. Your consistency matters.",
  "I appreciate your energy and presence in the spore.",
  "You are not alone. I am here if you need support.",
];

function AppreciationModal({ memberName, onClose, onSend }) {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [customMessage, setCustomMessage] = useState("");
  const panelRef = useRef(null);

  useEffect(() => {
    const firstFocusable = panelRef.current?.querySelector(
      "button, [href], input, select, textarea"
    );
    firstFocusable?.focus();

    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();
    const message = customMessage.trim() || selectedTemplate;
    onSend({ message, increaseEngagement: true });
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="appreciation-dialog-title">
      <div className="modal-panel" ref={panelRef}>
        <div className="modal-header">
          <h3 id="appreciation-dialog-title">Send something kind to {memberName}</h3>
          <button className="ghost-button" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label className="form-label">
              Start from a gentle template
              <select
                className="form-input"
                value={selectedTemplate}
                onChange={(event) => setSelectedTemplate(event.target.value)}
              >
                {templates.map((template) => (
                  <option key={template} value={template}>
                    {template.length > 52 ? `${template.slice(0, 52)}…` : template}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-label">
              Or use your own words
              <textarea
                className="form-input"
                rows={4}
                placeholder="Write in whatever tone feels natural to you…"
                value={customMessage}
                onChange={(event) => setCustomMessage(event.target.value)}
              />
            </label>
          </div>

          <div className="modal-actions">
            <button className="ghost-button" onClick={onClose} type="button">
              Not now
            </button>
            <button className="link-button" type="submit">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AppreciationModal;
