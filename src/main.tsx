import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import AuthPage from "@/pages/Auth.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";
import Landing from "./pages/Landing.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import "./types/global.d.ts";
import ProfilePage from "@/pages/Profile.tsx";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VlyToolbar />
    <InstrumentationProvider>
      {convex ? (
        <ConvexAuthProvider client={convex}>
          <BrowserRouter>
            <RouteSyncer />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<AuthPage redirectAfterAuth="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </ConvexAuthProvider>
      ) : (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-xl w-full space-y-4 border rounded-xl p-6 bg-card">
            <h1 className="text-xl font-bold">Convex URL not configured</h1>
            <p className="text-sm text-muted-foreground">
              Set VITE_CONVEX_URL to your Convex deployment URL to enable authentication and data.
            </p>
            <ol className="list-decimal list-inside text-sm space-y-2">
              <li>Open your environment settings and add VITE_CONVEX_URL</li>
              <li>Value should be your Convex deployment URL (for example, from your Convex dashboard)</li>
              <li>Reload the app after saving</li>
            </ol>
            <p className="text-xs text-muted-foreground">
              If you need help, contact support via Discord.
            </p>
          </div>
        </div>
      )}
    </InstrumentationProvider>
  </StrictMode>,
);