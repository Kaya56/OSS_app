// utils/jwt.ts
import { type User, Role } from '../types/auth';

export const JWT_TOKEN_KEY = 'auth_token';

export const saveToken = (token: string): void => {
  localStorage.setItem(JWT_TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(JWT_TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(JWT_TOKEN_KEY);
};

export const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erreur lors du décodage du token JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const getUserFromToken = (token: string): User | null => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded) return null;

    return {
      id: decoded.userId || 0,
      username: decoded.sub || decoded.username,
      roles: decoded.roles || [],
      personne: decoded.personne || null
    };
  } catch (error) {
    console.error('Erreur lors de l\'extraction de l\'utilisateur du token:', error);
    return null;
  }
};

export const hasRole = (userRoles: Role[], requiredRole: Role): boolean => {
  return userRoles.includes(requiredRole);
};

export const hasAnyRole = (userRoles: Role[], requiredRoles: Role[]): boolean => {
  return requiredRoles.some(role => userRoles.includes(role));
};

export const isAdmin = (userRoles: Role[]): boolean => {
  return hasRole(userRoles, Role.ROLE_ADMIN);
};

export const isAssure = (userRoles: Role[]): boolean => {
  return hasRole(userRoles, Role.ROLE_ASSURE);
};

export const isMedecin = (userRoles: Role[]): boolean => {
  return hasRole(userRoles, Role.ROLE_MEDECIN);
};