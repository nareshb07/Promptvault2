import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from './services/api'; // Assuming your apiClient is in src/services/api.js
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/user/me/');
      setUser(response.data);
    } catch (error) {
      setUser(null);
      if (error.response && error.response.status !== 401) {
        console.error("Error fetching current user:", error);
        setError(error.response?.data?.detail || 'Failed to fetch user data');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // This function can be called after a successful login redirect if needed,
  // but useEffect already handles initial load.
  const login = () => {
    // Primarily to re-trigger a user fetch if some external event happens
    // For Google OAuth via Django, the cookie is set by Django,
    // and then fetchCurrentUser will pick it up.
    return fetchCurrentUser();
  };

  const logout = () => {
    // Frontend state update. Actual logout is Django's responsibility via redirect.
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-blue-500 hover:text-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loadingAuth: loading, fetchCurrentUser, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error in URL
        const params = new URLSearchParams(window.location.search);
        const error = params.get('error');
        
        if (error) {
          setError(error);
          return;
        }

        // Attempt to fetch user data
        await apiClient.get('/user/me/');
        navigate('/', { replace: true });
      } catch (err) {
        setError('Authentication failed. Please try again.');
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="text-blue-500 hover:text-blue-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Logging in...</p>
    </div>
  );
};