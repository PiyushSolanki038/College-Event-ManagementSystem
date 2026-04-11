import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui-custom/Toast';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

export type UserRole = 'student' | 'organizer' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  emailVerified?: boolean;
  enrollmentNo?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, name: string, role: UserRole, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('college_auth_token');
      const savedUser = localStorage.getItem('college_user');
      
      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser({ ...parsedUser, id: String(parsedUser.id) });
        } catch (e) {
          localStorage.removeItem('college_auth_token');
          localStorage.removeItem('college_user');
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    showToast('info', 'Synchronizing institutional identity...');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Authentication failed');
      }

      const data = await response.json();
      
      localStorage.setItem('college_auth_token', data.token);
      localStorage.setItem('college_user', JSON.stringify(data.user));
      
      setUser(data.user);
      showToast('success', `Welcome back, ${data.user.name}.`);
    } catch (error: any) {
      console.error('Auth error:', error);
      showToast('danger', error.message || 'Identity verification failed.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, name: string, role: UserRole, password: string) => {
    setIsLoading(true);
    showToast('info', 'Provisioning institutional identity...');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Registration failed');
      }

      const data = await response.json();
      
      localStorage.setItem('college_auth_token', data.token);
      localStorage.setItem('college_user', JSON.stringify(data.user));
      
      setUser(data.user);
      showToast('success', `Welcome to the institution, ${data.user.name}.`);
    } catch (error: any) {
      console.error('Registration error:', error);
      showToast('danger', error.message || 'Identity provisioning failed.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updateData: Partial<User>) => {
    const token = localStorage.getItem('college_auth_token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Profile update failed');

      const updatedUser = await response.json();
      localStorage.setItem('college_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      showToast('success', 'Institutional profile updated.');
    } catch (error) {
      showToast('danger', 'Profile update failed.');
      throw error;
    }
  };
  const logout = async () => {
    localStorage.removeItem('college_auth_token');
    localStorage.removeItem('college_user');
    setUser(null);
    showToast('info', 'Session terminated successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

