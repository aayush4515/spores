import { useEffect, useState } from "react";

function Toast({ message, duration = 2200 }) {
  const [visible, setVisible] = useState(false);
  const [activeMessage, setActiveMessage] = useState("");

  useEffect(() => {
    if (!message) return;
    setActiveMessage(message);
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [message, duration]);

  if (!visible || !activeMessage) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      {activeMessage}
    </div>
  );
}

export default Toast;
