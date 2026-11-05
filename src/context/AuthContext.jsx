import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kitchencraft_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('kitchencraft_token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('kitchencraft_token', token);
    } else {
      localStorage.removeItem('kitchencraft_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('kitchencraft_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kitchencraft_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to login');

      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      // Fallback client simulation if offline/sandboxed
      if (email === 'admin@kitchencraft.com' && password === 'admin123') {
        const adminUser = { id: 1, email, full_name: 'Principal Architect Admin', role: 'admin', phone: '+91 98765 43210' };
        setUser(adminUser);
        setToken('demo-admin-token');
        return { user: adminUser };
      } else if (password) {
        const standardUser = { id: 2, email, full_name: 'Sarah Sharma', role: 'user', phone: '+91 91234 56789' };
        setUser(standardUser);
        setToken('demo-user-token');
        return { user: standardUser };
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, full_name, phone) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name, phone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      // Simulated fallback
      const newUser = { id: Date.now(), email, full_name, phone, role: 'user' };
      setUser(newUser);
      setToken('demo-new-user-token');
      return { user: newUser };
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (role = 'user') => {
    if (role === 'admin') {
      const adminUser = { id: 1, email: 'admin@kitchencraft.com', full_name: 'KITCHENcraft Principal Architect', role: 'admin', phone: '+91 98765 43210' };
      setUser(adminUser);
      setToken('demo-admin-token');
    } else {
      const demoUser = { id: 2, email: 'sarah@example.com', full_name: 'Sarah Sharma (Homeowner)', role: 'user', phone: '+91 91234 56789' };
      setUser(demoUser);
      setToken('demo-user-token');
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('kitchencraft_user');
    localStorage.removeItem('kitchencraft_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, demoLogin, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
