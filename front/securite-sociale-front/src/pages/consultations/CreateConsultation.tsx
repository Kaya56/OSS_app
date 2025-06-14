
// src/pages/consultations/CreateConsultation.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConsultationForm } from '../../components/consultations/ConsultationForm';
import { consultationService } from '../../services/consultationService';
import { assureService } from '../../services/assureService';
import { medecinService } from '../../services/medecinService';
import type { CreateConsultationRequest } from '../../types/consultation';
import type { Assure } from '../../types/assure';
import type { Medecin } from '../../types/medecin';

export const CreateConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const [assures, setAssures] = useState<Assure[]>([]);
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsDataLoading(true);
      const [assuresData, medecinsData] = await Promise.all([
        assureService.getAllAssures(),
        medecinService.getAllMedecins()
      ]);
      
      setAssures(assuresData);
      setMedecins(medecinsData);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Error loading data:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleSubmit = async (consultationData: CreateConsultationRequest) => {
    try {
      setIsLoading(true);
      await consultationService.createConsultation(consultationData);
      navigate('/consultations', { 
        state: { message: 'Consultation créée avec succès' } 
      });
    } catch (err) {
      setError('Erreur lors de la création de la consultation');
      console.error('Error creating consultation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/consultations');
  };

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
                <div className="mt-4 space-x-2">
                  <button
                    onClick={loadData}
                    className="bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-red-800 text-sm"
                  >
                    Réessayer
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-800 text-sm"
                  >
                    Retour
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle consultation</h1>
          <p className="text-gray-600 mt-2">
            Créer une nouvelle consultation médicale
          </p>
        </div>

        <ConsultationForm
          assures={assures}
          medecins={medecins}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CreateConsultationPage;