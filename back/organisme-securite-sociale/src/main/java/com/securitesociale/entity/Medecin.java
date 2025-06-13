package com.securitesociale.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "medecins")
@PrimaryKeyJoinColumn(name = "personne_id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Medecin extends Personne {

    @Size(max = 100, message = "La spécialisation ne peut pas dépasser 100 caractères")
    @Column(name = "specialisation", length = 100)
    private String specialisation;

    @OneToMany(mappedBy = "medecin", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Consultation> consultations = new ArrayList<>();

    @OneToMany(mappedBy = "medecinTraitant", fetch = FetchType.LAZY)
    private List<Assure> patients = new ArrayList<>();

    public void addConsultation(Consultation consultation) {
        consultations.add(consultation);
        consultation.setMedecin(this);
    }

    public boolean isGeneraliste() {
        return specialisation == null || specialisation.trim().isEmpty();
    }

    public boolean isSpecialiste() {
        return !isGeneraliste();
    }
}