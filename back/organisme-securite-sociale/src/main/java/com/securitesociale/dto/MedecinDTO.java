package com.securitesociale.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedecinDTO {

    private Long id;

    @NotNull(message = "L'ID de la personne est obligatoire")
    private Long personneId;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100, message = "Le nom ne peut pas dépasser 100 caractères")
    private String nom;

    @NotNull(message = "La date de naissance est obligatoire")
    @Past(message = "La date de naissance doit être dans le passé")
    private LocalDate dateNaissance;

    @NotBlank(message = "Le genre est obligatoire")
    @Pattern(regexp = "^(M|F|AUTRE)$", message = "Le genre doit être M, F ou AUTRE")
    private String genre;

    @NotBlank(message = "L'adresse est obligatoire")
    @Size(max = 255, message = "L'adresse ne peut pas dépasser 255 caractères")
    private String adresse;

    @Pattern(regexp = "^\\+?[0-9]{8,15}$", message = "Format de téléphone invalide")
    private String telephone;

    @Email(message = "Format d'email invalide")
    @Size(max = 100, message = "L'email ne peut pas dépasser 100 caractères")
    private String email;

    @Size(max = 100, message = "La spécialisation ne peut pas dépasser 100 caractères")
    private String specialisation;
}