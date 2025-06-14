// src/hooks/usePrescriptions.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  Prescription,
  TypePrescription,
  PrescriptionFilters,
  CreatePrescriptionRequest,
  UpdatePrescriptionRequest
} from '../types/prescription';
import prescriptionService from '../services/prescriptionService';

interface UsePrescriptionsOptions {
  autoLoad?: boolean;
  consultationId?: number;
  assureId?: number;
  medecinId?: number;
  specialisteId?: number;
  type?: TypePrescription;
}

interface UsePrescriptionsReturn {
  prescriptions: Prescription[];
  isLoading: boolean;
  error: string | null;
  loadPrescriptions: () => Promise<void>;
  createPrescription: (data: CreatePrescriptionRequest) => Promise<Prescription>;
  updatePrescription: (id: number, data: UpdatePrescriptionRequest) => Promise<Prescription>;
  deletePrescription: (id: number) => Promise<void>;
  getPrescriptionById: (id: number) => Promise<Prescription>;
  searchPrescriptions: (filters: PrescriptionFilters) => Promise<Prescription[]>;
  clearError: () => void;
  refresh: () => Promise<void>;
  // Méthodes de comptage
  countMedicamentsByAssure: (assureId: number) => Promise<number>;
  countConsultationsByAssure: (assureId: number) => Promise<number>;
}

export function usePrescriptions(options: UsePrescriptionsOptions = {}): UsePrescriptionsReturn {
  const { autoLoad = true, consultationId, assureId, medecinId, specialisteId, type } = options;
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadPrescriptions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data: Prescription[];
      
      if (consultationId) {
        data = await prescriptionService.getPrescriptionsByConsultation(consultationId);
      } else if (assureId && type) {
        data = await prescriptionService.getPrescriptionsByAssureAndType(assureId, type);
      } else if (assureId) {
        data = await prescriptionService.getPrescriptionsByAssure(assureId);
      } else if (medecinId) {
        data = await prescriptionService.getPrescriptionsByMedecin(medecinId);
      } else if (specialisteId) {
        data = await prescriptionService.getPrescriptionsForSpecialiste(specialisteId);
      } else if (type) {
        data = await prescriptionService.getPrescriptionsByType(type);
      } else {
        data = await prescriptionService.getAllPrescriptions();
      }
      
      setPrescriptions(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des prescriptions');
    } finally {
      setIsLoading(false);
    }
  }, [consultationId, assureId, medecinId, specialisteId, type]);

  const createPrescription = useCallback(
    async (data: CreatePrescriptionRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const created = await prescriptionService.createPrescription(data);
        setPrescriptions(prev => [...prev, created]);
        return created;
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la création');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updatePrescription = useCallback(
    async (id: number, data: UpdatePrescriptionRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await prescriptionService.updatePrescription(id, data);
        setPrescriptions(prev => prev.map(p => p.id === id ? updated : p));
        return updated;
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la mise à jour');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deletePrescription = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);
      try {
        await prescriptionService.deletePrescription(id);
        setPrescriptions(prev => prev.filter(p => p.id !== id));
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la suppression');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getPrescriptionById = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);
      try {
        return await prescriptionService.getPrescriptionById(id);
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la récupération');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const searchPrescriptions = useCallback(
    async (filters: PrescriptionFilters) => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await prescriptionService.searchPrescriptions(filters);
        setPrescriptions(results);
        return results;
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la recherche');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Méthodes de comptage
  const countMedicamentsByAssure = useCallback(
    async (assureId: number) => {
      setError(null);
      try {
        return await prescriptionService.countPrescriptionsMedicamentsByAssure(assureId);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du comptage des médicaments');
        throw err;
      }
    },
    []
  );

  const countConsultationsByAssure = useCallback(
    async (assureId: number) => {
      setError(null);
      try {
        return await prescriptionService.countPrescriptionsConsultationsByAssure(assureId);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du comptage des consultations');
        throw err;
      }
    },
    []
  );

  // Utilitaires
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    await loadPrescriptions();
  }, [loadPrescriptions]);

  useEffect(() => {
    if (autoLoad) {
      loadPrescriptions();
    }
  }, [autoLoad, loadPrescriptions]);

  return {
    prescriptions,
    isLoading,
    error,
    loadPrescriptions,
    createPrescription,
    updatePrescription,
    deletePrescription,
    getPrescriptionById,
    searchPrescriptions,
    clearError,
    refresh,
    countMedicamentsByAssure,
    countConsultationsByAssure
  };
}