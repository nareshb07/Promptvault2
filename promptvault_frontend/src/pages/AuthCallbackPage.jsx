import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const handleCallback = async () => {
      if (!isMounted) return;

      try {
        // Small delay to allow cookies to be set by Django
        await new Promise(resolve => setTimeout(resolve, 800));

        // Try to fetch user data to verify auth
        const response = await apiClient.get('/user/me/');
        
        if (response?.data) {
          // Auth successful → go home
          navigate('/', { replace: true });
        }
      } catch (err) {
        console.error("Authentication failed:", err);
        if (isMounted) {
          // Only redirect if component is still mounted
          navigate('/login?error=auth_failed', { replace: true });
        }
      }
    };

    handleCallback();

    // Cleanup to avoid memory leaks
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Logging in...</p>
    </div>
  );
};

export default AuthCallbackPage;