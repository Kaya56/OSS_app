package com.securitesociale.controller;

import com.securitesociale.dto.ConsultationDTO;
import com.securitesociale.entity.Assure;
import com.securitesociale.entity.Consultation;
import com.securitesociale.entity.Medecin;
import com.securitesociale.entity.Prescription;
import com.securitesociale.service.ConsultationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    @Autowired
    private ConsultationService consultationService;

    /**
     * Créer une nouvelle consultation
     */
    @PostMapping
    public ResponseEntity<ConsultationDTO> createConsultation(@Valid @RequestBody ConsultationDTO consultationDTO) {
        Consultation consultation = mapToEntity(consultationDTO);
        Consultation createdConsultation = consultationService.creerConsultation(consultation);
        return new ResponseEntity<>(mapToDTO(createdConsultation), HttpStatus.CREATED);
    }

    /**
     * Obtenir toutes les consultations
     */
    @GetMapping
    public ResponseEntity<List<ConsultationDTO>> getAllConsultations() {
        List<ConsultationDTO> consultationDTOs = consultationService.obtenirToutesConsultations()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(consultationDTOs);
    }

    /**
     * Obtenir une consultation par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ConsultationDTO> getConsultationById(@PathVariable Long id) {
        Consultation consultation = consultationService.obtenirConsultationParId(id);
        return ResponseEntity.ok(mapToDTO(consultation));
    }

    /**
     * Obtenir les consultations d'un assuré
     */
    @GetMapping("/assure/{assureId}")
    public ResponseEntity<List<ConsultationDTO>> getConsultationsByAssure(@PathVariable Long assureId) {
        List<ConsultationDTO> consultationDTOs = consultationService.obtenirConsultationsParAssure(assureId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(consultationDTOs);
    }

    /**
     * Obtenir les consultations d'un médecin
     */
    @GetMapping("/medecin/{medecinId}")
    public ResponseEntity<List<ConsultationDTO>> getConsultationsByMedecin(@PathVariable Long medecinId) {
        List<ConsultationDTO> consultationDTOs = consultationService.obtenirConsultationsParMedecin(medecinId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(consultationDTOs);
    }

    /**
     * Obtenir les consultations par période
     */
    @GetMapping("/periode")
    public ResponseEntity<List<ConsultationDTO>> getConsultationsByPeriode(
            @RequestParam LocalDateTime dateDebut,
            @RequestParam LocalDateTime dateFin) {
        List<ConsultationDTO> consultationDTOs = consultationService.obtenirConsultationsParPeriode(dateDebut, dateFin)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(consultationDTOs);
    }

    /**
     * Obtenir les consultations avec des généralistes
     */
    @GetMapping("/generalistes")
    public ResponseEntity<List<ConsultationDTO>> getConsultationsGeneralistes() {
        List<ConsultationDTO> consultationDTOs = consultationService.obtenirConsultationsGeneralistes()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(consultationDTOs);
    }

    /**
     * Obtenir les consultations avec des spécialistes
     */
    @GetMapping("/specialistes")
    public ResponseEntity<List<ConsultationDTO>> getConsultationsSpecialistes() {
        List<ConsultationDTO> consultationDTOs = consultationService.obtenirConsultationsSpecialistes()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(consultationDTOs);
    }

    /**
     * Mettre à jour une consultation
     */
    @PutMapping("/{id}")
    public ResponseEntity<ConsultationDTO> updateConsultation(@PathVariable Long id, @Valid @RequestBody ConsultationDTO consultationDTO) {
        Consultation consultation = mapToEntity(consultationDTO);
        Consultation updatedConsultation = consultationService.mettreAJourConsultation(id, consultation);
        return ResponseEntity.ok(mapToDTO(updatedConsultation));
    }

    /**
     * Supprimer une consultation
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        consultationService.supprimerConsultation(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Ajouter une prescription à une consultation
     */
    @PostMapping("/{id}/prescriptions")
    public ResponseEntity<Prescription> addPrescription(@PathVariable Long id, @Valid @RequestBody Prescription prescription) {
        Prescription createdPrescription = consultationService.ajouterPrescription(id, prescription);
        return new ResponseEntity<>(createdPrescription, HttpStatus.CREATED);
    }

    /**
     * Obtenir les prescriptions d'une consultation
     */
    @GetMapping("/{id}/prescriptions")
    public ResponseEntity<List<Prescription>> getPrescriptionsByConsultation(@PathVariable Long id) {
        List<Prescription> prescriptions = consultationService.obtenirPrescriptionsParConsultation(id);
        return ResponseEntity.ok(prescriptions);
    }

    /**
     * Obtenir les statistiques des consultations
     */
    @GetMapping("/stats")
    public ResponseEntity<ConsultationService.ConsultationStats> getConsultationStats() {
        ConsultationService.ConsultationStats stats = consultationService.obtenirStatistiques();
        return ResponseEntity.ok(stats);
    }

    // Mapper Consultation vers ConsultationDTO
    private ConsultationDTO mapToDTO(Consultation consultation) {
        return ConsultationDTO.builder()
                .id(consultation.getId())
                .assureId(consultation.getAssure().getId())
                .medecinId(consultation.getMedecin().getId())
                .date(consultation.getDate())
                .cout(consultation.getCout())
                .detailsMedical(consultation.getDetailsMedical())
                .build();
    }

    // Mapper ConsultationDTO vers Consultation
    private Consultation mapToEntity(ConsultationDTO consultationDTO) {
        Consultation consultation = new Consultation();
        consultation.setId(consultationDTO.getId());
        Assure assure = new Assure();
        assure.setId(consultationDTO.getAssureId());
        consultation.setAssure(assure);
        Medecin medecin = new Medecin();
        medecin.setId(consultationDTO.getMedecinId());
        consultation.setMedecin(medecin);
        consultation.setDate(consultationDTO.getDate());
        consultation.setCout(consultationDTO.getCout());
        consultation.setDetailsMedical(consultationDTO.getDetailsMedical());
        return consultation;
    }
}