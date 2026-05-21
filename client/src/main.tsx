import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./router";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/globals.css";

// Inline styles for the global toast container so it picks up the app theme
const TOAST_STYLE = {
  background: "#1a1a2e",
  color: "#e2e8f0",
  border: "1px solid #2d2d44",
  borderRadius: "10px",
  fontSize: "13px",
};

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
    </AuthProvider>
  </ThemeProvider>
);
