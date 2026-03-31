import { useEffect, useRef } from "react";

function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    const firstBtn = panelRef.current?.querySelector("button");
    firstBtn?.focus();

    function handleKey(e) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <div className="modal-panel" ref={panelRef}>
        <div className="modal-header">
          <h3 id="confirm-modal-title">{title}</h3>
          <button className="ghost-button" onClick={onCancel} type="button">
            Close
          </button>
        </div>
        <div className="modal-body">
          <p style={{ margin: 0, lineHeight: 1.55, color: "var(--text-soft)" }}>{message}</p>
        </div>
        <div className="modal-actions">
          <button className="ghost-button" onClick={onCancel} type="button">
            {cancelLabel}
          </button>
          <button
            className={danger ? "button-soft-danger" : "link-button"}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
