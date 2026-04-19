import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  vehicleDetails?: {
    make: string;
    model: string;
    year: string;
    plateNumber: string;
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('vahan_netra_auth') === 'true';
  });
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('vahan_netra_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: email,
      phone: '+91 98765 43210',
      vehicleDetails: {
        make: 'Toyota',
        model: 'Camry',
        year: '2022',
        plateNumber: 'MH 01 AB 1234'
      }
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('vahan_netra_auth', 'true');
    localStorage.setItem('vahan_netra_user', JSON.stringify(mockUser));
  };

  const signup = async (name: string, email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: User = {
      id: Date.now().toString(),
      name: name,
      email: email
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('vahan_netra_auth', 'true');
    localStorage.setItem('vahan_netra_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vahan_netra_auth');
    localStorage.removeItem('vahan_netra_user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('vahan_netra_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
