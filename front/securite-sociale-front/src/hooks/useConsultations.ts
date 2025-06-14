// src/hooks/useConsultations.ts
import { useState, useEffect, useCallback } from 'react';
import { consultationService } from '../services/consultationService';
import type { 
  ConsultationDTO, 
  Prescription, 
  ConsultationStats as ConsultationStatsType,
  CreateConsultationRequest,
  UpdateConsultationRequest 
} from '../types/consultation';

interface UseConsultationsOptions {
  autoLoad?: boolean;
  assureId?: number;
  medecinId?: number;
  dateDebut?: string;
  dateFin?: string;
  type?: 'all' | 'generalistes' | 'specialistes';
}

export const useConsultations = (options: UseConsultationsOptions = {}) => {
  const {
    autoLoad = true,
    assureId,
    medecinId,
    dateDebut,
    dateFin,
    type = 'all'
  } = options;

  const [consultations, setConsultations] = useState<ConsultationDTO[]>([]);
  const [stats, setStats] = useState<ConsultationStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour charger les consultations selon les critères
  const loadConsultations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let data: ConsultationDTO[];

      if (assureId) {
        data = await consultationService.getConsultationsByAssure(assureId);
      } else if (medecinId) {
        data = await consultationService.getConsultationsByMedecin(medecinId);
      } else if (dateDebut && dateFin) {
        data = await consultationService.getConsultationsByPeriode(dateDebut, dateFin);
      } else if (type === 'generalistes') {
        data = await consultationService.getConsultationsGeneralistes();
      } else if (type === 'specialistes') {
        data = await consultationService.getConsultationsSpecialistes();
      } else {
        data = await consultationService.getAllConsultations();
      }

      setConsultations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des consultations');
      setConsultations([]);
    } finally {
      setIsLoading(false);
    }
  }, [assureId, medecinId, dateDebut, dateFin, type]);

  // Fonction pour charger les statistiques
  const loadStats = useCallback(async () => {
    try {
      setError(null);
      const statsData = await consultationService.getConsultationStats();
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques');
    }
  }, []);

  // Fonction pour créer une nouvelle consultation
  const createConsultation = useCallback(async (consultation: CreateConsultationRequest): Promise<ConsultationDTO | null> => {
    try {
      setError(null);
      const newConsultation = await consultationService.createConsultation(consultation);
      
      // Recharger les consultations après création
      await loadConsultations();
      
      return newConsultation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la consultation');
      return null;
    }
  }, [loadConsultations]);

  // Fonction pour mettre à jour une consultation
  const updateConsultation = useCallback(async (id: number, consultation: UpdateConsultationRequest): Promise<ConsultationDTO | null> => {
    try {
      setError(null);
      const updatedConsultation = await consultationService.updateConsultation(id, consultation);
      
      // Mettre à jour la liste locale
      setConsultations(prev => 
        prev.map(c => c.id === id ? updatedConsultation : c)
      );
      
      return updatedConsultation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la consultation');
      return null;
    }
  }, []);

  // Fonction pour supprimer une consultation
  const deleteConsultation = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await consultationService.deleteConsultation(id);
      
      // Retirer de la liste locale
      setConsultations(prev => prev.filter(c => c.id !== id));
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de la consultation');
      return false;
    }
  }, []);

  // Fonction pour ajouter une prescription
  const addPrescription = useCallback(async (consultationId: number, prescription: Prescription): Promise<Prescription | null> => {
    try {
      setError(null);
      const newPrescription = await consultationService.addPrescription(consultationId, prescription);
      return newPrescription;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout de la prescription');
      return null;
    }
  }, []);

  // Fonction pour obtenir les prescriptions d'une consultation
  const getPrescriptions = useCallback(async (consultationId: number): Promise<Prescription[]> => {
    try {
      setError(null);
      return await consultationService.getPrescriptionsByConsultation(consultationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des prescriptions');
      return [];
    }
  }, []);

  // Fonction pour obtenir une consultation spécifique
  const getConsultationById = useCallback(async (id: number): Promise<ConsultationDTO | null> => {
    try {
      setError(null);
      return await consultationService.getConsultationById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la consultation');
      return null;
    }
  }, []);

  // Fonction pour rafraîchir les données
  const refresh = useCallback(async () => {
    await Promise.all([loadConsultations(), loadStats()]);
  }, [loadConsultations, loadStats]);

  // Effet pour charger automatiquement les données
  useEffect(() => {
    if (autoLoad) {
      loadConsultations();
    }
  }, [autoLoad, loadConsultations]);

  // Effet pour charger les statistiques au montage
  useEffect(() => {
    if (autoLoad) {
      loadStats();
    }
  }, [autoLoad, loadStats]);

  return {
    // État
    consultations,
    stats,
    isLoading,
    error,
    
    // Actions
    loadConsultations,
    loadStats,
    createConsultation,
    updateConsultation,
    deleteConsultation,
    addPrescription,
    getPrescriptions,
    getConsultationById,
    refresh,
    
    // Utilitaires
    clearError: () => setError(null)
  };
};