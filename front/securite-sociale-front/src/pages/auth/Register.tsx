// pages/auth/Register.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { type RegisterRequest, Role } from '../../types/auth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { authState, register, clearError } = useAuth();
  
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    password: '',
    email: '',
    nom: '',
    prenom: '',
    roles: [],
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [authState.isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role: Role) => {
    setSelectedRoles(prev => {
      const newRoles = prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role];
      
      setFormData(prevForm => ({
        ...prevForm,
        roles: newRoles,
      }));
      
      return newRoles;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      return;
    }

    try {
      await register({
        ...formData,
        roles: selectedRoles,
      });
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
    }
  };

  const isFormValid = 
    formData.username.trim().length >= 3 &&
    formData.password.length >= 8 &&
    formData.password === confirmPassword &&
    formData.email.trim().length > 0 &&
    formData.nom.trim().length > 0 &&
    formData.prenom.trim().length > 0;

  const getPasswordStrength = (password: string): string => {
    if (password.length === 0) return '';
    if (password.length < 8) return 'Faible';
    if (password.length < 12 && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 'Moyen';
    return 'Fort';
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <Input
                  id="prenom"
                  name="prenom"
                  type="text"
                  required
                  placeholder="Votre prénom"
                  value={formData.prenom}
                  onChange={handleChange}
                  disabled={authState.loading}
                />
              </div>
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  required
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={handleChange}
                  disabled={authState.loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="votre.email@exemple.com"
                value={formData.email}
                onChange={handleChange}
                disabled={authState.loading}
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nom d'utilisateur
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Nom d'utilisateur (min. 3 caractères)"
                value={formData.username}
                onChange={handleChange}
                disabled={authState.loading}
              />
              {formData.username && formData.username.length < 3 && (
                <p className="mt-1 text-sm text-red-600">
                  Le nom d'utilisateur doit avoir au moins 3 caractères
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Mot de passe (min. 8 caractères)"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={authState.loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-sm text-gray-500">
                    {showPassword ? 'Masquer' : 'Afficher'}
                  </span>
                </button>
              </div>
              {formData.password && (
                <div className="mt-1">
                  <p className={`text-sm ${
                    passwordStrength === 'Fort' ? 'text-green-600' :
                    passwordStrength === 'Moyen' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    Force du mot de passe: {passwordStrength}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirmez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={authState.loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="text-sm text-gray-500">
                    {showConfirmPassword ? 'Masquer' : 'Afficher'}
                  </span>
                </button>
              </div>
              {confirmPassword && formData.password !== confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  Les mots de passe ne correspondent pas
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôles (optionnel)
              </label>
              <div className="space-y-2">
                {Object.values(Role).map((role) => (
                  <label key={role} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => handleRoleChange(role)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {role.replace('ROLE_', '')}
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Les rôles seront automatiquement assignés selon votre profil
              </p>
            </div>
          </div>

          {authState.error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {authState.error}
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={!isFormValid || authState.loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authState.loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Inscription en cours...
                </div>
              ) : (
                'S\'inscrire'
              )}
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>
              En vous inscrivant, vous acceptez nos{' '}
              <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
                conditions d'utilisation
              </Link>
              {' '}et notre{' '}
              <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
                politique de confidentialité
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;