// src/types/consultation.ts
export interface Consultation {
  id?: number;
  date: string;
  assureId: number;
  medecinId: number;
  cout: number;
  detailsMedical?: string;
  statut?: StatutConsultation;
  motif?: string;
  prescriptions?: Prescription[];
  remboursement?: Remboursement;
}

export interface ConsultationDTO {
  id?: number;
  date: string;
  assureId: number;
  medecinId: number;
  cout: number;
  detailsMedical?: string;
  statut?: StatutConsultation;
  motif?: string;
}

export interface ConsultationWithDetails extends Consultation {
  assure?: {
    id: number;
    nom: string;
    prenom: string;
    numeroSecuriteSociale: string;
  };
  medecin?: {
    id: number;
    nom: string;
    prenom: string;
    specialisation?: string;
    isGeneraliste: boolean;
  };
}

export interface ConsultationStats {
  totalConsultations: number;
  consultationsGeneralistes: number;
  consultationsSpecialistes: number;
}

export interface ConsultationFilters {
  assureId?: number;
  medecinId?: number;
  dateDebut?: string;
  dateFin?: string;
  typeConsultation?: 'generaliste' | 'specialiste' | 'all';
  statut?: StatutConsultation;
}

export interface CreateConsultationRequest {
  assureId: number;
  medecinId: number;
  cout: number;
  date: string;
  detailsMedical?: string;
  motif?: string;
  prescriptions?: CreatePrescriptionRequest[];
}

export interface UpdateConsultationRequest {
  cout?: number;
  detailsMedical?: string;
  statut?: StatutConsultation;
  motif?: string;
}

export interface CreatePrescriptionRequest {
  type: string;
  detailsMedicament: string;
  specialisteId?: number;
}

// Types pour les enums
export const StatutConsultation = {
  PROGRAMMEE: 'PROGRAMMEE',
  EN_COURS: 'EN_COURS',
  TERMINE: 'TERMINE',
  ANNULEE: 'ANNULEE'
} as const;

export type StatutConsultation = (typeof StatutConsultation)[keyof typeof StatutConsultation];

export const StatutRemboursement = {
  EN_ATTENTE: 'EN_ATTENTE',
  TRAITE: 'TRAITE',
  REFUSE: 'REFUSE'
} as const;

export type StatutRemboursement = (typeof StatutRemboursement)[keyof typeof StatutRemboursement];

// Interfaces pour les entités liées
export interface Prescription {
  id?: number;
  type: string;
  detailsMedicament: string;
  consultationId?: number;
  specialisteId?: number;
}

export interface Remboursement {
  id?: number;
  montant: number;
  statut: StatutRemboursement;
  methode: string;
  consultationId?: number;
}