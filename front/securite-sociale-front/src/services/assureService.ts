// services/assureService.ts
import api from './api';
import type { Assure, AssureDTO, MethodePaiement, AssureStats } from '../types/assure';

export const assureService = {
  // Créer un nouvel assuré
  createAssure: async (assure: AssureDTO): Promise<Assure> => {
    const response = await api.post('/assures', assure);
    return response.data;
  },

  // Obtenir tous les assurés
  getAllAssures: async (): Promise<Assure[]> => {
    const response = await api.get('/assures');
    return response.data;
  },

  // Obtenir un assuré par ID
  getAssureById: async (id: number): Promise<Assure> => {
    const response = await api.get(`/assures/${id}`);
    return response.data;
  },

  // Obtenir un assuré par numéro d'assurance
  getAssureByNumero: async (numeroAssurance: string): Promise<Assure> => {
    const response = await api.get(`/assures/numero/${numeroAssurance}`);
    return response.data;
  },

  // Mettre à jour un assuré
  updateAssure: async (id: number, assure: AssureDTO): Promise<Assure> => {
    const response = await api.put(`/assures/${id}`, assure);
    return response.data;
  },

  // Supprimer un assuré
  deleteAssure: async (id: number): Promise<void> => {
    await api.delete(`/assures/${id}`);
  },

  // Rechercher des assurés par nom
  searchAssuresByNom: async (nom: string): Promise<Assure[]> => {
    const response = await api.get(`/assures/search?nom=${encodeURIComponent(nom)}`);
    return response.data;
  },

  // Obtenir les assurés sans médecin traitant
  getAssuresSansMedecinTraitant: async (): Promise<Assure[]> => {
    const response = await api.get('/assures/sans-medecin');
    return response.data;
  },

  // Obtenir les assurés par méthode de paiement
  getAssuresByMethodePaiement: async (methode: MethodePaiement): Promise<Assure[]> => {
    const response = await api.get(`/assures/methode-paiement/${methode}`);
    return response.data;
  },

  // Choisir ou changer de médecin traitant
  choisirMedecinTraitant: async (assureId: number, medecinId?: number): Promise<Assure> => {
    const params = medecinId ? `?medecinId=${medecinId}` : '';
    const response = await api.patch(`/assures/${assureId}/medecin-traitant${params}`);
    return response.data;
  },

  // Obtenir les assurés d'un médecin traitant
  getAssuresByMedecinTraitant: async (medecinId: number): Promise<Assure[]> => {
    const response = await api.get(`/assures/medecin-traitant/${medecinId}`);
    return response.data;
  },

  // Obtenir le nombre total d'assurés
  getNombreTotalAssures: async (): Promise<number> => {
    const response = await api.get('/assures/count');
    return response.data;
  },

  // Obtenir le nombre d'assurés avec médecin traitant
  getNombreAssuresAvecMedecinTraitant: async (): Promise<number> => {
    const response = await api.get('/assures/count/avec-medecin');
    return response.data;
  },

  // Vérifier si une personne est assurée
  isAssure: async (id: number): Promise<boolean> => {
    const response = await api.get(`/assures/${id}/exists`);
    return response.data;
  },

  // Obtenir les statistiques des assurés
  getStats: async (): Promise<AssureStats> => {
    const [total, avecMedecin] = await Promise.all([
      assureService.getNombreTotalAssures(),
      assureService.getNombreAssuresAvecMedecinTraitant()
    ]);
    
    return {
      totalAssures: total,
      assuresAvecMedecin: avecMedecin,
      assuresSansMedecin: total - avecMedecin
    };
  }
};