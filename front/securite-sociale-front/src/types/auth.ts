// types/auth.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  nom: string;
  prenom: string;
  roles?: Role[];
}

export type Role =
  | 'ROLE_ADMIN'
  | 'ROLE_USER'
  | 'ROLE_ASSURE'
  | 'ROLE_MEDECIN';

export const Role = {
  ROLE_ADMIN: 'ROLE_ADMIN' as Role,
  ROLE_USER: 'ROLE_USER' as Role,
  ROLE_ASSURE: 'ROLE_ASSURE' as Role,
  ROLE_MEDECIN: 'ROLE_MEDECIN' as Role,
};

export interface User {
  id: number;
  username: string;
  roles: Role[];
  personne?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  token: string;
}

export interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}