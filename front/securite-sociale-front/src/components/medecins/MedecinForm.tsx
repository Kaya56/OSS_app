// components/medecins/MedecinForm.tsx
import React, { useState, useEffect } from 'react';
import type { MedecinFormData } from '../../types/medecin';
import Input from '../common/Input';
import Button from '../common/Button';
import medecinService from '../../services/medecinService';

interface MedecinFormProps {
  initialData?: Partial<MedecinFormData>;
  onSubmit: (data: MedecinFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

const MedecinForm: React.FC<MedecinFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<MedecinFormData>({
    nom: '',
    prenom: '',
    dateNaissance: '',
    genre: 'M',
    adresse: '',
    telephone: '',
    email: '',
    specialisation: '',
    ...initialData
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MedecinFormData, string>>>({});
  const [specialisations, setSpecialisations] = useState<string[]>([]);

  useEffect(() => {
    loadSpecialisations();
  }, []);

  const loadSpecialisations = async () => {
    try {
      const data = await medecinService.getAllSpecialisations();
      setSpecialisations(data);
    } catch (error) {
      console.error('Erreur lors du chargement des spécialisations:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof MedecinFormData, string>> = {};

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
      const birthDate = new Date(formData.dateNaissance);
      const today = new Date();
      if (birthDate >= today) {
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
    } else if (!/^\+?[0-9]{8,15}$/.test(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    } else if (formData.email.length > 100) {
      newErrors.email = 'L\'email ne peut pas dépasser 100 caractères';
    }

    if (formData.specialisation && formData.specialisation.length > 100) {
      newErrors.specialisation = 'La spécialisation ne peut pas dépasser 100 caractères';
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

  const handleInputChange = (field: keyof MedecinFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEdit ? 'Modifier le médecin' : 'Nouveau médecin'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Informations personnelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom *"
            type="text"
            value={formData.nom}
            onChange={(e) => handleInputChange('nom', e.target.value)}
            error={errors.nom}
            placeholder="Nom du médecin"
          />

          <Input
            label="Prénom *"
            type="text"
            value={formData.prenom}
            onChange={(e) => handleInputChange('prenom', e.target.value)}
            error={errors.prenom}
            placeholder="Prénom du médecin"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date de naissance *"
            type="date"
            value={formData.dateNaissance}
            onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
            error={errors.dateNaissance}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Genre *
            </label>
            <select
              value={formData.genre}
              onChange={(e) => handleInputChange('genre', e.target.value as 'M' | 'F')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>
        </div>

        <Input
          label="Adresse *"
          type="text"
          value={formData.adresse}
          onChange={(e) => handleInputChange('adresse', e.target.value)}
          error={errors.adresse}
          placeholder="Adresse complète"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Téléphone *"
            type="tel"
            value={formData.telephone}
            onChange={(e) => handleInputChange('telephone', e.target.value)}
            error={errors.telephone}
            placeholder="+237 6XX XXX XXX"
          />

          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder="email@exemple.com"
          />
        </div>

        {/* Spécialisation */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Spécialisation
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.specialisation}
              onChange={(e) => handleInputChange('specialisation', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Laisser vide pour généraliste"
              list="specialisations"
            />
            <datalist id="specialisations">
              {specialisations.map((spec) => (
                <option key={spec} value={spec} />
              ))}
            </datalist>
          </div>
          {errors.specialisation && (
            <p className="text-red-500 text-sm">{errors.specialisation}</p>
          )}
          <p className="text-gray-500 text-sm">
            Laisser vide si le médecin est généraliste
          </p>
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-3 pt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isEdit ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MedecinForm;