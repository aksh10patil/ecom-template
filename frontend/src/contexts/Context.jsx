// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      try {
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
        console.error('Auth verification error:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    verifyAdmin();
  }, []);

  const login = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;