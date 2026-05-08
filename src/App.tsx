import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/src/hooks/useAuth";
import { ProtectedRoute, PublicRoute } from "@/src/components/auth/Routes";
import { Shell } from "@/src/components/layout/Shell";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";
import { Suspense, lazy } from "react";

// Lazy Loaded Pages
const DashboardPage = lazy(() => import("./pages/DashboardPage").then(module => ({ default: module.DashboardPage })));
const WalletPage = lazy(() => import("./pages/WalletPage").then(module => ({ default: module.WalletPage })));
const InvestmentsPage = lazy(() => import("./pages/InvestmentsPage").then(module => ({ default: module.InvestmentsPage })));
const AIPage = lazy(() => import("./pages/AIPage").then(module => ({ default: module.AIPage })));
const TradingPage = lazy(() => import("./pages/TradingPage").then(module => ({ default: module.TradingPage })));
const AdminPage = lazy(() => import("./pages/AdminPage").then(module => ({ default: module.AdminPage })));
const AuthPage = lazy(() => import("./pages/AuthPage").then(module => ({ default: module.AuthPage })));
const LandingPage = lazy(() => import("./pages/LandingPage").then(module => ({ default: module.LandingPage })));

// Public Pages
const FeaturesPage = lazy(() => import("./pages/public/FeaturesPage").then(module => ({ default: module.FeaturesPage })));
const SecurityPage = lazy(() => import("./pages/public/SecurityPage").then(module => ({ default: module.SecurityPage })));
const DevelopersPage = lazy(() => import("./pages/public/DevelopersPage").then(module => ({ default: module.DevelopersPage })));
const CompanyPage = lazy(() => import("./pages/public/CompanyPage").then(module => ({ default: module.CompanyPage })));

const LoadingState = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent animate-pulse shadow-lg shadow-accent/20" />
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse">Initializing Terminal...</div>
        </div>
    </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingState />}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/developers" element={<DevelopersPage />} />
              <Route path="/company" element={<CompanyPage />} />
              
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <AuthPage />
                  </PublicRoute>
                } 
              />

              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Shell>
                      <DashboardPage />
                    </Shell>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/wallet" 
                element={
                  <ProtectedRoute>
                    <Shell>
                      <WalletPage />
                    </Shell>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/investments" 
                element={
                  <ProtectedRoute>
                    <Shell>
                      <InvestmentsPage />
                    </Shell>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/ai" 
                element={
                  <ProtectedRoute>
                    <Shell>
                      <AIPage />
                    </Shell>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <Shell>
                      <AdminPage />
                    </Shell>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/trading" 
                element={
                  <ProtectedRoute>
                    <Shell>
                      <TradingPage />
                    </Shell>
                  </ProtectedRoute>
                } 
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </Suspense>
    </ErrorBoundary>
  );
}
