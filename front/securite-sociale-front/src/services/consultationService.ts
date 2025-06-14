// src/services/consultationService.ts
import api from './api';
import type{
  Consultation,
  ConsultationDTO,
  ConsultationWithDetails,
  ConsultationStats,
  ConsultationFilters,
  CreateConsultationRequest,
  UpdateConsultationRequest,
  Prescription
} from '../types/consultation';

export class ConsultationService {
  private baseUrl = '/consultations';

  // Créer une nouvelle consultation
  async createConsultation(consultation: CreateConsultationRequest): Promise<ConsultationDTO> {
    const response = await api.post<ConsultationDTO>(this.baseUrl, consultation);
    return response.data;
  }

  // Obtenir toutes les consultations
  async getAllConsultations(): Promise<ConsultationDTO[]> {
    const response = await api.get<ConsultationDTO[]>(this.baseUrl);
    return response.data;
  }

  // Obtenir une consultation par ID
  async getConsultationById(id: number): Promise<ConsultationDTO> {
    const response = await api.get<ConsultationDTO>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Obtenir les consultations d'un assuré
  async getConsultationsByAssure(assureId: number): Promise<ConsultationDTO[]> {
    const response = await api.get<ConsultationDTO[]>(`${this.baseUrl}/assure/${assureId}`);
    return response.data;
  }

  // Obtenir les consultations d'un médecin
  async getConsultationsByMedecin(medecinId: number): Promise<ConsultationDTO[]> {
    const response = await api.get<ConsultationDTO[]>(`${this.baseUrl}/medecin/${medecinId}`);
    return response.data;
  }

  // Obtenir les consultations par période
  async getConsultationsByPeriode(dateDebut: string, dateFin: string): Promise<ConsultationDTO[]> {
    const response = await api.get<ConsultationDTO[]>(`${this.baseUrl}/periode`, {
      params: { dateDebut, dateFin }
    });
    return response.data;
  }

  // Obtenir les consultations avec des généralistes
  async getConsultationsGeneralistes(): Promise<ConsultationDTO[]> {
    const response = await api.get<ConsultationDTO[]>(`${this.baseUrl}/generalistes`);
    return response.data;
  }

  // Obtenir les consultations avec des spécialistes
  async getConsultationsSpecialistes(): Promise<ConsultationDTO[]> {
    const response = await api.get<ConsultationDTO[]>(`${this.baseUrl}/specialistes`);
    return response.data;
  }

  // Mettre à jour une consultation
  async updateConsultation(id: number, consultation: UpdateConsultationRequest): Promise<ConsultationDTO> {
    const response = await api.put<ConsultationDTO>(`${this.baseUrl}/${id}`, consultation);
    return response.data;
  }

  // Supprimer une consultation
  async deleteConsultation(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  // Ajouter une prescription à une consultation
  async addPrescription(consultationId: number, prescription: Prescription): Promise<Prescription> {
    const response = await api.post<Prescription>(`${this.baseUrl}/${consultationId}/prescriptions`, prescription);
    return response.data;
  }

  // Obtenir les prescriptions d'une consultation
  async getPrescriptionsByConsultation(consultationId: number): Promise<Prescription[]> {
    const response = await api.get<Prescription[]>(`${this.baseUrl}/${consultationId}/prescriptions`);
    return response.data;
  }

  // Obtenir les statistiques des consultations
  async getConsultationStats(): Promise<ConsultationStats> {
    const response = await api.get<ConsultationStats>(`${this.baseUrl}/stats`);
    return response.data;
  }

  // Méthodes utilitaires pour filtrer les consultations
  async getFilteredConsultations(filters: ConsultationFilters): Promise<ConsultationDTO[]> {
    let consultations: ConsultationDTO[] = [];

    if (filters.assureId) {
      consultations = await this.getConsultationsByAssure(filters.assureId);
    } else if (filters.medecinId) {
      consultations = await this.getConsultationsByMedecin(filters.medecinId);
    } else if (filters.dateDebut && filters.dateFin) {
      consultations = await this.getConsultationsByPeriode(filters.dateDebut, filters.dateFin);
    } else if (filters.typeConsultation === 'generaliste') {
      consultations = await this.getConsultationsGeneralistes();
    } else if (filters.typeConsultation === 'specialiste') {
      consultations = await this.getConsultationsSpecialistes();
    } else {
      consultations = await this.getAllConsultations();
    }

    return consultations;
  }
}

export const consultationService = new ConsultationService();