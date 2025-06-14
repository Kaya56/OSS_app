// src/types/prescription.ts
export const TypePrescription =  {
  MEDICAMENT: 'MEDICAMENT',
  EXAMEN: 'EXAMEN',
  SOIN: 'SOIN',
  CONSULTATION_SPECIALISTE: 'CONSULTATION_SPECIALISTE',
  AUTRE: 'AUTRE'
}

export type TypePrescription = (typeof TypePrescription)[keyof typeof TypePrescription];

export interface Prescription {
  id?: number;
  consultationId: number;
  type: TypePrescription;
  detailsMedicament?: string;
  specialisteId?: number;
  // Relations pour l'affichage
  consultation?: {
    id: number;
    dateConsultation: string;
    assure?: {
      nom: string;
      prenom: string;
    };
    medecin?: {
      nom: string;
      prenom: string;
    };
  };
  specialiste?: {
    id: number;
    nom: string;
    prenom: string;
    specialite: string;
  };
}

export interface PrescriptionDTO {
  id?: number;
  consultationId: number;
  type: TypePrescription;
  detailsMedicament?: string;
  specialisteId?: number;
}

export interface CreatePrescriptionRequest {
  consultationId: number;
  type: TypePrescription;
  detailsMedicament?: string;
  specialisteId?: number;
}

export interface UpdatePrescriptionRequest {
  type: TypePrescription;
  detailsMedicament?: string;
  specialisteId?: number;
}

export interface PrescriptionFilters {
  consultationId?: number;
  type?: TypePrescription;
  assureId?: number;
  medecinId?: number;
  specialisteId?: number;
  dateDebut?: string;
  dateFin?: string;
}

export interface PrescriptionStats {
  totalPrescriptions: number;
  prescriptionsMedicaments: number;
  prescriptionsExamens: number;
  prescriptionsSoins: number;
  prescriptionsConsultationsSpecialistes: number;
}

// Types pour les options de sélection
export interface TypePrescriptionOption {
  value: TypePrescription;
  label: string;
}

export const TYPE_PRESCRIPTION_OPTIONS: TypePrescriptionOption[] = [
  { value: TypePrescription.MEDICAMENT, label: 'Médicament' },
  { value: TypePrescription.EXAMEN, label: 'Examen' },
  { value: TypePrescription.SOIN, label: 'Soin' },
  { value: TypePrescription.CONSULTATION_SPECIALISTE, label: 'Consultation Spécialiste' },
  { value: TypePrescription.AUTRE, label: 'Autre' }
];

export const getTypePrescriptionLabel = (type: TypePrescription): string => {
  const option = TYPE_PRESCRIPTION_OPTIONS.find(opt => opt.value === type);
  return option?.label || type;
};