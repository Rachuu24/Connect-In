import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import AuthPage from "@/pages/Auth.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router";
import "./index.css";
import Landing from "./pages/Landing.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import "./types/global.d.ts";
import ProfilePage from "@/pages/Profile.tsx";
import NoticeBoardPage from "@/pages/NoticeBoard.tsx";
import QnAPage from "@/pages/QnA.tsx";

function MissingConvexConfig() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full border rounded-lg p-6 bg-card">
        <h1 className="text-xl font-bold mb-2">Convex URL not configured</h1>
        <p className="text-sm text-muted-foreground mb-4">
          The app can't reach the backend because VITE_CONVEX_URL is not set.
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-sm">
          <li>Create .env.local at the project root.</li>
          <li>Add: <code>VITE_CONVEX_URL="https://YOUR-DEPLOYMENT.convex.site"</code></li>
          <li>Restart the dev server.</li>
        </ol>
        <p className="text-xs text-muted-foreground mt-4">
          Tip: In Convex dashboard → Settings → "Client URL".
        </p>
      </div>
    </div>
  );
}

function RouteSyncer() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.navigateToAuth = (redirectUrl: string) => {
      navigate(`/auth?redirect=${encodeURIComponent(redirectUrl)}`);
    };
  }, [navigate, location.pathname]);

  return null;
}

function Boot() {
  const url = import.meta.env.VITE_CONVEX_URL as string | undefined;
  if (!url) {
    return <MissingConvexConfig />;
  }
  const convex = new ConvexReactClient(url);
  return (
    <>
      <VlyToolbar />
      <InstrumentationProvider>
        <ConvexAuthProvider client={convex}>
          <BrowserRouter>
            <RouteSyncer />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<AuthPage redirectAfterAuth="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notice-board" element={<NoticeBoardPage />} />
              <Route path="/qna" element={<QnAPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </ConvexAuthProvider>
      </InstrumentationProvider>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Boot />
  </StrictMode>,
);