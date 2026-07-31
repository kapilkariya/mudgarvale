import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authAPI.getMe();
        if (response.success) {
          setUser(response.data);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (email, otp) => {
    const response = await authAPI.verifyLogin({ email, otp });
    if (response.success) {
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return response;
    }
    throw new Error(response.message);
  };

  const signup = async (email, otp) => {
    const response = await authAPI.verifySignup({ email, otp });
    if (response.success) {
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return response;
    }
    throw new Error(response.message);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  const sendLoginOTP = async (email) => {
    return await authAPI.sendLoginOTP({ email: email.trim().toLowerCase() });
  };

  const sendSignupOTP = async (name, email, password) => {
    return await authAPI.sendSignupOTP({ name, email, password });
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    sendLoginOTP,
    sendSignupOTP,
    isAdmin,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
