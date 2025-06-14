// src/components/prescriptions/PrescriptionForm.tsx
import React, { useState, useEffect } from 'react';
import { type Prescription, TypePrescription, TYPE_PRESCRIPTION_OPTIONS } from '../../types/prescription';
import type { ConsultationDTO } from '../../types/consultation';
import type { Medecin } from '../../types/medecin';
import { isSpecialiste } from '../../types/medecin';
import Button from '../common/Button';
import Input from '../common/Input';
import { consultationService } from '../../services/consultationService';
import { medecinService } from '../../services/medecinService';

interface PrescriptionFormProps {
  prescription?: Prescription;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialConsultationId?: number;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  prescription,
  onSubmit,
  onCancel,
  isLoading = false,
  initialConsultationId
}) => {
  const [formData, setFormData] = useState({
    consultationId: prescription?.consultationId || initialConsultationId || '',
    type: prescription?.type || TypePrescription.MEDICAMENT,
    detailsMedicament: prescription?.detailsMedicament || '',
    specialisteId: prescription?.specialisteId || ''
  });

  const [consultations, setConsultations] = useState<ConsultationDTO[]>([]);
  const [specialistes, setSpecialistes] = useState<Medecin[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      const [consultationsData, medecinsData] = await Promise.all([
        consultationService.getAllConsultations(),
        medecinService.getAllMedecins()
      ]);
      
      setConsultations(consultationsData);
      // Filtrer les spécialistes (médecins qui ne sont pas généralistes)
      setSpecialistes(medecinsData.filter((medecin: Medecin) => isSpecialiste(medecin)));
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.consultationId) {
      newErrors.consultationId = 'La consultation est obligatoire';
    }

    if (!formData.type) {
      newErrors.type = 'Le type de prescription est obligatoire';
    }

    if (formData.type === TypePrescription.MEDICAMENT && !formData.detailsMedicament?.trim()) {
      newErrors.detailsMedicament = 'Les détails du médicament sont requis pour une prescription de médicament';
    }

    if (formData.type === TypePrescription.CONSULTATION_SPECIALISTE && !formData.specialisteId) {
      newErrors.specialisteId = 'Un spécialiste est requis pour une prescription de consultation spécialisée';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      consultationId: Number(formData.consultationId),
      type: formData.type,
      detailsMedicament: formData.detailsMedicament || undefined,
      specialisteId: formData.specialisteId ? Number(formData.specialisteId) : undefined
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear specific field errors
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }

    // Clear specialiste when type is not CONSULTATION_SPECIALISTE
    if (field === 'type' && value !== TypePrescription.CONSULTATION_SPECIALISTE) {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        specialisteId: ''
      }));
    }

    // Clear detailsMedicament when type is not MEDICAMENT
    if (field === 'type' && value !== TypePrescription.MEDICAMENT) {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        detailsMedicament: ''
      }));
    }
  };

  const formatConsultationOption = (consultation: ConsultationDTO) => {
    // Formatage de base avec les données disponibles dans ConsultationDTO
    const dateFormatted = new Date(consultation.date).toLocaleDateString('fr-FR');
    return `Consultation du ${dateFormatted} - ID: ${consultation.id} (Assuré: ${consultation.assureId})`;
  };

  const formatSpecialisteOption = (specialiste: Medecin) => {
    const specialisation = specialiste.specialisation || 'Spécialiste';
    const prenom = specialiste.prenom ? ` ${specialiste.prenom}` : '';
    return `Dr ${specialiste.nom}${prenom} - ${specialisation}`;
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Chargement des données...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Consultation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Consultation *
        </label>
        <select
          value={formData.consultationId}
          onChange={(e) => handleInputChange('consultationId', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.consultationId ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={!!prescription} // Disable si modification
        >
          <option value="">Sélectionner une consultation</option>
          {consultations.map(consultation => (
            <option key={consultation.id} value={consultation.id}>
              {formatConsultationOption(consultation)}
            </option>
          ))}
        </select>
        {errors.consultationId && (
          <p className="text-red-500 text-sm mt-1">{errors.consultationId}</p>
        )}
      </div>

      {/* Type de prescription */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de prescription *
        </label>
        <select
          value={formData.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.type ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          {TYPE_PRESCRIPTION_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="text-red-500 text-sm mt-1">{errors.type}</p>
        )}
      </div>

      {/* Détails médicament (si type MEDICAMENT) */}
      {formData.type === TypePrescription.MEDICAMENT && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Détails du médicament *
          </label>
          <textarea
            value={formData.detailsMedicament}
            onChange={(e) => handleInputChange('detailsMedicament', e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.detailsMedicament ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nom du médicament, dosage, posologie, durée du traitement..."
          />
          {errors.detailsMedicament && (
            <p className="text-red-500 text-sm mt-1">{errors.detailsMedicament}</p>
          )}
        </div>
      )}

      {/* Spécialiste (si type CONSULTATION_SPECIALISTE) */}
      {formData.type === TypePrescription.CONSULTATION_SPECIALISTE && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spécialiste *
          </label>
          <select
            value={formData.specialisteId}
            onChange={(e) => handleInputChange('specialisteId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.specialisteId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionner un spécialiste</option>
            {specialistes.map(specialiste => (
              <option key={specialiste.id} value={specialiste.id}>
                {formatSpecialisteOption(specialiste)}
              </option>
            ))}
          </select>
          {errors.specialisteId && (
            <p className="text-red-500 text-sm mt-1">{errors.specialisteId}</p>
          )}
          
          {specialistes.length === 0 && (
            <p className="text-amber-600 text-sm mt-1">
              Aucun spécialiste disponible dans le système
            </p>
          )}
        </div>
      )}

      {/* Autres détails (si type EXAMEN, SOIN, ou AUTRE) */}
      {(formData.type === TypePrescription.EXAMEN || 
        formData.type === TypePrescription.SOIN || 
        formData.type === TypePrescription.AUTRE) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Détails de la prescription
          </label>
          <textarea
            value={formData.detailsMedicament}
            onChange={(e) => handleInputChange('detailsMedicament', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Détails de la prescription..."
          />
        </div>
      )}

      {/* Boutons */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Enregistrement...' : prescription ? 'Modifier' : 'Créer'}
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
  );
};

export default PrescriptionForm;