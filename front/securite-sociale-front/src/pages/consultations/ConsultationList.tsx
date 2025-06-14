// src/pages/consultations/ConsultationList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConsultationList as ConsultationListComponent } from '../../components/consultations/ConsultationList';
import Button from '../../components/common/Button';
import { consultationService } from '../../services/consultationService';
import { assureService } from '../../services/assureService';
import { medecinService } from '../../services/medecinService';
import type { ConsultationDTO, ConsultationFilters } from '../../types/consultation';
import type { Assure } from '../../types/assure';
import type { Medecin } from '../../types/medecin';

export const ConsultationListPage: React.FC = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<ConsultationDTO[]>([]);
  const [assures, setAssures] = useState<Assure[]>([]);
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [consultationsData, assuresData, medecinsData] = await Promise.all([
        consultationService.getAllConsultations(),
        assureService.getAllAssures(),
        medecinService.getAllMedecins()
      ]);
      
      setConsultations(consultationsData);
      setAssures(assuresData);
      setMedecins(medecinsData);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = async (filters: ConsultationFilters) => {
    try {
      setIsLoading(true);
      const filteredConsultations = await consultationService.getFilteredConsultations(filters);
      setConsultations(filteredConsultations);
    } catch (err) {
      setError('Erreur lors du filtrage des consultations');
      console.error('Error filtering consultations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (consultation: ConsultationDTO) => {
    navigate(`/consultations/${consultation.id}/edit`);
  };

  const handleView = (consultation: ConsultationDTO) => {
    navigate(`/consultations/${consultation.id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
      try {
        await consultationService.deleteConsultation(id);
        setConsultations(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression de la consultation');
        console.error('Error deleting consultation:', err);
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
                <div className="mt-4">
                  <Button variant="secondary" onClick={loadData}>
                    Réessayer
                  </Button>
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Consultations</h1>
          <Button onClick={() => navigate('/consultations/create')}>
            Nouvelle consultation
          </Button>
        </div>

        <ConsultationListComponent
          consultations={consultations}
          assures={assures}
          medecins={medecins}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onFilter={handleFilter}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
