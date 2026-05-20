import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { C } from "@/styles/theme";
import type { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: C.bg0 }}>
        <div className="spin" style={{ width: 32, height: 32, border: `2px solid ${C.purple}`, borderTopColor: "transparent", borderRadius: "50%" }} />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
}
