// src/pages/consultations/ConsultationDetail.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import { consultationService } from '../../services/consultationService';
import { assureService } from '../../services/assureService';
import { medecinService } from '../../services/medecinService';
import type { ConsultationDTO, Prescription } from '../../types/consultation';
import type { Assure } from '../../types/assure';
import type { Medecin } from '../../types/medecin';

export const ConsultationDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [consultation, setConsultation] = useState<ConsultationDTO | null>(null);
  const [assure, setAssure] = useState<Assure | null>(null);
  const [medecin, setMedecin] = useState<Medecin | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadConsultationDetails(parseInt(id));
    }
  }, [id]);

  const loadConsultationDetails = async (consultationId: number) => {
    try {
      setIsLoading(true);
      
      // Charger la consultation
      const consultationData = await consultationService.getConsultationById(consultationId);
      setConsultation(consultationData);

      // Charger les détails de l'assuré et du médecin
      const [assureData, medecinData, prescriptionsData] = await Promise.all([
        assureService.getAssureById(consultationData.assureId),
        medecinService.getMedecinById(consultationData.medecinId),
        consultationService.getPrescriptionsByConsultation(consultationId)
      ]);

      setAssure(assureData);
      setMedecin(medecinData);
      setPrescriptions(prescriptionsData);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des détails de la consultation');
      console.error('Error loading consultation details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (consultation?.id) {
      navigate(`/consultations/${consultation.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!consultation?.id) return;

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
      try {
        await consultationService.deleteConsultation(consultation.id);
        navigate('/consultations', { 
          state: { message: 'Consultation supprimée avec succès' } 
        });
      } catch (err) {
        setError('Erreur lors de la suppression de la consultation');
        console.error('Error deleting consultation:', err);
      }
    }
  };

  const handleAddPrescription = () => {
    if (consultation?.id) {
      navigate(`/consultations/${consultation.id}/prescriptions/create`);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !consultation) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error || 'Consultation introuvable'}
                </div>
                <div className="mt-4 space-x-2">
                  {id && (
                    <button
                      onClick={() => loadConsultationDetails(parseInt(id))}
                      className="bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-red-800 text-sm"
                    >
                      Réessayer
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/consultations')}
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Consultation #{consultation.id}
            </h1>
            <p className="text-gray-600 mt-2">
              {formatDate(consultation.date)}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={() => navigate('/consultations')}>
              Retour à la liste
            </Button>
            <Button variant="secondary" onClick={handleEdit}>
              Modifier
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Supprimer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations sur l'assuré */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Assuré</h2>
            {assure ? (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Nom complet:</span>
                  <p className="text-gray-900">{assure.nom} {assure.prenom}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">N° Sécurité Sociale:</span>
                  <p className="text-gray-900 font-mono">{assure.numeroAssurance}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-gray-900">{assure.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Téléphone:</span>
                  <p className="text-gray-900">{assure.telephone}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Adresse:</span>
                  <p className="text-gray-900">{assure.adresse}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Informations de l'assuré non disponibles</p>
            )}
          </div>

          {/* Informations sur le médecin */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Médecin</h2>
            {medecin ? (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Nom complet:</span>
                  <p className="text-gray-900">Dr. {medecin.nom} {medecin.prenom}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Spécialisation:</span>
                  <p className="text-gray-900">
                    {medecin.specialisation || 'Médecin généraliste'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-gray-900">{medecin.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Téléphone:</span>
                  <p className="text-gray-900">{medecin.telephone}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Cabinet:</span>
                  <p className="text-gray-900">{medecin.adresse}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Informations du médecin non disponibles</p>
            )}
          </div>
        </div>

        {/* Détails de la consultation */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Détails de la consultation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-sm font-medium text-gray-500">Coût de la consultation:</span>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(consultation.cout)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Type de consultation:</span>
              <p className="text-gray-900">
                {medecin?.specialisation ? 
                  `Consultation spécialisée (${medecin.specialisation})` : 
                  'Consultation généraliste'
                }
              </p>
            </div>
          </div>
          
          {consultation.detailsMedical && (
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-500">Détails médicaux:</span>
              <div className="mt-2 p-4 bg-gray-50 rounded-md">
                <p className="text-gray-900 whitespace-pre-wrap">{consultation.detailsMedical}</p>
              </div>
            </div>
          )}
        </div>

        {/* Prescriptions */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Prescriptions ({prescriptions.length})
            </h2>
            {medecin && !medecin.specialisation && (
              <Button onClick={handleAddPrescription}>
                Ajouter une prescription
              </Button>
            )}
          </div>

          {prescriptions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune prescription pour cette consultation</p>
              {medecin && !medecin.specialisation && (
                <p className="text-sm text-gray-400 mt-2">
                  Les prescriptions peuvent être ajoutées par les médecins généralistes
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((prescription, index) => (
                <div key={prescription.id || index} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {prescription.type}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">{prescription.detailsMedicament}</p>
                      {prescription.specialisteId && (
                        <p className="text-sm text-gray-500 mt-1">
                          Spécialiste référé: ID #{prescription.specialisteId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetailPage;