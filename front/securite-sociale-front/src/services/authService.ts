// services/authService.ts
import api from './api';
import type { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '../types/auth';
import { saveToken, removeToken, getToken } from '../utils/jwt';

class AuthService {
  async login(credentials: LoginRequest): Promise<string> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      const token = response.data.token || response.data;
      
      if (typeof token === 'string') {
        saveToken(token);
        return token;
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
      } else if (error.response?.status === 403) {
        throw new Error('Accès refusé');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Erreur de connexion. Veuillez réessayer.');
      }
    }
  }

  async register(userData: RegisterRequest): Promise<string> {
    try {
      const response = await api.post<RegisterResponse>(
        '/auth/register', 
        userData
      );
      
      const token = response.data.token || response.data;
      
      if (typeof token === 'string') {
        saveToken(token);
        return token;
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      
      if (error.response?.status === 400) {
        if (error.response.data?.message?.includes('nom d\'utilisateur')) {
          throw new Error('Ce nom d\'utilisateur est déjà utilisé');
        } else if (error.response.data?.message?.includes('email')) {
          throw new Error('Cet email est déjà utilisé');
        } else if (error.response.data?.message?.includes('compte utilisateur')) {
          throw new Error('Un compte existe déjà avec ces informations');
        } else {
          throw new Error(error.response.data.message || 'Données invalides');
        }
      } else if (error.response?.status === 409) {
        throw new Error('Un compte avec ces informations existe déjà');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    }
  }

  logout(): void {
    removeToken();
  }

  getCurrentToken(): string | null {
    return getToken();
  }

  async refreshToken(): Promise<string | null> {
    try {
      const currentToken = getToken();
      if (!currentToken) return null;

      // Si votre API a un endpoint de refresh token, utilisez-le ici
      // const response = await api.post('/auth/refresh', { token: currentToken });
      // return response.data.token;
      
      return currentToken;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      this.logout();
      return null;
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      const token = getToken();
      if (!token) return false;

      // Optionnel: Valider le token côté serveur
      // const response = await api.get('/auth/validate');
      // return response.status === 200;
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error);
      this.logout();
      return false;
    }
  }
}

export default new AuthService();