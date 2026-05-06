import React, { createContext, useContext, useEffect, useState } from 'react';
import { getProfile } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sb_token');
    if (!token) {
      setLoading(false);
      return;
    }
    // Load user from backend
    getProfile()
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('sb_token');
        localStorage.removeItem('sb_user');
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = (userData, token) => {
    localStorage.setItem('sb_token', token);
    localStorage.setItem('sb_user', JSON.stringify(userData));
    setUser(userData);
  };

  const signOut = () => {
    localStorage.removeItem('sb_token');
    localStorage.removeItem('sb_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSignedIn: !!user,
        signIn,
        signOut,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAppAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAppAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
