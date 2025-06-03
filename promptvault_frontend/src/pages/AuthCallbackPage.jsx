import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

// Helper to get cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const handleCallback = async () => {
      if (!isMounted) return;

      try {
        // Wait for cookie to be set by Django
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Try to fetch user data to verify auth
        const res = await apiClient.get('/user/me/');

        if (res.status === 200 && res.data) {
          console.log("✅ Authenticated user:", res.data);
          navigate('/', { replace: true });
        }
      } catch (err) {
        console.error("❌ Authentication failed:", err.message);

        // Fallback: Check if token exists in cookie and retry
        const accessToken = getCookie('access_token');
        if (accessToken) {
          try {
            const fallbackRes = await apiClient.get('/user/me/', {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });

            if (fallbackRes.status === 200) {
              navigate('/', { replace: true });
            }
          } catch (fallbackErr) {
            console.error("❌ Fallback auth failed:", fallbackErr.message);
          }
        }

        if (isMounted) {
          navigate('/login?error=auth_failed', { replace: true });
        }
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="text-center p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-gray-300">Logging you in securely...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we authenticate you.</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;