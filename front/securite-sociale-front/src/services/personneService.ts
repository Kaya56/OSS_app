// src/services/personneService.ts
import api from './api';
import type { PersonneDTO } from '../types/personne';

export const personneService = {
  // Créer une nouvelle personne
  async createPersonne(personneData: Omit<PersonneDTO, 'id' | 'dateCreation'>): Promise<PersonneDTO> {
    const response = await api.post('/personnes', personneData);
    return response.data;
  },

  // Obtenir toutes les personnes
  async getAllPersonnes(): Promise<PersonneDTO[]> {
    const response = await api.get('/personnes');
    return response.data;
  },

  // Obtenir une personne par ID
  async getPersonneById(id: number): Promise<PersonneDTO> {
    const response = await api.get(`/personnes/${id}`);
    return response.data;
  },

  // Rechercher par nom
  async searchByNom(nom: string): Promise<PersonneDTO[]> {
    const response = await api.get(`/personnes/search/nom?nom=${encodeURIComponent(nom)}`);
    return response.data;
  },

  // Rechercher par email
  async searchByEmail(email: string): Promise<PersonneDTO | null> {
    try {
      const response = await api.get(`/personnes/search/email?email=${encodeURIComponent(email)}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Rechercher par téléphone
  async searchByTelephone(telephone: string): Promise<PersonneDTO[]> {
    const response = await api.get(`/personnes/search/telephone?telephone=${encodeURIComponent(telephone)}`);
    return response.data;
  },

  // Mettre à jour une personne
  async updatePersonne(id: number, personneData: Omit<PersonneDTO, 'id' | 'dateCreation'>): Promise<PersonneDTO> {
    const response = await api.put(`/personnes/${id}`, personneData);
    return response.data;
  },

  // Supprimer une personne
  async deletePersonne(id: number): Promise<void> {
    await api.delete(`/personnes/${id}`);
  },

  // Vérifier si une personne existe
  async personneExists(id: number): Promise<boolean> {
    const response = await api.get(`/personnes/exists/${id}`);
    return response.data;
  },

  // Upload photo de profil
  async uploadPhotoProfil(id: number, file: File): Promise<PersonneDTO> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/personnes/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};