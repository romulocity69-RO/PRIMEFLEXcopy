import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/auth`;
const TOKEN_KEY = "gluteoprime_token";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [loading, setLoading] = useState(true);

  const authAxios = useCallback(
    () => axios.create({ baseURL: API, headers: token ? { Authorization: `Bearer ${token}` } : {} }),
    [token]
  );

  // Load current user when token is present
  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(`${API}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (active) setUser(data.user);
      } catch (e) {
        if (active) {
          setUser(null);
          setToken(null);
          localStorage.removeItem(TOKEN_KEY);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [token]);

  const persist = (tok, usr) => {
    localStorage.setItem(TOKEN_KEY, tok);
    setToken(tok);
    setUser(usr);
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${API}/register`, { name, email, password });
    persist(data.token, data.user);
    return data.user;
  };

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/login`, { email, password });
    persist(data.token, data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (patch) => {
    const { data } = await axios.put(`${API}/profile`, patch, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(data.user);
    return data.user;
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, register, login, logout, updateProfile, authAxios, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};

export default AuthContext;
