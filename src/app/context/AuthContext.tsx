import { createContext, useContext, useState, ReactNode } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  initials: string;
  studentId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: AuthUser[] = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'student@school.edu',
    role: 'student',
    initials: 'AJ',
    studentId: 's1',
  },
  {
    id: 'u2',
    name: 'Mrs. Sarah Smith',
    email: 'librarian@school.edu',
    role: 'admin',
    initials: 'SS',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, password: string): boolean => {
    if (password !== 'password123') return false;
    const found = DEMO_USERS.find(u => u.email === email.toLowerCase().trim());
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
