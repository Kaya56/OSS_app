// contexts/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthState, AuthContextType, LoginRequest, RegisterRequest, User } from '../types/auth';
import authService from '../services/authService';
import { getToken, getUserFromToken, isTokenExpired, removeToken } from '../utils/jwt';

// État initial
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null,
};

// Actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getToken();
        
        if (!token) {
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }

        if (isTokenExpired(token)) {
          removeToken();
          dispatch({ type: 'AUTH_LOGOUT' });
          return;
        }

        const user = getUserFromToken(token);
        if (user) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { token, user },
          });
        } else {
          removeToken();
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
        removeToken();
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const token = await authService.login(credentials);
      const user = getUserFromToken(token);
      
      if (!user) {
        throw new Error('Impossible de récupérer les informations utilisateur');
      }

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { token, user },
      });
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.message || 'Erreur lors de la connexion',
      });
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const token = await authService.register(userData);
      const user = getUserFromToken(token);
      
      if (!user) {
        throw new Error('Impossible de récupérer les informations utilisateur');
      }

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { token, user },
      });
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.message || 'Erreur lors de l\'inscription',
      });
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const clearError = useCallback((): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const contextValue: AuthContextType = {
    authState,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};