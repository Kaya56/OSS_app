package com.securitesociale.dto;

import com.securitesociale.entity.enums.TypePrescription;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionDTO {

    private Long id;

    @NotNull(message = "L'ID de la consultation est obligatoire")
    private Long consultationId;

    @NotNull(message = "Le type de prescription est obligatoire")
    private TypePrescription type;

    private String detailsMedicament;

    private Long specialisteId;
}