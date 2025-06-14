import { MethodePaiement } from "./assure";

export const StatutRemboursement = {
  EN_ATTENTE: 'EN_ATTENTE',
  TRAITE: 'TRAITE',
  REFUSE: 'REFUSE'
}

export type StatutRemboursement = (typeof StatutRemboursement)[keyof typeof StatutRemboursement];


export interface RemboursementDTO {
  id?: number;
  consultationId: number;
  montant: number;
  methode: MethodePaiement;
  statut: StatutRemboursement;
  dateTraitement?: string;
  dateCreation: string;
}

export interface ConsultationDTO {
  id?: number;
  assureId: number;
  medecinId: number;
  date: string;
  cout: number;
  detailsMedical?: string;
}

export interface RemboursementStats {
  totalRemboursements: number;
  montantTotal: number;
  enAttente: number;
  traites: number;
  refuses: number;
  montantMoyenTraite: number;
}

export interface CreateRemboursementRequest {
  consultationId: number;
  methode: MethodePaiement;
}

export interface RemboursementFilters {
  statut?: StatutRemboursement;
  methode?: MethodePaiement;
  assureId?: number;
  dateDebut?: string;
  dateFin?: string;
}

// Utilitaires pour les labels
export const MethodePaiementLabels: Record<MethodePaiement, string> = {
  [MethodePaiement.VIREMENT]: 'Virement bancaire',
  [MethodePaiement.CASH]: 'Espèces'
};

export const StatutRemboursementLabels: Record<StatutRemboursement, string> = {
  [StatutRemboursement.EN_ATTENTE]: 'En attente',
  [StatutRemboursement.TRAITE]: 'Traité',
  [StatutRemboursement.REFUSE]: 'Refusé'
};

export const StatutRemboursementColors: Record<StatutRemboursement, string> = {
  [StatutRemboursement.EN_ATTENTE]: 'bg-yellow-100 text-yellow-800',
  [StatutRemboursement.TRAITE]: 'bg-green-100 text-green-800',
  [StatutRemboursement.REFUSE]: 'bg-red-100 text-red-800'
};