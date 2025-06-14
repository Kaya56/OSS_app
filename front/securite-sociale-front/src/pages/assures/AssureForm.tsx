import React, { useState, useEffect } from 'react';
import { type AssureDTO, MethodePaiement } from '../../types/assure';
import { Genre } from '../../types/personne';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface AssureFormProps {
  assure?: AssureDTO;
  onSubmit: (assure: AssureDTO) => void;
  loading?: boolean;
  title: string;
}

export const AssureForm: React.FC<AssureFormProps> = ({
  assure,
  onSubmit,
  loading = false,
  title
}) => {
  const [formData, setFormData] = useState<AssureDTO>({
    nom: '',
    prenom: '',
    dateNaissance: '',
    genre: Genre.M,
    adresse: '',
    telephone: '',
    email: '',
    numeroAssurance: '',
    methodePaiementPreferee: MethodePaiement.VIREMENT,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (assure) {
      setFormData(assure);
    }
  }, [assure]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est obligatoire';
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
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le numéro de téléphone est obligatoire';
    } else if (!/^\\+?[1-9]\\d{1,14}$/.test(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.numeroAssurance.trim()) {
      newErrors.numeroAssurance = 'Le numéro d\'assurance est obligatoire';
    } else if (!/^[0-9]{13}$/.test(formData.numeroAssurance)) {
      newErrors.numeroAssurance = 'Le numéro d\'assurance doit contenir exactement 13 chiffres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nom *"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            error={errors.nom}
            placeholder="Entrez le nom"
          />

          <Input
            label="Prénom *"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            error={errors.prenom}
            placeholder="Entrez le prénom"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Date de naissance *"
            name="dateNaissance"
            type="date"
            value={formData.dateNaissance}
            onChange={handleChange}
            error={errors.dateNaissance}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genre *
            </label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={Genre.M}>Masculin</option>
              <option value={Genre.F}>Féminin</option>
            </select>
          </div>
        </div>

        <Input
          label="Adresse *"
          name="adresse"
          value={formData.adresse}
          onChange={handleChange}
          error={errors.adresse}
          placeholder="Entrez l'adresse complète"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Téléphone *"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            error={errors.telephone}
            placeholder="+237123456789"
          />

          <Input
            label="Email *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="exemple@email.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Numéro d'assurance *"
            name="numeroAssurance"
            value={formData.numeroAssurance}
            onChange={handleChange}
            error={errors.numeroAssurance}
            placeholder="1234567890123"
            maxLength={13}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Méthode de paiement préférée *
            </label>
            <select
              name="methodePaiementPreferee"
              value={formData.methodePaiementPreferee}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={MethodePaiement.VIREMENT}>Virement bancaire</option>
              <option value={MethodePaiement.CASH}>Espèces</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.history.back()}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={loading}
            className="px-6"
          >
            {assure ? 'Mettre à jour' : 'Créer l\'assuré'}
          </Button>
        </div>
      </div>
    </div>
  );
};