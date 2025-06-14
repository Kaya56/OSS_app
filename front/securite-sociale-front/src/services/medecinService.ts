// services/medecinService.ts
import api from './api';
import type {
    Medecin,
    CreateMedecinRequest,
    UpdateMedecinRequest,
    MedecinSearchFilters
} from '../types/medecin';

const MEDECINS_BASE_URL = '/medecins';

export const medecinService = {
  // Créer un médecin
  async createMedecin(data: CreateMedecinRequest): Promise<Medecin> {
    const response = await api.post(MEDECINS_BASE_URL, data);
    return response.data;
  },

  // Obtenir tous les médecins
  async getAllMedecins(): Promise<Medecin[]> {
    const response = await api.get(MEDECINS_BASE_URL);
    return response.data;
  },

  // Obtenir un médecin par ID
  async getMedecinById(id: number): Promise<Medecin> {
    const response = await api.get(`${MEDECINS_BASE_URL}/${id}`);
    return response.data;
  },

  // Obtenir un médecin par ID de personne
  async getMedecinByPersonneId(personneId: number): Promise<Medecin> {
    const response = await api.get(`${MEDECINS_BASE_URL}/personne/${personneId}`);
    return response.data;
  },

  // Obtenir tous les généralistes
  async getGeneralistes(): Promise<Medecin[]> {
    const response = await api.get(`${MEDECINS_BASE_URL}/generalistes`);
    return response.data;
  },

  // Obtenir tous les spécialistes
  async getSpecialistes(): Promise<Medecin[]> {
    const response = await api.get(`${MEDECINS_BASE_URL}/specialistes`);
    return response.data;
  },

  // Obtenir les spécialistes par spécialisation
  async getSpecialistesBySpecialisation(specialisation: string): Promise<Medecin[]> {
    const response = await api.get(`${MEDECINS_BASE_URL}/specialistes/${encodeURIComponent(specialisation)}`);
    return response.data;
  },

  // Rechercher des médecins par nom
  async searchMedecinsByNom(nom: string): Promise<Medecin[]> {
    const response = await api.get(`${MEDECINS_BASE_URL}/search`, {
      params: { nom }
    });
    return response.data;
  },

  // Mettre à jour un médecin
  async updateMedecin(id: number, data: UpdateMedecinRequest): Promise<Medecin> {
    const response = await api.put(`${MEDECINS_BASE_URL}/${id}`, data);
    return response.data;
  },

  // Supprimer un médecin
  async deleteMedecin(id: number): Promise<void> {
    await api.delete(`${MEDECINS_BASE_URL}/${id}`);
  },

  // Vérifier si une personne est médecin
  async isMedecin(personneId: number): Promise<boolean> {
    const response = await api.get(`${MEDECINS_BASE_URL}/exists/personne/${personneId}`);
    return response.data;
  },

  // Vérifier si un médecin est généraliste
  async isGeneraliste(id: number): Promise<boolean> {
    const response = await api.get(`${MEDECINS_BASE_URL}/${id}/generaliste`);
    return response.data;
  },

  // Vérifier si un médecin est spécialiste
  async isSpecialiste(id: number): Promise<boolean> {
    const response = await api.get(`${MEDECINS_BASE_URL}/${id}/specialiste`);
    return response.data;
  },

  // Obtenir toutes les spécialisations
  async getAllSpecialisations(): Promise<string[]> {
    const response = await api.get(`${MEDECINS_BASE_URL}/specialisations`);
    return response.data;
  },

  // Recherche avancée avec filtres
  async searchMedecins(filters: MedecinSearchFilters): Promise<Medecin[]> {
    let medecins: Medecin[] = [];

    if (filters.type === 'generaliste') {
      medecins = await this.getGeneralistes();
    } else if (filters.type === 'specialiste') {
      medecins = await this.getSpecialistes();
    } else {
      medecins = await this.getAllMedecins();
    }

    // Filtrer par nom si spécifié
    if (filters.nom) {
      medecins = medecins.filter(medecin => 
        medecin.nom.toLowerCase().includes(filters.nom!.toLowerCase())
      );
    }

    // Filtrer par spécialisation si spécifié
    if (filters.specialisation) {
      medecins = medecins.filter(medecin => 
        medecin.specialisation?.toLowerCase().includes(filters.specialisation!.toLowerCase())
      );
    }

    return medecins;
  }
};

export default medecinService;