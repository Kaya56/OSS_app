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

const PRESCRIPTION_BASE_URL = '/prescriptions';

export const prescriptionService = {
  async createPrescription(data: CreatePrescriptionRequest): Promise<Prescription> {
    const response = await api.post<Prescription>(PRESCRIPTION_BASE_URL, data);
    return response.data;
  },

  async getAllPrescriptions(): Promise<Prescription[]> {
    const response = await api.get<Prescription[]>(PRESCRIPTION_BASE_URL);
    return response.data;
  },

  async getPrescriptionById(id: number): Promise<Prescription> {
    const response = await api.get<Prescription>(`${PRESCRIPTION_BASE_URL}/${id}`);
    return response.data;
  },

  async updatePrescription(id: number, data: UpdatePrescriptionRequest): Promise<Prescription> {
    const response = await api.put<Prescription>(`${PRESCRIPTION_BASE_URL}/${id}`, data);
    return response.data;
  },

  async deletePrescription(id: number): Promise<void> {
    await api.delete(`${PRESCRIPTION_BASE_URL}/${id}`);
  },

  async getPrescriptionsByConsultation(consultationId: number): Promise<Prescription[]> {
    const response = await api.get<Prescription[]>(`${PRESCRIPTION_BASE_URL}/consultation/${consultationId}`);
    return response.data;
  },

  async getPrescriptionsByType(type: TypePrescription): Promise<Prescription[]> {
    const response = await api.get<Prescription[]>(`${PRESCRIPTION_BASE_URL}/type/${type}`);
    return response.data;
  },

  async getPrescriptionsMedicaments(): Promise<Prescription[]> {
    const response = await api.get<Prescription[]>(`${PRESCRIPTION_BASE_URL}/medicaments`);
    return response.data;
  },

  async getPrescriptionsByAssure(assureId: number): Promise<Prescription[]> {
    const response = await api.get<Prescription[]>(`${PRESCRIPTION_BASE_URL}/assure/${assureId}`);
    return response.data;
  },

  async getPrescriptionsByAssureAndType(assureId: number, type: TypePrescription): Promise<Prescription[]> {
    const response = await api.get<Prescription[]>(`${PRESCRIPTION_BASE_URL}/assure/${assureId}/type/${type}`);
    return response.data;
  },

  async getPrescriptionsByMedecin(medecinId: number): Promise<Prescription[]> {
    const response = await api.get<Prescription[]>(`${PRESCRIPTION_BASE_URL}/medecin/${medecinId}`);
    return response.data;
  },

  async getPrescriptionsForSpecialiste(specialisteId: number): Promise<Prescription[]> {
    const response = await api.get<Prescription[]>(`${PRESCRIPTION_BASE_URL}/specialiste/${specialisteId}`);
    return response.data;
  },

  async getPrescriptionsByPeriode(dateDebut: string, dateFin: string): Promise<Prescription[]> {
    const response = await api.get<Prescription[]>(`${PRESCRIPTION_BASE_URL}/periode`, {
      params: { dateDebut, dateFin }
    });
    return response.data;
  },

  async countPrescriptionsMedicamentsByAssure(assureId: number): Promise<number> {
    const response = await api.get<number>(`${PRESCRIPTION_BASE_URL}/assure/${assureId}/medicaments/count`);
    return response.data;
  },

  async countPrescriptionsConsultationsByAssure(assureId: number): Promise<number> {
    const response = await api.get<number>(`${PRESCRIPTION_BASE_URL}/assure/${assureId}/consultations/count`);
    return response.data;
  },

  async searchPrescriptions(filters: PrescriptionFilters): Promise<Prescription[]> {
    let url = PRESCRIPTION_BASE_URL;
    let params: Record<string, any> | undefined = undefined;

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
      params = { dateDebut: filters.dateDebut, dateFin: filters.dateFin };
    }

    const response = await api.get<Prescription[]>(url, { params });
    return response.data;
  }
};

export default prescriptionService;
