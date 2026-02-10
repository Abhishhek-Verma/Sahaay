import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// Protected Route wrapper component - JWT based authentication
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }

      try {
        // Verify token with backend
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user.role);
          setIsAuthenticated(true);
        } else {
          // Invalid token, clear storage
          localStorage.clear();
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        localStorage.clear();
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Show loading spinner while verifying
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/student-login" replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on user's role
    const redirectMap = {
      student: '/student-dashboard',
      counselor: '/counselor-dashboard',
      admin: '/admin-analytics-dashboard',
    };
    
    return <Navigate to={redirectMap[userRole] || '/student-dashboard'} replace />;
  }

  return <>{children}</>;
};

// Role-based redirect component
export const RoleBasedRedirect = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const token = localStorage.getItem('token');
      const cachedRole = localStorage.getItem('userRole');

      if (cachedRole) {
        setUserRole(cachedRole);
        setLoading(false);
        return;
      }

      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUserRole(data.user.role);
            localStorage.setItem('userRole', data.user.role);
          }
        } catch (error) {
          console.error('Error checking role:', error);
        }
      }
      
      setLoading(false);
    };

    checkRole();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const redirectMap = {
    student: '/student-dashboard',
    counselor: '/counselor-dashboard',
    admin: '/admin-analytics-dashboard',
  };

  return <Navigate to={redirectMap[userRole] || '/student-login'} replace />;
};

