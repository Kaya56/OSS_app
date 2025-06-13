package com.securitesociale.controller;

import com.securitesociale.dto.PersonneDTO;
import com.securitesociale.entity.Personne;
import com.securitesociale.service.PersonneService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/personnes")
public class PersonneController {

    @Autowired
    private PersonneService personneService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PersonneDTO> createPersonne(@Valid @RequestBody PersonneDTO personneDTO) {
        Personne personne = mapToEntity(personneDTO);
        Personne createdPersonne = personneService.creerPersonne(personne);
        return new ResponseEntity<>(mapToDTO(createdPersonne), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PersonneDTO>> getAllPersonnes() {
        List<PersonneDTO> personneDTOs = personneService.getAllPersonnes()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(personneDTOs);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<PersonneDTO> getPersonneById(@PathVariable Long id) {
        Personne personne = personneService.getPersonneById(id);
        return ResponseEntity.ok(mapToDTO(personne));
    }

    @GetMapping("/search/nom")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<PersonneDTO>> searchByNom(@RequestParam String nom) {
        List<PersonneDTO> personneDTOs = personneService.rechercherParNom(nom)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(personneDTOs);
    }

    @GetMapping("/search/email")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<PersonneDTO> searchByEmail(@RequestParam String email) {
        Optional<Personne> personneOpt = personneService.rechercherParEmail(email);
        return personneOpt.map(personne -> ResponseEntity.ok(mapToDTO(personne)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search/telephone")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<PersonneDTO>> searchByTelephone(@RequestParam String telephone) {
        List<PersonneDTO> personneDTOs = personneService.rechercherParTelephone(telephone)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(personneDTOs);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PersonneDTO> updatePersonne(@PathVariable Long id, @Valid @RequestBody PersonneDTO personneDTO) {
        Personne personne = mapToEntity(personneDTO);
        Personne updatedPersonne = personneService.mettreAJourPersonne(id, personne);
        return ResponseEntity.ok(mapToDTO(updatedPersonne));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePersonne(@PathVariable Long id) {
        personneService.supprimerPersonne(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exists/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Boolean> personneExiste(@PathVariable Long id) {
        return ResponseEntity.ok(personneService.personneExiste(id));
    }

    @PostMapping("/{id}/photo")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<PersonneDTO> uploadPhotoProfil(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Personne personne = personneService.uploadPhotoProfil(id, file);
        return ResponseEntity.ok(mapToDTO(personne));
    }

    private PersonneDTO mapToDTO(Personne personne) {
        return PersonneDTO.builder()
                .id(personne.getId())
                .nom(personne.getNom())
                .prenom(personne.getPrenom())
                .dateNaissance(personne.getDateNaissance())
                .genre(personne.getGenre())
                .adresse(personne.getAdresse())
                .telephone(personne.getTelephone())
                .email(personne.getEmail())
                .photoId(personne.getPhoto() != null ? personne.getPhoto().getId() : null)
                .dateCreation(personne.getDateCreation())
                .build();
    }

    private Personne mapToEntity(PersonneDTO personneDTO) {
        return Personne.builder()
                .id(personneDTO.getId())
                .nom(personneDTO.getNom())
                .prenom(personneDTO.getPrenom())
                .dateNaissance(personneDTO.getDateNaissance())
                .genre(personneDTO.getGenre())
                .adresse(personneDTO.getAdresse())
                .telephone(personneDTO.getTelephone())
                .email(personneDTO.getEmail())
                .build();
    }
}