// utils/authUtils.ts
import { Role } from '../types/auth';

export const getRoleDisplayName = (role: Role): string => {
  const roleNames: { [key: string]: string } = {
    [Role.ROLE_ADMIN]: 'Administrateur',
    [Role.ROLE_USER]: 'Utilisateur',
    [Role.ROLE_ASSURE]: 'Assuré',
    [Role.ROLE_MEDECIN]: 'Médecin',
  };
  
  return roleNames[role] || role.replace('ROLE_', '');
};

export const getRoleColor = (role: Role): string => {
  const colors: { [key: string]: string } = {
    [Role.ROLE_ADMIN]: 'bg-red-100 text-red-800',
    [Role.ROLE_USER]: 'bg-gray-100 text-gray-800',
    [Role.ROLE_ASSURE]: 'bg-blue-100 text-blue-800',
    [Role.ROLE_MEDECIN]: 'bg-green-100 text-green-800',
  };
  
  return colors[role] || 'bg-gray-100 text-gray-800';
};

export const getHighestPriorityRole = (roles: Role[]): Role => {
  const priority: { [key: string]: number } = {
    [Role.ROLE_ADMIN]: 4,
    [Role.ROLE_MEDECIN]: 3,
    [Role.ROLE_ASSURE]: 2,
    [Role.ROLE_USER]: 1,
  };
  
  return roles.reduce((highest, current) => 
    priority[current] > priority[highest] ? current : highest
  );
};

export const getDefaultDashboardPath = (roles: Role[]): string => {
  const highestRole = getHighestPriorityRole(roles);
  
  switch (highestRole) {
    case Role.ROLE_ADMIN:
      return '/admin/dashboard';
    case Role.ROLE_MEDECIN:
      return '/medecin/dashboard';
    case Role.ROLE_ASSURE:
      return '/assure/dashboard';
    default:
      return '/dashboard';
  }
};

export const formatUserName = (user: any): string => {
  if (user.personne) {
    return `${user.personne.prenom} ${user.personne.nom}`;
  }
  return user.username;
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUsername = (username: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (username.length < 3) {
    errors.push('Le nom d\'utilisateur doit contenir au moins 3 caractères');
  }
  
  if (username.length > 50) {
    errors.push('Le nom d\'utilisateur ne peut pas dépasser 50 caractères');
  }
  
  if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
    errors.push('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, points, tirets et underscores');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};