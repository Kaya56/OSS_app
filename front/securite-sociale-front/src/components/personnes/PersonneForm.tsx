// src/components/personnes/PersonneForm.tsx
import React, { useState, useEffect } from 'react';
import { type PersonneDTO, Genre } from '../../types/personne';
import Button from '../common/Button';
import Input from '../common/Input';

interface PersonneFormProps {
  initialData?: PersonneDTO;
  onSubmit: (data: Omit<PersonneDTO, 'id' | 'dateCreation'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  title: string;
}

export const PersonneForm: React.FC<PersonneFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  title
}) => {
  const [formData, setFormData] = useState<Omit<PersonneDTO, 'id' | 'dateCreation'>>({
    nom: '',
    prenom: '',
    dateNaissance: '',
    genre: Genre.M,
    adresse: '',
    telephone: '',
    email: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom,
        prenom: initialData.prenom,
        dateNaissance: initialData.dateNaissance,
        genre: initialData.genre,
        adresse: initialData.adresse,
        telephone: initialData.telephone,
        email: initialData.email,
        photoId: initialData.photoId,
      });
    }
  }, [initialData]);

  const handleInputChange = (field: keyof typeof formData, value: string | Genre) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    } else if (formData.nom.length > 100) {
      newErrors.nom = 'Le nom ne peut pas dépasser 100 caractères';
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est obligatoire';
    } else if (formData.prenom.length > 100) {
      newErrors.prenom = 'Le prénom ne peut pas dépasser 100 caractères';
    }

    if (!formData.dateNaissance) {
      newErrors.dateNaissance = 'La date de naissance est obligatoire';
    } else {
      const date = new Date(formData.dateNaissance);
      if (date >= new Date()) {
        newErrors.dateNaissance = 'La date de naissance doit être dans le passé';
      }
    }

    if (!formData.adresse.trim()) {
      newErrors.adresse = 'L\'adresse est obligatoire';
    } else if (formData.adresse.length > 255) {
      newErrors.adresse = 'L\'adresse ne peut pas dépasser 255 caractères';
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le numéro de téléphone est obligatoire';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.telephone)) {
      newErrors.telephone = 'Numéro de téléphone invalide';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Nom"
              value={formData.nom}
              onChange={(e) => handleInputChange('nom', e.target.value)}
              error={errors.nom}
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Input
              label="Prénom"
              value={formData.prenom}
              onChange={(e) => handleInputChange('prenom', e.target.value)}
              error={errors.prenom}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Date de naissance"
              type="date"
              value={formData.dateNaissance}
              onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
              error={errors.dateNaissance}
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre *
            </label>
            <select
              value={formData.genre}
              onChange={(e) => handleInputChange('genre', e.target.value as Genre)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value={Genre.M}>Masculin</option>
              <option value={Genre.F}>Féminin</option>
            </select>
          </div>
        </div>

        <div>
          <Input
            label="Adresse"
            value={formData.adresse}
            onChange={(e) => handleInputChange('adresse', e.target.value)}
            error={errors.adresse}
            required
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Téléphone"
              value={formData.telephone}
              onChange={(e) => handleInputChange('telephone', e.target.value)}
              error={errors.telephone}
              required
              disabled={isLoading}
              placeholder="+237XXXXXXXXX"
            />
          </div>
          
          <div>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};