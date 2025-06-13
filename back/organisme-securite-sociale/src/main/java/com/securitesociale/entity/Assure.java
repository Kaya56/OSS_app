package com.securitesociale.entity;

import com.securitesociale.entity.enums.MethodePaiement;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "assures")
@PrimaryKeyJoinColumn(name = "personne_id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Assure extends Personne {

    @NotBlank(message = "Le numéro d'assurance est obligatoire")
    @Pattern(regexp = "^[0-9]{13}$", message = "Le numéro d'assurance doit contenir 13 chiffres")
    @Column(name = "numero_assurance", nullable = false, unique = true, length = 13)
    private String numeroAssurance;

    @NotNull(message = "La méthode de paiement préférée est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(name = "methode_paiement_preferee", nullable = false)
    private MethodePaiement methodePaiementPreferee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medecin_traitant_id")
    private Medecin medecinTraitant;

    @OneToMany(mappedBy = "assure", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Consultation> consultations = new ArrayList<>();

    public void addConsultation(Consultation consultation) {
        consultations.add(consultation);
        consultation.setAssure(this);
    }
}