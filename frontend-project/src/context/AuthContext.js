import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('srms_token');
    const username = localStorage.getItem('srms_user');
    return token && username ? { token, username } : null;
  });

  const login = useCallback((token, username) => {
    localStorage.setItem('srms_token', token);
    localStorage.setItem('srms_user', username);
    setUser({ token, username });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('srms_token');
    localStorage.removeItem('srms_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
