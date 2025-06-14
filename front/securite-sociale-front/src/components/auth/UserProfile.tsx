// components/auth/UserProfile.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getRoleDisplayName, getRoleColor, formatUserName } from '../../utils/authUtils';
import Button from '../common/Button';

interface UserProfileProps {
  onClose?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { authState, logout } = useAuth();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  if (!authState.user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Profil Utilisateur</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 font-semibold text-lg">
              {formatUserName(authState.user).charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{formatUserName(authState.user)}</p>
            <p className="text-sm text-gray-500">@{authState.user.username}</p>
          </div>
        </div>

        {authState.user.personne && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Informations personnelles</h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-500">Email:</span>{' '}
                <span className="text-gray-900">{authState.user.personne.email}</span>
              </p>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-2">Rôles</h4>
          <div className="flex flex-wrap gap-2">
            {authState.user.roles.map((role) => (
              <span
                key={role}
                className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}
              >
                {getRoleDisplayName(role)}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {/* Naviguer vers les paramètres */}}
          >
            Paramètres du compte
          </Button>
          
          {!showConfirmLogout ? (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setShowConfirmLogout(true)}
            >
              Se déconnecter
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 text-center">
                Êtes-vous sûr de vouloir vous déconnecter ?
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowConfirmLogout(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="flex-1"
                  onClick={handleLogout}
                >
                  Confirmer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;