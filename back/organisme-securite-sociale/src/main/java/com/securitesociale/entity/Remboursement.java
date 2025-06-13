package com.securitesociale.entity;

import com.securitesociale.entity.enums.MethodePaiement;
import com.securitesociale.entity.enums.StatutRemboursement;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "remboursements")
@Data
@AllArgsConstructor
@Builder
public class Remboursement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La consultation est obligatoire")
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consultation_id", nullable = false)
    private Consultation consultation;

    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.0", message = "Le montant doit être positif ou nul")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;

    @NotNull(message = "La méthode de paiement est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MethodePaiement methode;

    @NotNull(message = "Le statut est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutRemboursement statut;

    @Column(name = "date_traitement")
    private LocalDateTime dateTraitement;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;

    public Remboursement() {
        this.dateCreation = LocalDateTime.now();
        this.statut = StatutRemboursement.EN_ATTENTE;
    }

    public void traiter() {
        this.statut = StatutRemboursement.TRAITE;
        this.dateTraitement = LocalDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Remboursement)) return false;
        Remboursement that = (Remboursement) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}