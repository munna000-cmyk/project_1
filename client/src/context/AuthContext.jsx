import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vizag_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('vizag_token') || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('vizag_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vizag_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('vizag_token', token);
    } else {
      localStorage.removeItem('vizag_token');
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      setIsAuthModalOpen(false);
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (name, email, password) => {
    const res = await api.register(name, email, password);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      setIsAuthModalOpen(false);
      return { success: true };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vizag_user');
    localStorage.removeItem('vizag_token');
  };

  const toggleFavorite = async (destinationId) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const currentFavs = new Set(user.favorites || []);
    if (currentFavs.has(destinationId)) {
      currentFavs.delete(destinationId);
    } else {
      currentFavs.add(destinationId);
    }

    const updatedList = Array.from(currentFavs);
    setUser({ ...user, favorites: updatedList });

    if (token) {
      await api.toggleFavorite(destinationId, token);
    }
  };

  const isFavorite = (destinationId) => {
    return !!user?.favorites?.includes(destinationId);
  };

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        toggleFavorite,
        isFavorite,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        openLogin,
        openRegister,
        isFavoritesOpen,
        setIsFavoritesOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

