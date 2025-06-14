
// src/pages/prescriptions/UpdatePrescription.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PrescriptionForm from '../../components/prescriptions/PrescriptionForm';
import prescriptionService from '../../services/prescriptionService';
import type { Prescription, UpdatePrescriptionRequest } from '../../types/prescription';

const UpdatePrescriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPrescription();
    }
  }, [id]);

  const loadPrescription = async () => {
    try {
      setIsLoadingData(true);
      setError(null);
      const data = await prescriptionService.getPrescriptionById(Number(id));
      setPrescription(data);
    } catch (err) {
      setError('Erreur lors du chargement de la prescription');
      console.error('Erreur:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (data: UpdatePrescriptionRequest) => {
    try {
      setIsLoading(true);
      await prescriptionService.updatePrescription(Number(id), data);
      navigate('/prescriptions', { 
        state: { message: 'Prescription modifiée avec succès' }
      });
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert('Erreur lors de la modification de la prescription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/prescriptions');
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center">
          <div className="text-gray-600">Chargement de la prescription...</div>
        </div>
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error || 'Prescription non trouvée'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Modifier la prescription</h1>
          <p className="text-gray-600 mt-1">
            Modification de la prescription #{prescription.id}
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <PrescriptionForm
            prescription={prescription}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export const UpdatePrescription = UpdatePrescriptionPage;