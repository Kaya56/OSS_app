package com.securitesociale.controller;

import com.securitesociale.dto.MedecinDTO;
import com.securitesociale.entity.Medecin;
import com.securitesociale.service.MedecinService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/medecins")
public class MedecinController {

    @Autowired
    private MedecinService medecinService;

    /**
     * Créer un nouveau médecin
     */
    @PostMapping
    public ResponseEntity<MedecinDTO> createMedecin(@Valid @RequestBody MedecinDTO medecinDTO) {
        Medecin medecin = mapToEntity(medecinDTO);
        Medecin createdMedecin = medecinService.creerMedecin(medecin);
        return new ResponseEntity<>(mapToDTO(createdMedecin), HttpStatus.CREATED);
    }

    /**
     * Obtenir tous les médecins
     */
    @GetMapping
    public ResponseEntity<List<MedecinDTO>> getAllMedecins() {
        List<MedecinDTO> medecinDTOs = medecinService.obtenirTousMedecins()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(medecinDTOs);
    }

    /**
     * Obtenir un médecin par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<MedecinDTO> getMedecinById(@PathVariable Long id) {
        Medecin medecin = medecinService.obtenirMedecinParId(id);
        return ResponseEntity.ok(mapToDTO(medecin));
    }

    /**
     * Obtenir un médecin par ID de personne
     */
    @GetMapping("/personne/{personneId}")
    public ResponseEntity<MedecinDTO> getMedecinByPersonneId(@PathVariable Long personneId) {
        Optional<Medecin> medecinOpt = medecinService.obtenirMedecinParPersonneId(personneId);
        return medecinOpt.map(medecin -> ResponseEntity.ok(mapToDTO(medecin)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Obtenir tous les généralistes
     */
    @GetMapping("/generalistes")
    public ResponseEntity<List<MedecinDTO>> getGeneralistes() {
        List<MedecinDTO> medecinDTOs = medecinService.obtenirGeneralistes()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(medecinDTOs);
    }

    /**
     * Obtenir tous les spécialistes
     */
    @GetMapping("/specialistes")
    public ResponseEntity<List<MedecinDTO>> getSpecialistes() {
        List<MedecinDTO> medecinDTOs = medecinService.obtenirSpecialistes()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(medecinDTOs);
    }

    /**
     * Obtenir les spécialistes par spécialisation
     */
    @GetMapping("/specialistes/{specialisation}")
    public ResponseEntity<List<MedecinDTO>> getSpecialistesBySpecialisation(@PathVariable String specialisation) {
        List<MedecinDTO> medecinDTOs = medecinService.obtenirSpecialistesParSpecialisation(specialisation)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(medecinDTOs);
    }

    /**
     * Rechercher des médecins par nom
     */
    @GetMapping("/search")
    public ResponseEntity<List<MedecinDTO>> searchMedecinsByNom(@RequestParam String nom) {
        List<MedecinDTO> medecinDTOs = medecinService.rechercherMedecinsParNom(nom)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(medecinDTOs);
    }

    /**
     * Mettre à jour un médecin
     */
    @PutMapping("/{id}")
    public ResponseEntity<MedecinDTO> updateMedecin(@PathVariable Long id, @Valid @RequestBody MedecinDTO medecinDTO) {
        Medecin medecin = mapToEntity(medecinDTO);
        Medecin updatedMedecin = medecinService.mettreAJourMedecin(id, medecin);
        return ResponseEntity.ok(mapToDTO(updatedMedecin));
    }

    /**
     * Supprimer un médecin
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedecin(@PathVariable Long id) {
        medecinService.supprimerMedecin(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Vérifier si une personne est médecin
     */
    @GetMapping("/exists/personne/{personneId}")
    public ResponseEntity<Boolean> isMedecin(@PathVariable Long personneId) {
        return ResponseEntity.ok(medecinService.estMedecin(personneId));
    }

    /**
     * Vérifier si un médecin est généraliste
     */
    @GetMapping("/{id}/generaliste")
    public ResponseEntity<Boolean> isGeneraliste(@PathVariable Long id) {
        return ResponseEntity.ok(medecinService.estGeneraliste(id));
    }

    /**
     * Vérifier si un médecin est spécialiste
     */
    @GetMapping("/{id}/specialiste")
    public ResponseEntity<Boolean> isSpecialiste(@PathVariable Long id) {
        return ResponseEntity.ok(medecinService.estSpecialiste(id));
    }

    /**
     * Obtenir toutes les spécialisations disponibles
     */
    @GetMapping("/specialisations")
    public ResponseEntity<List<String>> getAllSpecialisations() {
        return ResponseEntity.ok(medecinService.obtenirToutesSpecialisations());
    }

    // Mapper Medecin vers MedecinDTO
    private MedecinDTO mapToDTO(Medecin medecin) {
        return MedecinDTO.builder()
                .id(medecin.getId())
                .personneId(medecin.getId())
                .nom(medecin.getNom())
                .dateNaissance(medecin.getDateNaissance())
                .genre(medecin.getGenre())
                .adresse(medecin.getAdresse())
                .telephone(medecin.getTelephone())
                .email(medecin.getEmail())
                .specialisation(medecin.getSpecialisation())
                .build();
    }

    // Mapper MedecinDTO vers Medecin
    private Medecin mapToEntity(MedecinDTO medecinDTO) {
        Medecin medecin = new Medecin();
        medecin.setId(medecinDTO.getPersonneId());
        medecin.setSpecialisation(medecinDTO.getSpecialisation());
        medecin.setNom(medecinDTO.getNom());
        medecin.setDateNaissance(medecinDTO.getDateNaissance());
        medecin.setGenre(medecinDTO.getGenre());
        medecin.setAdresse(medecinDTO.getAdresse());
        medecin.setTelephone(medecinDTO.getTelephone());
        medecin.setEmail(medecinDTO.getEmail());
        return medecin;
    }
}