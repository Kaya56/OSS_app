// src/types/personne.ts
export const Genre = {
  M: 'M',
  F: 'F',
} as const;

export type Genre = (typeof Genre)[keyof typeof Genre];


export interface Personne {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  genre: Genre;
  adresse: string;
  telephone: string;
  email: string;
  photoId?: number;
  dateCreation: string;
}

export interface PersonneDTO {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  genre: Genre;
  adresse: string;
  telephone: string;
  email: string;
  photoId?: number;
  dateCreation?: string;
}

export interface PersonneFormData {
  nom: string;
  prenom: string;
  dateNaissance: string;
  genre: Genre;
  adresse: string;
  telephone: string;
  email: string;
}

export interface PersonneSearchParams {
  nom?: string;
  email?: string;
  telephone?: string;
}