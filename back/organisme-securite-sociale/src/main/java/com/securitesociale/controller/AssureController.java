package com.securitesociale.controller;

import com.securitesociale.dto.AssureDTO;
import com.securitesociale.entity.Assure;
import com.securitesociale.entity.Medecin;
import com.securitesociale.entity.enums.MethodePaiement;
import com.securitesociale.service.AssureService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assures")
public class AssureController {

    @Autowired
    private AssureService assureService;

    /**
     * Créer un nouvel assuré
     */
    @PostMapping
    public ResponseEntity<AssureDTO> createAssure(@Valid @RequestBody AssureDTO assureDTO) {
        Assure assure = mapToEntity(assureDTO);
        Assure createdAssure = assureService.inscrireAssure(assure);
        AssureDTO createdAssureDTO = mapToDTO(createdAssure);
        return new ResponseEntity<>(createdAssureDTO, HttpStatus.CREATED);
    }

    /**
     * Obtenir tous les assurés
     */
    @GetMapping
    public ResponseEntity<List<AssureDTO>> getAllAssures() {
        List<AssureDTO> assureDTOs = assureService.getAllAssures()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(assureDTOs);
    }

    /**
     * Obtenir un assuré par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<AssureDTO> getAssureById(@PathVariable Long id) {
        Assure assure = assureService.getAssureById(id);
        return ResponseEntity.ok(mapToDTO(assure));
    }

    /**
     * Obtenir un assuré par numéro d'assurance
     */
    @GetMapping("/numero/{numeroAssurance}")
    public ResponseEntity<AssureDTO> getAssureByNumero(@PathVariable String numeroAssurance) {
        Assure assure = assureService.getAssureByNumero(numeroAssurance);
        return ResponseEntity.ok(mapToDTO(assure));
    }

    /**
     * Mettre à jour un assuré
     */
    @PutMapping("/{id}")
    public ResponseEntity<AssureDTO> updateAssure(@PathVariable Long id, @Valid @RequestBody AssureDTO assureDTO) {
        Assure assure = mapToEntity(assureDTO);
        Assure updatedAssure = assureService.mettreAJourAssure(id, assure);
        return ResponseEntity.ok(mapToDTO(updatedAssure));
    }

    /**
     * Supprimer un assuré
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssure(@PathVariable Long id) {
        assureService.supprimerAssure(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Rechercher des assurés par nom
     */
    @GetMapping("/search")
    public ResponseEntity<List<AssureDTO>> searchAssuresByNom(@RequestParam String nom) {
        List<AssureDTO> assureDTOs = assureService.rechercherAssuresParNom(nom)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(assureDTOs);
    }

    /**
     * Obtenir les assurés sans médecin traitant
     */
    @GetMapping("/sans-medecin")
    public ResponseEntity<List<AssureDTO>> getAssuresSansMedecinTraitant() {
        List<AssureDTO> assureDTOs = assureService.getAssuresSansMedecinTraitant()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(assureDTOs);
    }

    /**
     * Obtenir les assurés par méthode de paiement préférée
     */
    @GetMapping("/methode-paiement/{methode}")
    public ResponseEntity<List<AssureDTO>> getAssuresByMethodePaiement(@PathVariable MethodePaiement methode) {
        List<AssureDTO> assureDTOs = assureService.getAssuresParMethodePaiement(methode)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(assureDTOs);
    }

    /**
     * Choisir ou changer de médecin traitant
     */
    @PatchMapping("/{id}/medecin-traitant")
    public ResponseEntity<AssureDTO> choisirMedecinTraitant(@PathVariable Long id, @RequestParam(required = false) Long medecinId) {
        Assure updatedAssure = assureService.choisirMedecinTraitant(id, medecinId);
        return ResponseEntity.ok(mapToDTO(updatedAssure));
    }

    /**
     * Obtenir les assurés d'un médecin traitant
     */
    @GetMapping("/medecin-traitant/{medecinId}")
    public ResponseEntity<List<AssureDTO>> getAssuresByMedecinTraitant(@PathVariable Long medecinId) {
        List<AssureDTO> assureDTOs = assureService.getAssuresParMedecinTraitant(medecinId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(assureDTOs);
    }

    /**
     * Obtenir le nombre total d'assurés
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getNombreTotalAssures() {
        return ResponseEntity.ok(assureService.getNombreTotalAssures());
    }

    /**
     * Obtenir le nombre d'assurés avec médecin traitant
     */
    @GetMapping("/count/avec-medecin")
    public ResponseEntity<Long> getNombreAssuresAvecMedecinTraitant() {
        return ResponseEntity.ok(assureService.getNombreAssuresAvecMedecinTraitant());
    }

    /**
     * Vérifier si une personne est assurée
     */
    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> isAssure(@PathVariable Long id) {
        return ResponseEntity.ok(assureService.isAssure(id));
    }

    // Mapper Assure vers AssureDTO
    private AssureDTO mapToDTO(Assure assure) {
        return AssureDTO.builder()
                .id(assure.getId())
                .nom(assure.getNom())
                .dateNaissance(assure.getDateNaissance())
                .genre(assure.getGenre())
                .adresse(assure.getAdresse())
                .telephone(assure.getTelephone())
                .email(assure.getEmail())
                .numeroAssurance(assure.getNumeroAssurance())
                .methodePaiementPreferee(assure.getMethodePaiementPreferee())
                .medecinTraitantId(assure.getMedecinTraitant() != null ? assure.getMedecinTraitant().getId() : null)
                .build();
    }

    // Mapper AssureDTO vers Assure
    private Assure mapToEntity(AssureDTO assureDTO) {
        Assure assure = new Assure();
        assure.setId(assureDTO.getId());
        assure.setNom(assureDTO.getNom());
        assure.setDateNaissance(assureDTO.getDateNaissance());
        assure.setGenre(assureDTO.getGenre());
        assure.setAdresse(assureDTO.getAdresse());
        assure.setTelephone(assureDTO.getTelephone());
        assure.setEmail(assureDTO.getEmail());
        assure.setNumeroAssurance(assureDTO.getNumeroAssurance());
        assure.setMethodePaiementPreferee(assureDTO.getMethodePaiementPreferee());
        if (assureDTO.getMedecinTraitantId() != null) {
            Medecin medecin = new Medecin();
            medecin.setId(assureDTO.getMedecinTraitantId());
            assure.setMedecinTraitant(medecin);
        }
        return assure;
    }
}