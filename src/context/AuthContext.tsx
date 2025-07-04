import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/api';
import type { AuthState, User } from '../types/types';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<{ token: string | null; user: User | null; isLoading: boolean }>({
    token: null, user: null, isLoading: true,
  });

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedToken && storedUser) {
          setAuthState({ token: storedToken, user: JSON.parse(storedUser), isLoading: false });
        } else {
          setAuthState({ token: null, user: null, isLoading: false });
        }
      } catch (e) {
        setAuthState({ token: null, user: null, isLoading: false });
      }
    };
    loadStoredData();
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await api.login(email, password);
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(user));
    setAuthState({ token, user, isLoading: false });
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['userToken', 'userData']);
    setAuthState({ token: null, user: null, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
