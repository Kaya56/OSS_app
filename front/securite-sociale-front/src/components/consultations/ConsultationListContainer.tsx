// src/components/consultations/ConsultationListContainer.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConsultationList } from './ConsultationList';
import { assureService } from '../../services/assureService';
import { medecinService } from '../../services/medecinService';
import { consultationService } from '../../services/consultationService';
import type { ConsultationDTO, ConsultationFilters } from '../../types/consultation';
import type { Assure } from '../../types/assure';
import type { Medecin } from '../../types/medecin';

const ConsultationListContainer: React.FC = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<ConsultationDTO[]>([]);
  const [assures, setAssures] = useState<Assure[]>([]);
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [consultationsData, assuresData, medecinsData] = await Promise.all([
          consultationService.getAllConsultations(),
          assureService.getAllAssures(),
          medecinService.getAllMedecins(),
        ]);
        setConsultations(consultationsData);
        setAssures(assuresData);
        setMedecins(medecinsData);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error('Erreur:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (consultation: ConsultationDTO) => {
    navigate(`/consultations/${consultation.id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette consultation ?')) {
      try {
        await consultationService.deleteConsultation(id);
        setConsultations(consultations.filter(c => c.id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression de la consultation');
        console.error('Erreur:', err);
      }
    }
  };

  const handleView = (consultation: ConsultationDTO) => {
    navigate(`/consultations/${consultation.id}`);
  };

  const handleFilter = (filters: ConsultationFilters) => {
    // Implement filtering logic here, possibly by calling consultationService with filters
    // For now, we'll filter locally as an example
    let filteredConsultations = [...consultations];

    if (filters.assureId) {
      filteredConsultations = filteredConsultations.filter(c => c.assureId === filters.assureId);
    }

    if (filters.medecinId) {
      filteredConsultations = filteredConsultations.filter(c => c.medecinId === filters.medecinId);
    }

    if (filters.typeConsultation !== 'all') {
      const isSpecialiste = filters.typeConsultation === 'specialiste';
      filteredConsultations = filteredConsultations.filter(c => {
        const medecin = medecins.find(m => m.id === c.medecinId);
        return isSpecialiste ? medecin?.specialisation : !medecin?.specialisation;
      });
    }

    if (filters.dateDebut) {
      filteredConsultations = filteredConsultations.filter(c => new Date(c.date) >= new Date(filters.dateDebut!));
    }

    if (filters.dateFin) {
      filteredConsultations = filteredConsultations.filter(c => new Date(c.date) <= new Date(filters.dateFin!));
    }

    setConsultations(filteredConsultations);
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
      </div>
    );
  }

  return (
    <ConsultationList
      consultations={consultations}
      assures={assures}
      medecins={medecins}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
      onFilter={handleFilter}
      isLoading={isLoading}
    />
  );
};

export default ConsultationListContainer;