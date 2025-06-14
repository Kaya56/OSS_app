
// src/pages/prescriptions/CreatePrescription.tsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PrescriptionForm from '../../components/prescriptions/PrescriptionForm';
import prescriptionService from '../../services/prescriptionService';
import type { CreatePrescriptionRequest } from '../../types/prescription';

const CreatePrescriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const consultationId = searchParams.get('consultationId');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreatePrescriptionRequest) => {
    try {
      setIsLoading(true);
      await prescriptionService.createPrescription(data);
      navigate('/prescriptions', { 
        state: { message: 'Prescription créée avec succès' }
      });
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création de la prescription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/prescriptions');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle prescription</h1>
          <p className="text-gray-600 mt-1">
            Créer une nouvelle prescription médicale
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <PrescriptionForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            initialConsultationId={consultationId ? Number(consultationId) : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export const CreatePrescription = CreatePrescriptionPage;