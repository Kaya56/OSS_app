package com.securitesociale.entity;

import com.securitesociale.entity.enums.TypePrescription;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.Objects;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La consultation est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consultation_id", nullable = false)
    private Consultation consultation;

    @NotNull(message = "Le type de prescription est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypePrescription type;

    @Column(name = "details_medicament", columnDefinition = "TEXT")
    private String detailsMedicament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialiste_id")
    private Medecin specialiste;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Prescription)) return false;
        Prescription that = (Prescription) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}