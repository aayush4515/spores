import { Link, NavLink } from "react-router-dom";
import { useAppState } from "../context/AppStateContext";

const navItems = [
  { label: "Home", path: "/home", icon: "home" },
  { label: "My Spores", path: "/spores", icon: "potted_plant" },
  { label: "Check-ins", path: "/check-ins", icon: "fact_check" },
  { label: "Support prompts", path: "/support-prompts", icon: "psychology" },
  { label: "Appreciation", path: "/appreciation", icon: "favorite" },
  { label: "Settings", path: "/settings", icon: "settings" },
];

function Sidebar() {
  const { state } = useAppState();
  const { currentUser } = state;

  return (
    <aside className="sidebar">
      <Link className="brand brand-link" to="/">
        <h1>Spore</h1>
        <p>Living Sanctuary</p>
      </Link>
      <nav className="nav-list">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item${isActive ? " nav-item-active" : ""}`
            }
            end={item.path === "/home"}
          >
            <span className="material-symbols-outlined nav-item-icon" aria-hidden>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <Link className="sidebar-cta" to="/check-ins">
        <span className="material-symbols-outlined" aria-hidden>
          add
        </span>
        New check-in
      </Link>
      <div className="sidebar-footer">
        <p>{currentUser.name}</p>
        <p className="muted">{currentUser.email}</p>
      </div>
    </aside>
  );
}

export default Sidebar;
