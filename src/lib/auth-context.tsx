import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'manager' | 'driver' | 'student';

export interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  institution: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (data: Omit<User, 'id'> & { password: string }) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'bustrack_users';
const SESSION_KEY = 'bustrack_session';

function getUsers(): (User & { password: string })[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const signup = (data: Omit<User, 'id'> & { password: string }) => {
    const users = getUsers();
    if (users.find(u => u.email === data.email)) return false;
    const newUser = { ...data, id: crypto.randomUUID() };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    return true;
  };

  const login = (email: string, password: string) => {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return false;
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
