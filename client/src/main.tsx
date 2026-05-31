import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./router";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/globals.css";

// Deferred PWA install prompt — shown once, dismissed forever via localStorage
function InstallPrompt() {
  const [prompt, setPrompt] = useState<Event | null>(null);
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem('bey.pwaPromptDismissed') === '1'; } catch { return false; }
  });

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!prompt || dismissed) return null;

  function install() {
    (prompt as any).prompt();
    (prompt as any).userChoice.then(() => { setPrompt(null); });
  }
  function dismiss() {
    try { localStorage.setItem('bey.pwaPromptDismissed', '1'); } catch {}
    setDismissed(true);
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: '#1a1a2e', border: '1px solid rgba(139,92,246,0.4)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.6)', maxWidth: 360, width: 'calc(100vw - 32px)' }}>
      <span style={{ fontSize: 24 }}>🌀</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Add to Home Screen</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Play offline as an app</div>
      </div>
      <button onClick={install} style={{ padding: '6px 12px', background: '#8b5cf6', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Install</button>
      <button onClick={dismiss} style={{ padding: '6px 8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>✕</button>
    </div>
  );
}

// Inline styles for the global toast container so it picks up the app theme
const TOAST_STYLE = {
  background: "#1a1a2e",
  color: "#e2e8f0",
  border: "1px solid #2d2d44",
  borderRadius: "10px",
  fontSize: "13px",
};

// Unregister any stale service worker on localhost so dev-mode F5 reloads work
if ('serviceWorker' in navigator && (location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
}

// StrictMode intentionally omitted: this app uses Colyseus WebSocket rooms and
// PixiJS WebGL contexts. StrictMode's dev-only double-mount causes two rooms to
// be created (one immediately disposed) and two WebGL contexts to be opened,
// resulting in a black canvas and stale game state. Removing it has no effect
// in production and avoids confusing double-connect errors in development.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AuthProvider>
      <RouterProvider router={router} />
      {/* Global Toaster — covers /login and any route not wrapped by a layout */}
      <Toaster
        position="top-right"
        toastOptions={{ style: TOAST_STYLE }}
      />
      <InstallPrompt />
    </AuthProvider>
  </ThemeProvider>
);
