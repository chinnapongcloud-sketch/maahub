import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, setToken, removeToken } from '../api';
import { jwtDecode } from '../jwtDecode';

const AuthContext = createContext();

function decodeUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    localStorage.removeItem('token');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => decodeUser());

  useEffect(() => {
    setCurrentUser(decodeUser());
  }, []);

  const login = async (username, password) => {
    try {
      const data = await apiLogin(username, password);
      setToken(data.token);
      setCurrentUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await apiRegister(userData);
      setToken(data.token);
      setCurrentUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    removeToken();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
