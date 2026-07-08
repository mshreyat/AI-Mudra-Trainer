import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import PracticePage from "@/pages/PracticePage";
import HistoryPage from "@/pages/HistoryPage";
import ProgressPage from "@/pages/ProgressPage";
import AboutPage from "@/pages/AboutPage";
import { AuthGuard } from "@/components/auth/AuthGuard";

function App() {
  return (
    <AuthGuard>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthGuard>
  );
}

export default App;
