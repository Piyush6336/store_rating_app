import React,{ createContext, useContext, useMemo, useState } from 'react';
import api from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    saveSession(response.data.user, response.data.token);
    return response.data.user;
  }

  async function signup(formData) {
    const response = await api.post('/auth/signup', formData);
    saveSession(response.data.user, response.data.token);
    return response.data.user;
  }

  function saveSession(nextUser, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, signup, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
