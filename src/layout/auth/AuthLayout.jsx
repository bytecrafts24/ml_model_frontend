import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * AuthLayout component that checks if user is authenticated
 * If not authenticated, redirects to login page
 */
const AuthLayout = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Don't redirect if already on login or register page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated and not on auth page, redirect to login
  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated and on auth page, redirect to home
  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthLayout;