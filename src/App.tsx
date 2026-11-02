import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { Globe, Sparkles } from 'lucide-react';

// Loading Screen Component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden text-white">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-un-500/20 rounded-full blur-3xl animate-pulse-subtle"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-aurora-cyan/15 rounded-full blur-3xl animate-pulse-subtle"></div>
      
      <div className="relative z-10 text-center px-4 max-w-sm">
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-un-600 via-un-500 to-aurora-cyan p-0.5 shadow-glow-un animate-float-slow">
            <div className="w-full h-full bg-slate-900/90 rounded-2xl flex items-center justify-center backdrop-blur-xl">
              <Globe className="w-10 h-10 text-aurora-cyan animate-spin" style={{ animationDuration: '15s' }} />
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-slate-900 flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-slate-950" />
          </div>
        </div>

        <h1 className="text-2xl font-bold font-display tracking-tight text-white mb-2">
          Kaizen
        </h1>
        <p className="text-xs uppercase tracking-widest text-un-300 font-semibold mb-6">
          UNESCO Global Education Initiative • SDG-4
        </p>

        <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-un-500 via-aurora-cyan to-un-400 rounded-full animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
        </div>
        <p className="mt-4 text-xs text-slate-400 font-medium">
          Verifying cryptographic session credentials...
        </p>
      </div>
    </div>
  );
}

// Protected Route Boundary
interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isTokenExpired } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  // Strictly redirect if not logged in or token expired
  if (!user || isTokenExpired) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Public-only Route (Redirects to dashboard if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// App Content with Routes
function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Public Authentication Gate */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <AuthForm />
            </PublicRoute>
          } 
        />

        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected Profile Route */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* Wildcard Fallback */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  );
}

// Root Application wrapped in AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;