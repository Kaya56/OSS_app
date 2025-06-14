// src/pages/consultations/UpdateConsultation.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConsultationForm } from '../../components/consultations/ConsultationForm';
import { consultationService } from '../../services/consultationService';
import { assureService } from '../../services/assureService'; // ✅ Import ajouté
import { medecinService } from '../../services/medecinService'; // ✅ Import ajouté
import type { ConsultationDTO } from '../../types/consultation';
import type { Assure } from '../../types/assure'; // ✅ Import ajouté
import type { Medecin } from '../../types/medecin'; // ✅ Import ajouté

export const UpdateConsultation: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [consultation, setConsultation] = useState<ConsultationDTO | null>(null);
  const [assures, setAssures] = useState<Assure[]>([]); // ✅ État ajouté
  const [medecins, setMedecins] = useState<Medecin[]>([]); // ✅ État ajouté
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadData(parseInt(id));
    }
  }, [id]);

  // ✅ Fonction pour charger toutes les données nécessaires
  const loadData = async (consultationId: number) => {
    try {
      setIsLoadingData(true);
      setError(null);
      
      // Charger en parallèle la consultation, les assurés et les médecins
      const [consultationData, assuresData, medecinsData] = await Promise.all([
        consultationService.getConsultationById(consultationId),
        assureService.getAllAssures(),
        medecinService.getAllMedecins()
      ]);
      
      setConsultation(consultationData);
      setAssures(assuresData);
      setMedecins(medecinsData);
    } catch (err: any) {
      console.error('Erreur lors du chargement:', err);
      setError(
        err.response?.data?.message || 
        'Erreur lors du chargement des données'
      );
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (data: Omit<ConsultationDTO, 'id'>) => {
    if (!consultation?.id) return;

    setIsLoading(true);
    try {
      const updatedConsultation = await consultationService.updateConsultation(
        consultation.id, 
        data
      );
      
      // Redirection vers la page de détail avec un message de succès
      navigate(`/consultations/${updatedConsultation.id}`, {
        state: { 
          message: 'Consultation modifiée avec succès',
          type: 'success'
        }
      });
    } catch (error: any) {
      console.error('Erreur lors de la modification:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Erreur lors de la modification de la consultation'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (consultation?.id) {
      navigate(`/consultations/${consultation.id}`);
    } else {
      navigate('/consultations');
    }
  };

  // Loading state
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !consultation) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error || 'Consultation introuvable'}
                </div>
                <div className="mt-4 space-x-2">
                  {id && (
                    <button
                      onClick={() => loadData(parseInt(id))}
                      className="bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-red-800 text-sm transition-colors"
                    >
                      Réessayer
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/consultations')}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-800 text-sm transition-colors"
                  >
                    Retour à la liste
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
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <button 
              onClick={() => navigate('/consultations')}
              className="hover:text-blue-600 transition-colors"
            >
              Consultations
            </button>
            <span>›</span>
            <button 
              onClick={() => navigate(`/consultations/${consultation.id}`)}
              className="hover:text-blue-600 transition-colors"
            >
              Consultation #{consultation.id}
            </button>
            <span>›</span>
            <span>Modification</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Modifier la consultation #{consultation.id}
          </h1>
          <p className="text-gray-600 mt-1">
            Modifiez les informations de cette consultation médicale.
          </p>
        </div>

        {/* Avertissements */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Points importants
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>La modification du coût mettra à jour le montant du remboursement</li>
                  <li>Les consultations avec remboursement traité ne peuvent pas être modifiées</li>
                  <li>L'assuré et le médecin ne peuvent pas être changés après création</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Informations de la consultation actuelle */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-3">
            Informations actuelles
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Date:</span>
              <p className="font-medium">
                {new Date(consultation.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Coût actuel:</span>
              <p className="font-medium text-green-600">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(consultation.cout)}
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <ConsultationForm
          consultation={consultation}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          isEdit={true}
          assures={assures} // ✅ Maintenant défini
          medecins={medecins} // ✅ Maintenant défini
        />

        {/* Note sur les limitations */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">
            Limitations de modification
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• L'assuré et le médecin ne peuvent pas être modifiés pour préserver l'intégrité des données</p>
            <p>• Seuls les détails médicaux et le coût peuvent être mis à jour</p>
            <p>• La date peut être ajustée si nécessaire</p>
          </div>
        </div>
      </div>
    </div>
  );
};