import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAppState } from "../context/AppStateContext";

const SPORE_TYPES = [
  { value: "friends", label: "Friends" },
  { value: "family", label: "Family" },
  { value: "work", label: "Work" },
  { value: "fitness", label: "Fitness" },
  { value: "other", label: "Other" },
];

function CreateSporePage() {
  const navigate = useNavigate();
  const { createSpore } = useAppState();
  const [name, setName] = useState("");
  const [type, setType] = useState("friends");
  const [inviteTags, setInviteTags] = useState([]);
  const [inviteInput, setInviteInput] = useState("");

  function addInviteTokens(raw) {
    const parts = raw
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!parts.length) return;
    setInviteTags((prev) => {
      const next = [...prev];
      for (const p of parts) {
        if (!next.includes(p)) next.push(p);
      }
      return next;
    });
    setInviteInput("");
  }

  function handleInviteKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addInviteTokens(inviteInput);
    }
  }

  function removeTag(tag) {
    setInviteTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = createSpore({
      name: trimmed,
      type,
      invites: inviteTags,
    });
    navigate(`/spore/${id}`, { replace: true });
  }

  return (
    <section>
      <Link className="back-link" to="/spores">
        &larr; My Spores
      </Link>
      <PageHeader
        title="Create a Spore"
        subtitle="Build a small, trusted circle for support"
      />

      <form className="create-spore-form card" onSubmit={handleSubmit}>
        <label className="form-label">
          Spore name
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Close friends"
            autoComplete="off"
          />
        </label>

        <label className="form-label">
          Spore type
          <select className="form-input" value={type} onChange={(e) => setType(e.target.value)}>
            {SPORE_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="form-label">
          Invite members
          <span className="form-hint">Add names or emails—mock only, for your list.</span>
          <div className="invite-tag-field">
            <div className="invite-tag-list">
              {inviteTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="invite-tag"
                  onClick={() => removeTag(tag)}
                  title="Remove"
                >
                  {tag}
                  <span className="invite-tag-remove" aria-hidden>
                    ×
                  </span>
                </button>
              ))}
            </div>
            <input
              className="form-input invite-tag-input"
              value={inviteInput}
              onChange={(e) => setInviteInput(e.target.value)}
              onKeyDown={handleInviteKeyDown}
              placeholder="Type and press Enter, or separate with commas"
            />
          </div>
          <button
            type="button"
            className="ghost-button invite-add-btn"
            onClick={() => addInviteTokens(inviteInput)}
          >
            Add to list
          </button>
        </label>

        <div className="form-actions-row">
          <button className="link-button" type="submit" disabled={!name.trim()}>
            Create spore
          </button>
          <Link className="ghost-button" to="/spores">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

export default CreateSporePage;
