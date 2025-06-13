package com.securitesociale.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medias")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom du fichier est obligatoire")
    @Size(max = 255, message = "Le nom du fichier ne peut pas dépasser 255 caractères")
    @Column(nullable = false)
    private String fileName;

    @NotBlank(message = "Le type MIME est obligatoire")
    @Size(max = 100, message = "Le type MIME ne peut pas dépasser 100 caractères")
    @Column(nullable = false)
    private String mimeType;

    @Positive(message = "La taille doit être positive")
    @Column(nullable = false)
    private Long fileSize;

    @NotBlank(message = "Le chemin est obligatoire")
    @Size(max = 255, message = "Le chemin ne peut pas dépasser 255 caractères")
    @Column(nullable = false)
    private String filePath;

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDateTime.now();
    }
}