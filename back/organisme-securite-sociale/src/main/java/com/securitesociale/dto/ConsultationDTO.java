package com.securitesociale.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultationDTO {

    private Long id;

    @NotNull(message = "L'ID de l'assuré est obligatoire")
    private Long assureId;

    @NotNull(message = "L'ID du médecin est obligatoire")
    private Long medecinId;

    @NotNull(message = "La date est obligatoire")
    @PastOrPresent(message = "La date ne peut pas être dans le futur")
    private LocalDateTime date;

    @NotNull(message = "Le coût est obligatoire")
    @DecimalMin(value = "0.01", message = "Le coût doit être positif")
    private BigDecimal cout;

    @Size(max = 1000, message = "Les détails médicaux ne peuvent pas dépasser 1000 caractères")
    private String detailsMedical;
}