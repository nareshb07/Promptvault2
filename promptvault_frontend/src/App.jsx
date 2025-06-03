import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import HomePage from './pages/HomePage';
import MyPromptsPage from './pages/MyPromptsPage';
import TrendingPrompts from './components/TrendingPrompts';
import apiClient from './services/api';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthCallbackPage from './pages/AuthCallbackPage'


// ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Helper Components
const NavItem = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="hover:text-indigo-400 transition-colors flex items-center gap-1"
    >
      {children}
    </Link>
  </li>
);

const MobileNavItem = ({ to, label, onClick }) => (
  <li>
    <Link
      to={to}
      className="block text-gray-300 hover:text-indigo-400 transition-colors py-2"
      onClick={onClick}
    >
      {label}
    </Link>
  </li>
);

function AppContent() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const address = import.meta.env.VITE_APP_DEBUG
    ? 'http://127.0.0.1:8000'
    : 'https://promptvault.onrender.com'; 

  const googleLoginUrl = `${address}/accounts/google/login/`;
  const djangoLogoutUrl = `${address}/accounts/logout/`;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    apiClient.get("/csrf/")
      .then(() => console.log("✅ CSRF cookie set"))
      .catch((err) => console.error("❌ CSRF setup failed", err));
  }, []);

  const handleLogout = () => {
    logout(); // Clears frontend state
    window.location.href = djangoLogoutUrl; // Redirects to Django logout
  };

  return (
    <div className="min-h-screen bg-slate-800 font-sans text-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-neutral-800 border-b border-gray-700 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
          >
            PromptVault
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 items-center">
            <NavItem to="/">Home</NavItem>
            {user && (
              <>
                <NavItem to="/my-prompts">My Prompts</NavItem>
                <NavItem to="/trending">Trending</NavItem>
              </>
            )}
            {user ? (
              <li className="ml-4 flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-medium">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-300 text-sm">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-1 px-3 rounded transition-all shadow hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </li>
            ) : (
              <li>
                <a
                  href={googleLoginUrl}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-1 px-3 rounded transition-all shadow hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Login with Google</span>
                </a>
              </li>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-700">
            <ul className="space-y-2">
              <MobileNavItem to="/" label="Home" onClick={() => setIsMenuOpen(false)} />
              {user && (
                <>
                  <MobileNavItem to="/my-prompts" label="My Prompts" onClick={() => setIsMenuOpen(false)} />
                  <MobileNavItem to="/trending" label="Trending" onClick={() => setIsMenuOpen(false)} />
                </>
              )}
              {user ? (
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-left text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </li>
              ) : (
                <li>
                  <a
                    href={googleLoginUrl}
                    className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login with Google 1
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/my-prompts"
            element={
              <ProtectedRoute>
                <MyPromptsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/trending" element={<TrendingPrompts />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/callback" element={<AuthCallbackPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} PromptVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Final App Export
export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<AppContent />} />
    </Routes>
  );
}