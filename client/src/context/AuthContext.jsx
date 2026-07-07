import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchUserRef = useRef(null);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await authAPI.getMe();
      setUser((prev) => ({ ...prev, ...data }));
      const existing = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...existing, ...data }));
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('user');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserRef.current = fetchUser;
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        fetchUser();
      } else {
        setLoading(false);
      }
    } catch {
      localStorage.removeItem('user');
      setLoading(false);
    }
  }, [fetchUser]);

  const login = async (email, password, role) => {
    const { data } = await authAPI.login({ email, password, role });
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    const newUser = { ...stored, ...updatedData };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
