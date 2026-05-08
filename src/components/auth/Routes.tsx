import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/src/hooks/useAuth";

export function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-6 bg-[#0A2540] text-white">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-accent/20 border-t-white rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </div>
        </div>
        <div className="text-center space-y-2">
            <h2 className="text-sm font-display font-bold tracking-[0.2em] uppercase">FinFlex Pro</h2>
            <p className="text-slate-400 text-[10px] font-mono tracking-widest uppercase">Initializing Secure Terminal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export function PublicRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
