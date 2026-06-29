import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bm_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.getMe()
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
          setProfile(data.user);
        } else {
          localStorage.removeItem('bm_token');
        }
      })
      .catch((err) => {
        console.error('Auth check error on mount:', err);
        localStorage.removeItem('bm_token');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function login(email, password) {
    try {
      const data = await api.login(email, password);
      if (data && data.token) {
        localStorage.setItem('bm_token', data.token);
        setUser(data.user);
        setProfile(data.user);
        return { error: null };
      }
      return { error: { message: 'Invalid response from server' } };
    } catch (err) {
      console.error('Login call failed:', err);
      return { error: { message: err.message || 'Invalid credentials' } };
    }
  }

  async function signup(name, email, password, role) {
    try {
      const data = await api.signup(name, email, password, role);
      if (data && data.token) {
        localStorage.setItem('bm_token', data.token);
        setUser(data.user);
        setProfile(data.user);
        return { error: null };
      }
      return { error: { message: 'Invalid response from server' } };
    } catch (err) {
      console.error('Signup call failed:', err);
      return { error: { message: err.message || 'Signup failed' } };
    }
  }

  async function logout() {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('bm_token');
  }

  function hasRole(requiredRoles) {
    if (!profile) return false;
    if (typeof requiredRoles === 'string') return profile.role === requiredRoles;
    return requiredRoles.includes(profile.role);
  }

  function hasPermission(action) {
    if (!profile) return false;
    const permissions = {
      admin: ['all'],
      manager: ['reports', 'operations', 'bookings', 'guests', 'rooms', 'revenue'],
      receptionist: ['bookings', 'check_in', 'check_out', 'guests', 'rooms']
    };
    const userPerms = permissions[profile.role] || [];
    return userPerms.includes('all') || userPerms.includes(action);
  }


  return (
    <AuthContext.Provider value={{ user, profile, loading, login, signup, logout, hasRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
