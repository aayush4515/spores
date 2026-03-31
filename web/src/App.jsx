import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import AppHomePage from "./pages/AppHomePage";
import AppreciationPage from "./pages/AppreciationPage";
import CheckInsPage from "./pages/CheckInsPage";
import CreateSporePage from "./pages/CreateSporePage";
import HomePage from "./pages/HomePage";
import MemberDetailPage from "./pages/MemberDetailPage";
import SettingsPage from "./pages/SettingsPage";
import SporeDetailPage from "./pages/SporeDetailPage";
import SporesPage from "./pages/SporesPage";
import SupportPromptsPage from "./pages/SupportPromptsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<AppShell />}>
        <Route path="home" element={<AppHomePage />} />
        <Route path="spores" element={<SporesPage />} />
        <Route path="check-ins" element={<CheckInsPage />} />
        <Route path="support-prompts" element={<SupportPromptsPage />} />
        <Route path="appreciation" element={<AppreciationPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="create-spore" element={<CreateSporePage />} />
        <Route path="spore/:sporeId" element={<SporeDetailPage />} />
        <Route path="member/:memberId" element={<MemberDetailPage />} />
        <Route path="dashboard" element={<Navigate to="/home" replace />} />
        <Route path="notifications" element={<Navigate to="/support-prompts" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
