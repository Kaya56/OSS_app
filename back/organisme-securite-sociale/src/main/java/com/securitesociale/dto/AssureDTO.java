package com.securitesociale.dto;

import com.securitesociale.entity.enums.Genre;
import com.securitesociale.entity.enums.MethodePaiement;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssureDTO {

    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100, message = "Le nom ne peut pas dépasser 100 caractères")
    private String nom;

    @NotNull(message = "La date de naissance est obligatoire")
    @Past(message = "La date de naissance doit être dans le passé")
    private LocalDate dateNaissance;

    @NotNull(message = "Le genre est obligatoire")
    @Pattern(regexp = "^(M|F|AUTRE)$", message = "Le genre doit être M, F ou AUTRE")
    private Genre genre;

    @NotBlank(message = "L'adresse est obligatoire")
    @Size(max = 255, message = "L'adresse ne peut pas dépasser 255 caractères")
    private String adresse;

    @Pattern(regexp = "^\\+?[0-9]{8,15}$", message = "Format de téléphone invalide")
    private String telephone;

    @Email(message = "Format d'email invalide")
    @Size(max = 100, message = "L'email ne peut pas dépasser 100 caractères")
    private String email;

    @NotBlank(message = "Le numéro d'assurance est obligatoire")
    @Pattern(regexp = "^[0-9]{13}$", message = "Le numéro d'assurance doit contenir exactement 13 chiffres")
    private String numeroAssurance;

    @NotNull(message = "La méthode de paiement préférée est obligatoire")
    private MethodePaiement methodePaiementPreferee;

    private Long medecinTraitantId;
}