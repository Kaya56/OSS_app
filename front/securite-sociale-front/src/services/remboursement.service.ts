// services/remboursement.service.ts
import type { AxiosResponse } from 'axios';
import api from './api'; // <-- on utilise l'instance axios sécurisée ici

import type {
  RemboursementDTO,
  CreateRemboursementRequest,
  RemboursementStats,
  StatutRemboursement,
} from '../types/remboursement.types';
import { MethodePaiement } from '../types/assure';

const API_URL = '/remboursements';

class RemboursementService {
  // Créer un remboursement
  async creerRemboursement(data: CreateRemboursementRequest): Promise<RemboursementDTO> {
    const response: AxiosResponse<RemboursementDTO> = await api.post(`${API_URL}`, data);
    return response.data;
  }

  async obtenirTousRemboursements(): Promise<RemboursementDTO[]> {
    const response = await api.get<RemboursementDTO[]>(`${API_URL}`);
    return response.data;
  }

  async obtenirRemboursementParId(id: number): Promise<RemboursementDTO> {
    const response = await api.get<RemboursementDTO>(`${API_URL}/${id}`);
    return response.data;
  }

  async obtenirRemboursementsParStatut(statut: StatutRemboursement): Promise<RemboursementDTO[]> {
    const response = await api.get<RemboursementDTO[]>(`${API_URL}/statut/${statut}`);
    return response.data;
  }

  async obtenirRemboursementsEnAttente(): Promise<RemboursementDTO[]> {
    const response = await api.get<RemboursementDTO[]>(`${API_URL}/en-attente`);
    return response.data;
  }

  async obtenirRemboursementsTraites(): Promise<RemboursementDTO[]> {
    const response = await api.get<RemboursementDTO[]>(`${API_URL}/traites`);
    return response.data;
  }

  async obtenirRemboursementsRefuses(): Promise<RemboursementDTO[]> {
    const response = await api.get<RemboursementDTO[]>(`${API_URL}/refuses`);
    return response.data;
  }

  async obtenirRemboursementsParAssure(assureId: number): Promise<RemboursementDTO[]> {
    const response = await api.get<RemboursementDTO[]>(`${API_URL}/assure/${assureId}`);
    return response.data;
  }

  async obtenirRemboursementsParMethode(methode: MethodePaiement): Promise<RemboursementDTO[]> {
    const response = await api.get<RemboursementDTO[]>(`${API_URL}/methode/${methode}`);
    return response.data;
  }

  async obtenirRemboursementsParPeriode(dateDebut: string, dateFin: string): Promise<RemboursementDTO[]> {
    const response = await api.get<RemboursementDTO[]>(`${API_URL}/periode`, {
      params: { dateDebut, dateFin },
    });
    return response.data;
  }

  async traiterRemboursement(id: number): Promise<RemboursementDTO> {
    const response = await api.put<RemboursementDTO>(`${API_URL}/${id}/traiter`);
    return response.data;
  }

  async refuserRemboursement(id: number, motif: string): Promise<RemboursementDTO> {
    const response = await api.put<RemboursementDTO>(`${API_URL}/${id}/refuser`, null, {
      params: { motif },
    });
    return response.data;
  }

  async annulerTraitementRemboursement(id: number): Promise<RemboursementDTO> {
    const response = await api.put<RemboursementDTO>(`${API_URL}/${id}/annuler`);
    return response.data;
  }

  async modifierMethodePaiement(id: number, methode: MethodePaiement): Promise<RemboursementDTO> {
    const response = await api.put<RemboursementDTO>(`${API_URL}/${id}/methode`, null, {
      params: { methode },
    });
    return response.data;
  }

  async recalculerMontant(id: number): Promise<RemboursementDTO> {
    const response = await api.put<RemboursementDTO>(`${API_URL}/${id}/recalculer`);
    return response.data;
  }

  async supprimerRemboursement(id: number): Promise<void> {
    await api.delete(`${API_URL}/${id}`);
  }

  async traiterTousRemboursementsEnAttente(): Promise<RemboursementDTO[]> {
    const response = await api.put<RemboursementDTO[]>(`${API_URL}/traiter-tous`);
    return response.data;
  }

  async obtenirStatistiques(): Promise<RemboursementStats> {
    const response = await api.get<RemboursementStats>(`${API_URL}/stats`);
    return response.data;
  }

  async obtenirRemboursementParConsultation(consultationId: number): Promise<RemboursementDTO | null> {
    try {
      const response = await api.get<RemboursementDTO>(`${API_URL}/consultation/${consultationId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  }
}

export const remboursementService = new RemboursementService();
export default remboursementService;
