// src/components/consultations/ConsultationForm.tsx (améliorations)
import React, { useState, useEffect, useMemo } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import type { ConsultationDTO, CreateConsultationRequest } from '../../types/consultation';
import type { Assure } from '../../types/assure';
import type { Medecin } from '../../types/medecin';

interface ConsultationFormProps {
  consultation?: ConsultationDTO;
  assures: Assure[];
  medecins: Medecin[];
  onSubmit: (consultation: CreateConsultationRequest | ConsultationDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({
  consultation,
  assures,
  medecins,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false
}) => {
  // Valeurs par défaut améliorées
  const getInitialFormData = () => ({
    assureId: consultation?.assureId || 0,
    medecinId: consultation?.medecinId || 0,
    cout: consultation?.cout || 0,
    detailsMedical: consultation?.detailsMedical || '',
    date: consultation?.date || new Date().toISOString().slice(0, 16),
    ...(isEdit && consultation?.id && { id: consultation.id })
  });

  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mémorisation du médecin sélectionné
  const selectedMedecin = useMemo(
    () => medecins.find(m => m.id === formData.medecinId),
    [medecins, formData.medecinId]
  );

  // Validation améliorée
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.assureId || formData.assureId === 0) {
      newErrors.assureId = 'L\'assuré est obligatoire';
    }

    if (!formData.medecinId || formData.medecinId === 0) {
      newErrors.medecinId = 'Le médecin est obligatoire';
    }

    if (!formData.cout || formData.cout <= 0) {
      newErrors.cout = 'Le coût doit être positif';
    } else if (formData.cout > 1000) {
      newErrors.cout = 'Le coût semble élevé, veuillez vérifier';
    }

    if (!formData.date || formData.date.trim() === '') {
      newErrors.date = 'La date est obligatoire';
    } else {
      const consultationDate = new Date(formData.date);
      const now = new Date();
      
      if (consultationDate > now) {
        newErrors.date = 'La date ne peut pas être dans le futur';
      }
      
      // Vérifier que la date n'est pas trop ancienne (ex: plus de 1 an)
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      if (consultationDate < oneYearAgo) {
        newErrors.date = 'La date ne peut pas être antérieure à 1 an';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Formatage des données avant envoi
      const dataToSubmit = {
        ...formData,
        date: new Date(formData.date).toISOString()
      };
      
      onSubmit(dataToSubmit);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Calculer le coût suggéré basé sur le type de médecin
  const getSuggestedCost = (medecin: Medecin | undefined): number => {
    if (!medecin) return 0;
    
    // Coûts de base suggérés
    return medecin.specialisation ? 50 : 25; // Spécialiste vs Généraliste
  };

  const handleMedecinChange = (medecinId: number) => {
    const medecin = medecins.find(m => m.id === medecinId);
    const suggestedCost = getSuggestedCost(medecin);
    
    handleInputChange('medecinId', medecinId);
    
    // Suggérer un coût si le champ est vide
    if (!formData.cout || formData.cout === 0) {
      handleInputChange('cout', suggestedCost);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEdit ? 'Modifier la consultation' : 'Nouvelle consultation'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sélection de l'assuré */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assuré *
          </label>
          <select
            value={formData.assureId}
            onChange={(e) => handleInputChange('assureId', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.assureId ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isEdit}
          >
            <option value={0}>Sélectionner un assuré</option>
            {assures.map(assure => (
              <option key={assure.id} value={assure.id}>
                {assure.nom} {assure.prenom} - {assure.numeroAssurance}
              </option>
            ))}
          </select>
          {errors.assureId && (
            <p className="text-red-500 text-sm mt-1">{errors.assureId}</p>
          )}
        </div>

        {/* Sélection du médecin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Médecin *
          </label>
          <select
            value={formData.medecinId}
            onChange={(e) => handleMedecinChange(parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.medecinId ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isEdit}
          >
            <option value={0}>Sélectionner un médecin</option>
            {medecins.map(medecin => (
              <option key={medecin.id} value={medecin.id}>
                Dr. {medecin.nom} {medecin.prenom} 
                {medecin.specialisation ? ` - ${medecin.specialisation}` : ' - Généraliste'}
              </option>
            ))}
          </select>
          {errors.medecinId && (
            <p className="text-red-500 text-sm mt-1">{errors.medecinId}</p>
          )}
        </div>

        {/* Date de consultation */}
        <div>
          <Input
            label="Date de consultation *"
            type="datetime-local"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            error={errors.date}
            disabled={isEdit} // Ne pas permettre de modifier la date en édition
            max={new Date().toISOString().slice(0, 16)} // Pas de date future
          />
        </div>

        {/* Coût */}
        <div>
          <Input
            label="Coût (€) *"
            type="number"
            step="0.01"
            min="0"
            max="1000"
            value={formData.cout}
            onChange={(e) => handleInputChange('cout', parseFloat(e.target.value) || 0)}
            error={errors.cout}
            placeholder={selectedMedecin ? `Coût suggéré: ${getSuggestedCost(selectedMedecin)}€` : ''}
          />
        </div>

        {/* Détails médicaux */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Détails médicaux
          </label>
          <textarea
            value={formData.detailsMedical}
            onChange={(e) => handleInputChange('detailsMedical', e.target.value)}
            rows={4}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Détails de la consultation, diagnostic, traitement..."
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.detailsMedical.length}/500 caractères
          </p>
        </div>

        {/* Informations sur le type de médecin */}
        {selectedMedecin && (
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Type de consultation: {' '}
                  {selectedMedecin.specialisation ? 
                    `Spécialiste (${selectedMedecin.specialisation})` : 
                    'Généraliste'
                  }
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Coût moyen: {getSuggestedCost(selectedMedecin)}€
                </p>
              </div>
              {!selectedMedecin.specialisation && (
                <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  Prescriptions possibles
                </div>
              )}
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
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
            disabled={isLoading || Object.keys(errors).length > 0}
          >
            {isLoading ? 'En cours...' : (isEdit ? 'Modifier' : 'Créer')}
          </Button>
        </div>
      </form>
    </div>
  );
};