package com.securitesociale.dto;

import com.securitesociale.entity.enums.MethodePaiement;
import com.securitesociale.entity.enums.StatutRemboursement;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RemboursementDTO {

    private Long id;

    @NotNull(message = "L'ID de la consultation est obligatoire")
    private Long consultationId;

    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.0", message = "Le montant doit être positif ou nul")
    private BigDecimal montant;

    @NotNull(message = "La méthode de paiement est obligatoire")
    private MethodePaiement methode;

    @NotNull(message = "Le statut est obligatoire")
    private StatutRemboursement statut;

    private LocalDateTime dateTraitement;

    @NotNull(message = "La date de création est obligatoire")
    private LocalDateTime dateCreation;
}