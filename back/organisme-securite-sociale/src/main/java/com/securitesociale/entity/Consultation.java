package com.securitesociale.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "consultations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La date de consultation est obligatoire")
    @Column(nullable = false)
    private LocalDateTime date;

    @NotNull(message = "L'assuré est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assure_id", nullable = false)
    private Assure assure;

    @NotNull(message = "Le médecin est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medecin_id", nullable = false)
    private Medecin medecin;

    @NotNull(message = "Le coût est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "Le coût doit être positif")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cout;

    @Column(name = "details_medical", columnDefinition = "TEXT")
    private String detailsMedical;

    @OneToMany(mappedBy = "consultation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Prescription> prescriptions = new ArrayList<>();

    @OneToOne(mappedBy = "consultation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Remboursement remboursement;

    public void addPrescription(Prescription prescription) {
        prescriptions.add(prescription);
        prescription.setConsultation(this);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Consultation)) return false;
        Consultation that = (Consultation) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}