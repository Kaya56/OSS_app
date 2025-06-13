package com.securitesociale.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "personnes")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Personne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100, message = "Le nom ne peut pas dépasser 100 caractères")
    @Column(nullable = false, length = 100)
    private String nom;

    @NotNull(message = "La date de naissance est obligatoire")
    @Past(message = "La date de naissance doit être dans le passé")
    @Column(name = "date_naissance", nullable = false)
    private LocalDate dateNaissance;

    @NotBlank(message = "Le genre est obligatoire")
    @Pattern(regexp = "^(M|F|AUTRE)$", message = "Le genre doit être M, F ou AUTRE")
    @Column(nullable = false, length = 10)
    private String genre;

    @NotBlank(message = "L'adresse est obligatoire")
    @Size(max = 255, message = "L'adresse ne peut pas dépasser 255 caractères")
    @Column(nullable = false)
    private String adresse;

    @Pattern(regexp = "^\\+?[0-9]{8,15}$", message = "Format de téléphone invalide")
    @Column(length = 20)
    private String telephone;

    @Email(message = "Format d'email invalide")
    @Column(length = 100)
    private String email;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Personne)) return false;
        Personne personne = (Personne) o;
        return Objects.equals(id, personne.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}