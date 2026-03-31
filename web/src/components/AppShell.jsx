import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

function AppShell() {
  const { pathname } = useLocation();
  const isHome = pathname === "/home" || pathname.endsWith("/home");

  return (
    <div className="app-shell">
      <Sidebar />
      <main className={`page-container${isHome ? " page-container--home" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;
