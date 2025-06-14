// hooks/useRemboursements.ts
import { useState, useEffect, useCallback } from 'react';
import type { 
  RemboursementDTO, 
  RemboursementStats, 
  StatutRemboursement,
  RemboursementFilters
} from '../types/remboursement.types';
import type { MethodePaiement } from '../types/assure';
import remboursementService from '../services/remboursement.service';

export const useRemboursements = (filters?: RemboursementFilters) => {
  const [remboursements, setRemboursements] = useState<RemboursementDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRemboursements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: RemboursementDTO[];
      
      if (filters?.statut) {
        data = await remboursementService.obtenirRemboursementsParStatut(filters.statut);
      } else if (filters?.methode) {
        data = await remboursementService.obtenirRemboursementsParMethode(filters.methode);
      } else if (filters?.assureId) {
        data = await remboursementService.obtenirRemboursementsParAssure(filters.assureId);
      } else if (filters?.dateDebut && filters?.dateFin) {
        data = await remboursementService.obtenirRemboursementsParPeriode(filters.dateDebut, filters.dateFin);
      } else {
        data = await remboursementService.obtenirTousRemboursements();
      }
      
      setRemboursements(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des remboursements');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRemboursements();
  }, [fetchRemboursements]);

  const refetch = useCallback(() => {
    fetchRemboursements();
  }, [fetchRemboursements]);

  return { remboursements, loading, error, refetch };
};

export const useRemboursement = (id: number) => {
  const [remboursement, setRemboursement] = useState<RemboursementDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRemboursement = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await remboursementService.obtenirRemboursementParId(id);
      setRemboursement(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du remboursement');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchRemboursement();
    }
  }, [fetchRemboursement, id]);

  return { remboursement, loading, error, refetch: fetchRemboursement };
};

export const useRemboursementStats = () => {
  const [stats, setStats] = useState<RemboursementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await remboursementService.obtenirStatistiques();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

export const useRemboursementActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const traiterRemboursement = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await remboursementService.traiterRemboursement(id);
      return result;
    } catch (err: any) {
      setError(err.message || 'Erreur lors du traitement du remboursement');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refuserRemboursement = useCallback(async (id: number, motif: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await remboursementService.refuserRemboursement(id, motif);
      return result;
    } catch (err: any) {
      setError(err.message || 'Erreur lors du refus du remboursement');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const annulerTraitement = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await remboursementService.annulerTraitementRemboursement(id);
      return result;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'annulation du traitement');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const modifierMethodePaiement = useCallback(async (id: number, methode: MethodePaiement) => {
    try {
      setLoading(true);
      setError(null);
      const result = await remboursementService.modifierMethodePaiement(id, methode);
      return result;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification de la méthode de paiement');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const recalculerMontant = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await remboursementService.recalculerMontant(id);
      return result;
    } catch (err: any) {
      setError(err.message || 'Erreur lors du recalcul du montant');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const supprimerRemboursement = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await remboursementService.supprimerRemboursement(id);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression du remboursement');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const traiterTous = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await remboursementService.traiterTousRemboursementsEnAttente();
      return result;
    } catch (err: any) {
      setError(err.message || 'Erreur lors du traitement de tous les remboursements');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    traiterRemboursement,
    refuserRemboursement,
    annulerTraitement,
    modifierMethodePaiement,
    recalculerMontant,
    supprimerRemboursement,
    traiterTous
  };
};