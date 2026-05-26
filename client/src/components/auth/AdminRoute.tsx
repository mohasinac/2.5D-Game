import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { ReactNode } from "react";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-bg0">
        <div className="spin w-8 h-8 border-2 border-[var(--purple)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login?redirect=/admin" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
