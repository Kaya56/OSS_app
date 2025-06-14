import type { Personne } from './personne';
import type { Medecin } from './medecin';
import { Genre } from './personne';

// types/assure.ts
export const MethodePaiement = {
  VIREMENT : 'VIREMENT',
  CASH : 'CASH',
}

export type MethodePaiement = (typeof MethodePaiement)[keyof typeof MethodePaiement];

export interface Assure extends Personne {
  numeroAssurance: string;
  methodePaiementPreferee: MethodePaiement;
  medecinTraitantId?: number;
  medecinTraitantNom?: string; // Pour l'affichage
}

export interface AssureDTO {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  genre: Genre;
  adresse: string;
  telephone: string;
  email: string;
  numeroAssurance: string;
  methodePaiementPreferee: MethodePaiement;
  medecinTraitantId?: number;
}

export interface AssureSearchParams {
  nom?: string;
  numeroAssurance?: string;
  sansMedecin?: boolean;
  methodePaiement?: MethodePaiement;
}

export interface AssureStats {
  totalAssures: number;
  assuresAvecMedecin: number;
  assuresSansMedecin: number;
}

export { Genre };
