// src/components/consultations/ConsultationForm.tsx
import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import type { ConsultationDTO } from '../../types/consultation';
import type { Assure } from '../../types/assure';
import type { Medecin } from '../../types/medecin';
import { assureService } from '../../services/assureService';
import { medecinService } from '../../services/medecinService';

interface ConsultationFormProps {
  initialData?: Partial<ConsultationDTO>;
  onSubmit: (data: Omit<ConsultationDTO, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<Omit<ConsultationDTO, 'id'>>({
    assureId: initialData?.assureId || 0,
    medecinId: initialData?.medecinId || 0,
    date: initialData?.date || new Date().toISOString().slice(0, 16),
    cout: initialData?.cout || 0,
    detailsMedical: initialData?.detailsMedical || ''
  });

  const [assures, setAssures] = useState<Assure[]>([]);
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadSelectData();
  }, []);

  const loadSelectData = async () => {
    try {
      setLoadingData(true);
      const [assuresData, medecinsData] = await Promise.all([
        assureService.getAllAssures(),
        medecinService.getAllMedecins()
      ]);
      setAssures(assuresData);
      setMedecins(medecinsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setErrors({ general: 'Erreur lors du chargement des données' });
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.assureId || formData.assureId === 0) {
      newErrors.assureId = 'L\'assuré est obligatoire';
    }

    if (!formData.medecinId || formData.medecinId === 0) {
      newErrors.medecinId = 'Le médecin est obligatoire';
    }

    if (!formData.date) {
      newErrors.date = 'La date est obligatoire';
    } else {
      const consultationDate = new Date(formData.date);
      const now = new Date();
      if (consultationDate > now) {
        newErrors.date = 'La date ne peut pas être dans le futur';
      }
    }

    if (!formData.cout || formData.cout <= 0) {
      newErrors.cout = 'Le coût doit être positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error: any) {
      setErrors({ 
        general: error.message || 'Erreur lors de la sauvegarde' 
      });
    }
  };

  if (loadingData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const selectedMedecin = medecins.find(m => m.id === formData.medecinId);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {isEdit ? 'Modifier la consultation' : 'Nouvelle consultation'}
      </h2>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

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
              errors.assureId ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isLoading}
          >
            <option value={0}>Sélectionner un assuré</option>
            {assures.map(assure => (
              <option key={assure.id} value={assure.id}>
                {assure.nom} {assure.prenom} - {assure.numeroAssurance}
              </option>
            ))}
          </select>
          {errors.assureId && (
            <p className="mt-1 text-sm text-red-600">{errors.assureId}</p>
          )}
        </div>

        {/* Sélection du médecin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Médecin *
          </label>
          <select
            value={formData.medecinId}
            onChange={(e) => handleInputChange('medecinId', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.medecinId ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isLoading}
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
            <p className="mt-1 text-sm text-red-600">{errors.medecinId}</p>
          )}
          {selectedMedecin && (
            <div className="mt-2 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Type:</span> {selectedMedecin.specialisation || 'Médecin généraliste'}
              </p>
              <p className="text-sm text-blue-800">
                <span className="font-medium">Cabinet:</span> {selectedMedecin.adresse}
              </p>
            </div>
          )}
        </div>

        {/* Date de consultation */}
        <div>
          <Input
            label="Date et heure de consultation *"
            type="datetime-local"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            error={errors.date}
            disabled={isLoading}
          />
        </div>

        {/* Coût */}
        <div>
          <Input
            label="Coût (€) *"
            type="number"
            step="0.01"
            min="0"
            value={formData.cout.toString()}
            onChange={(e) => handleInputChange('cout', parseFloat(e.target.value) || 0)}
            error={errors.cout}
            disabled={isLoading}
            placeholder="0.00"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Diagnostic, observations, recommandations..."
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Optionnel - Informations complémentaires sur la consultation
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
            disabled={isLoading}
          >
            {isLoading ? 'Enregistrement...' : (isEdit ? 'Modifier' : 'Créer')}
          </Button>
        </div>
      </form>
    </div>
  );
};