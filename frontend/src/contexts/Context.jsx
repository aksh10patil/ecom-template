// frontend/src/contexts/Context.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin token exists when the component mounts
    const checkAdminStatus = async () => {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Verify token with backend (optional but recommended)
        const response = await fetch('http://localhost:4000/api/admin/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });

        if (response.ok) {
          setIsAdmin(true);
        } else {
          // Token is invalid or expired
          localStorage.removeItem('adminToken');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error verifying admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  // Login function
  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('adminToken', data.token);
      setIsAdmin(true);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
  };

  const value = {
    isAdmin,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};