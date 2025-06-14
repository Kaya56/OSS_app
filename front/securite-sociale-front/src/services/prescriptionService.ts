// src/services/prescriptionService.ts
import type { 
  Prescription, 
  PrescriptionDTO, 
  CreatePrescriptionRequest, 
  UpdatePrescriptionRequest,
  PrescriptionFilters,
  TypePrescription 
} from '../types/prescription';
import api from './api';

const PRESCRIPTION_BASE_URL = '/api/prescriptions';

export const prescriptionService = {
  // Créer une nouvelle prescription
  async createPrescription(data: CreatePrescriptionRequest): Promise<Prescription> {
    const response = await api.post<PrescriptionDTO>(PRESCRIPTION_BASE_URL, data);
    return response.data;
  },

  // Obtenir toutes les prescriptions
  async getAllPrescriptions(): Promise<Prescription[]> {
    const response = await api.get<PrescriptionDTO[]>(PRESCRIPTION_BASE_URL);
    return response.data;
  },

  // Obtenir une prescription par ID
  async getPrescriptionById(id: number): Promise<Prescription> {
    const response = await api.get<PrescriptionDTO>(`${PRESCRIPTION_BASE_URL}/${id}`);
    return response.data;
  },

  // Mettre à jour une prescription
  async updatePrescription(id: number, data: UpdatePrescriptionRequest): Promise<Prescription> {
    const response = await api.put<PrescriptionDTO>(`${PRESCRIPTION_BASE_URL}/${id}`, data);
    return response.data;
  },

  // Supprimer une prescription
  async deletePrescription(id: number): Promise<void> {
    await api.delete(`${PRESCRIPTION_BASE_URL}/${id}`);
  },

  // Obtenir les prescriptions d'une consultation
  async getPrescriptionsByConsultation(consultationId: number): Promise<Prescription[]> {
    const response = await api.get<PrescriptionDTO[]>(`${PRESCRIPTION_BASE_URL}/consultation/${consultationId}`);
    return response.data;
  },

  // Obtenir les prescriptions par type
  async getPrescriptionsByType(type: TypePrescription): Promise<Prescription[]> {
    const response = await api.get<PrescriptionDTO[]>(`${PRESCRIPTION_BASE_URL}/type/${type}`);
    return response.data;
  },

  // Obtenir les prescriptions de médicaments
  async getPrescriptionsMedicaments(): Promise<Prescription[]> {
    const response = await api.get<PrescriptionDTO[]>(`${PRESCRIPTION_BASE_URL}/medicaments`);
    return response.data;
  },

  // Obtenir les prescriptions d'un assuré
  async getPrescriptionsByAssure(assureId: number): Promise<Prescription[]> {
    const response = await api.get<PrescriptionDTO[]>(`${PRESCRIPTION_BASE_URL}/assure/${assureId}`);
    return response.data;
  },

  // Obtenir les prescriptions d'un assuré par type
  async getPrescriptionsByAssureAndType(assureId: number, type: TypePrescription): Promise<Prescription[]> {
    const response = await api.get<PrescriptionDTO[]>(`${PRESCRIPTION_BASE_URL}/assure/${assureId}/type/${type}`);
    return response.data;
  },

  // Obtenir les prescriptions émises par un médecin
  async getPrescriptionsByMedecin(medecinId: number): Promise<Prescription[]> {
    const response = await api.get<PrescriptionDTO[]>(`${PRESCRIPTION_BASE_URL}/medecin/${medecinId}`);
    return response.data;
  },

  // Obtenir les prescriptions pour un spécialiste
  async getPrescriptionsForSpecialiste(specialisteId: number): Promise<Prescription[]> {
    const response = await api.get<PrescriptionDTO[]>(`${PRESCRIPTION_BASE_URL}/specialiste/${specialisteId}`);
    return response.data;
  },

  // Obtenir les prescriptions par période
  async getPrescriptionsByPeriode(dateDebut: string, dateFin: string): Promise<Prescription[]> {
    const response = await api.get<PrescriptionDTO[]>(`${PRESCRIPTION_BASE_URL}/periode`, {
      params: { dateDebut, dateFin }
    });
    return response.data;
  },

  // Compter les prescriptions de médicaments pour un assuré
  async countPrescriptionsMedicamentsByAssure(assureId: number): Promise<number> {
    const response = await api.get<number>(`${PRESCRIPTION_BASE_URL}/assure/${assureId}/medicaments/count`);
    return response.data;
  },

  // Compter les prescriptions de consultations spécialisées pour un assuré
  async countPrescriptionsConsultationsByAssure(assureId: number): Promise<number> {
    const response = await api.get<number>(`${PRESCRIPTION_BASE_URL}/assure/${assureId}/consultations/count`);
    return response.data;
  },

  // Recherche avancée avec filtres
  async searchPrescriptions(filters: PrescriptionFilters): Promise<Prescription[]> {
    let url = PRESCRIPTION_BASE_URL;
    const params = new URLSearchParams();

    if (filters.consultationId) {
      url = `${PRESCRIPTION_BASE_URL}/consultation/${filters.consultationId}`;
    } else if (filters.assureId && filters.type) {
      url = `${PRESCRIPTION_BASE_URL}/assure/${filters.assureId}/type/${filters.type}`;
    } else if (filters.assureId) {
      url = `${PRESCRIPTION_BASE_URL}/assure/${filters.assureId}`;
    } else if (filters.medecinId) {
      url = `${PRESCRIPTION_BASE_URL}/medecin/${filters.medecinId}`;
    } else if (filters.specialisteId) {
      url = `${PRESCRIPTION_BASE_URL}/specialiste/${filters.specialisteId}`;
    } else if (filters.type) {
      url = `${PRESCRIPTION_BASE_URL}/type/${filters.type}`;
    } else if (filters.dateDebut && filters.dateFin) {
      url = `${PRESCRIPTION_BASE_URL}/periode`;
      params.append('dateDebut', filters.dateDebut);
      params.append('dateFin', filters.dateFin);
    }

    const response = await api.get<PrescriptionDTO[]>(url, {
      params: params.toString() ? Object.fromEntries(params) : undefined
    });
    return response.data;
  }
};

export default prescriptionService;