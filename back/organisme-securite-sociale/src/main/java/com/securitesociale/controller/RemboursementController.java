package com.securitesociale.controller;

import com.securitesociale.dto.RemboursementDTO;
import com.securitesociale.entity.Remboursement;
import com.securitesociale.entity.enums.MethodePaiement;
import com.securitesociale.entity.enums.StatutRemboursement;
import com.securitesociale.service.RemboursementService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/remboursements")
public class RemboursementController {

    @Autowired
    private RemboursementService remboursementService;

    /**
     * Créer un remboursement manuel
     */
    @PostMapping
    public ResponseEntity<RemboursementDTO> createRemboursement(@Valid @RequestBody RemboursementDTO remboursementDTO) {
        Remboursement remboursement = remboursementService.creerRemboursement(remboursementDTO.getConsultationId(), remboursementDTO.getMethode());
        return new ResponseEntity<>(mapToDTO(remboursement), HttpStatus.CREATED);
    }

    /**
     * Obtenir tous les remboursements
     */
    @GetMapping
    public ResponseEntity<List<RemboursementDTO>> getAllRemboursements() {
        List<RemboursementDTO> remboursementDTOs = remboursementService.obtenirTousRemboursements()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(remboursementDTOs);
    }

    /**
     * Obtenir un remboursement par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<RemboursementDTO> getRemboursementById(@PathVariable Long id) {
        Remboursement remboursement = remboursementService.obtenirRemboursementParId(id);
        return ResponseEntity.ok(mapToDTO(remboursement));
    }

    /**
     * Obtenir les remboursements par statut
     */
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<RemboursementDTO>> getRemboursementsByStatut(@PathVariable StatutRemboursement statut) {
        List<RemboursementDTO> remboursementDTOs = remboursementService.obtenirRemboursementsParStatut(statut)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(remboursementDTOs);
    }

    /**
     * Obtenir les remboursements en attente
     */
    @GetMapping("/en-attente")
    public ResponseEntity<List<RemboursementDTO>> getRemboursementsEnAttente() {
        List<RemboursementDTO> remboursementDTOs = remboursementService.obtenirRemboursementsEnAttente()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(remboursementDTOs);
    }

    /**
     * Obtenir les remboursements traités
     */
    @GetMapping("/traites")
    public ResponseEntity<List<RemboursementDTO>> getRemboursementsTraites() {
        List<RemboursementDTO> remboursementDTOs = remboursementService.obtenirRemboursementsTraites()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(remboursementDTOs);
    }

    /**
     * Obtenir les remboursements refusés
     */
    @GetMapping("/refuses")
    public ResponseEntity<List<RemboursementDTO>> getRemboursementsRefuses() {
        List<RemboursementDTO> remboursementDTOs = remboursementService.obtenirRemboursementsRefuses()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(remboursementDTOs);
    }

    /**
     * Obtenir les remboursements d'un assuré
     */
    @GetMapping("/assure/{assureId}")
    public ResponseEntity<List<RemboursementDTO>> getRemboursementsByAssure(@PathVariable Long assureId) {
        List<RemboursementDTO> remboursementDTOs = remboursementService.obtenirRemboursementsParAssure(assureId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(remboursementDTOs);
    }

    /**
     * Obtenir les remboursements par méthode de paiement
     */
    @GetMapping("/methode/{methode}")
    public ResponseEntity<List<RemboursementDTO>> getRemboursementsByMethode(@PathVariable MethodePaiement methode) {
        List<RemboursementDTO> remboursementDTOs = remboursementService.obtenirRemboursementsParMethode(methode)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(remboursementDTOs);
    }

    /**
     * Obtenir les remboursements par période
     */
    @GetMapping("/periode")
    public ResponseEntity<List<RemboursementDTO>> getRemboursementsByPeriode(
            @RequestParam("dateDebut") String dateDebutStr,
            @RequestParam("dateFin") String dateFinStr) {
        LocalDateTime dateDebut = LocalDateTime.parse(dateDebutStr);
        LocalDateTime dateFin = LocalDateTime.parse(dateFinStr);
        List<RemboursementDTO> remboursementDTOs = remboursementService.obtenirRemboursementsParPeriode(dateDebut, dateFin)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(remboursementDTOs);
    }

    /**
     * Traiter un remboursement
     */
    @PutMapping("/{id}/traiter")
    public ResponseEntity<RemboursementDTO> traiterRemboursement(@PathVariable Long id) {
        Remboursement remboursement = remboursementService.traiterRemboursement(id);
        return ResponseEntity.ok(mapToDTO(remboursement));
    }

    /**
     * Refuser un remboursement
     */
    @PutMapping("/{id}/refuser")
    public ResponseEntity<RemboursementDTO> refuserRemboursement(@PathVariable Long id, @RequestParam @NotBlank String motif) {
        Remboursement remboursement = remboursementService.refuserRemboursement(id, motif);
        return ResponseEntity.ok(mapToDTO(remboursement));
    }

    /**
     * Annuler un traitement de remboursement
     */
    @PutMapping("/{id}/annuler")
    public ResponseEntity<RemboursementDTO> annulerTraitementRemboursement(@PathVariable Long id) {
        Remboursement remboursement = remboursementService.annulerTraitementRemboursement(id);
        return ResponseEntity.ok(mapToDTO(remboursement));
    }

    /**
     * Modifier la méthode de paiement
     */
    @PutMapping("/{id}/methode")
    public ResponseEntity<RemboursementDTO> modifierMethodePaiement(@PathVariable Long id, @RequestParam MethodePaiement methode) {
        Remboursement remboursement = remboursementService.modifierMethodePaiement(id, methode);
        return ResponseEntity.ok(mapToDTO(remboursement));
    }

    /**
     * Recalculer le montant
     */
    @PutMapping("/{id}/recalculer")
    public ResponseEntity<RemboursementDTO> recalculerMontant(@PathVariable Long id) {
        Remboursement remboursement = remboursementService.recalculerMontant(id);
        return ResponseEntity.ok(mapToDTO(remboursement));
    }

    /**
     * Supprimer un remboursement
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerRemboursement(@PathVariable Long id) {
        remboursementService.supprimerRemboursement(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Traiter tous les remboursements en attente
     */
    @PutMapping("/traiter-tous")
    public ResponseEntity<List<RemboursementDTO>> traiterTousRemboursementsEnAttente() {
        List<RemboursementDTO> remboursementDTOs = remboursementService.traiterTousRemboursementsEnAttente()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(remboursementDTOs);
    }

    /**
     * Obtenir les statistiques des remboursements
     */
    @GetMapping("/stats")
    public ResponseEntity<RemboursementService.RemboursementStats> getStatistiques() {
        RemboursementService.RemboursementStats stats = remboursementService.obtenirStatistiques();
        return ResponseEntity.ok(stats);
    }

    /**
     * Obtenir le remboursement d'une consultation
     */
    @GetMapping("/consultation/{consultationId}")
    public ResponseEntity<RemboursementDTO> getRemboursementByConsultation(@PathVariable Long consultationId) {
        Optional<Remboursement> remboursementOpt = remboursementService.obtenirRemboursementParConsultation(consultationId);
        return remboursementOpt.map(remboursement -> ResponseEntity.ok(mapToDTO(remboursement)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Mapper Remboursement vers RemboursementDTO
    private RemboursementDTO mapToDTO(Remboursement remboursement) {
        return RemboursementDTO.builder()
                .id(remboursement.getId())
                .consultationId(remboursement.getConsultation().getId())
                .montant(remboursement.getMontant())
                .methode(remboursement.getMethode())
                .statut(remboursement.getStatut())
                .dateTraitement(remboursement.getDateTraitement())
                .dateCreation(remboursement.getDateCreation())
                .build();
    }
}