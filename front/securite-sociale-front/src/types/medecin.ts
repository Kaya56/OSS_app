// types/medecin.ts

export interface Medecin {
  id: number;
  personneId: number;
  nom: string;
  prenom?: string;
  dateNaissance: string;
  genre: 'M' | 'F' | 'AUTRE';
  adresse: string;
  telephone: string;
  email: string;
  specialisation?: string;
  // Propriétés calculées côté front
  isGeneraliste?: boolean;
}

export interface MedecinFormData {
  nom: string;
  prenom: string;
  dateNaissance: string;
  genre: 'M' | 'F' | 'AUTRE';
  adresse: string;
  telephone: string;
  email: string;
  specialisation?: string;
}

export interface MedecinSearchFilters {
  nom?: string;
  specialisation?: string;
  type?: 'generaliste' | 'specialiste' | 'tous';
}

export interface CreateMedecinRequest extends MedecinFormData {}

export interface UpdateMedecinRequest extends Partial<MedecinFormData> {}

export interface MedecinStats {
  totalMedecins: number;
  generalistes: number;
  specialistes: number;
  specialisations: string[];
}

// Fonction utilitaire pour déterminer si un médecin est généraliste
export const isGeneraliste = (medecin: Medecin): boolean => {
  return !medecin.specialisation || medecin.specialisation.trim() === '';
};

// Fonction utilitaire pour déterminer si un médecin est spécialiste
export const isSpecialiste = (medecin: Medecin): boolean => {
  return !isGeneraliste(medecin);
};