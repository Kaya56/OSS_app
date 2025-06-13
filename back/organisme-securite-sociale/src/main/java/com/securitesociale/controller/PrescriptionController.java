package com.securitesociale.controller;

import com.securitesociale.dto.PrescriptionDTO;
import com.securitesociale.entity.Prescription;
import com.securitesociale.entity.Medecin;
import com.securitesociale.entity.Consultation;
import com.securitesociale.entity.enums.TypePrescription;
import com.securitesociale.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    /**
     * Créer une nouvelle prescription
     */
    @PostMapping
    public ResponseEntity<PrescriptionDTO> createPrescription(@Valid @RequestBody PrescriptionDTO prescriptionDTO) {
        Prescription prescription = mapToEntity(prescriptionDTO);
        Prescription createdPrescription = prescriptionService.creerPrescription(prescription);
        return new ResponseEntity<>(mapToDTO(createdPrescription), HttpStatus.CREATED);
    }

    /**
     * Obtenir toutes les prescriptions
     */
    @GetMapping
    public ResponseEntity<List<PrescriptionDTO>> getAllPrescriptions() {
        List<PrescriptionDTO> prescriptionDTOs = prescriptionService.obtenirToutesPrescriptions()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(prescriptionDTOs);
    }

    /**
     * Obtenir une prescription par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionDTO> getPrescriptionById(@PathVariable Long id) {
        Prescription prescription = prescriptionService.obtenirPrescriptionParId(id);
        return ResponseEntity.ok(mapToDTO(prescription));
    }

    /**
     * Obtenir les prescriptions d'une consultation
     */
    @GetMapping("/consultation/{consultationId}")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsByConsultation(@PathVariable Long consultationId) {
        List<PrescriptionDTO> prescriptionDTOs = prescriptionService.obtenirPrescriptionsParConsultation(consultationId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(prescriptionDTOs);
    }

    /**
     * Obtenir les prescriptions par type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsByType(@PathVariable TypePrescription type) {
        List<PrescriptionDTO> prescriptionDTOs = prescriptionService.obtenirPrescriptionsParType(type)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(prescriptionDTOs);
    }

    /**
     * Obtenir les prescriptions de médicaments
     */
    @GetMapping("/medicaments")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsMedicaments() {
        List<PrescriptionDTO> prescriptionDTOs = prescriptionService.obtenirPrescriptionsMedicaments()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(prescriptionDTOs);
    }

    /**
     * Obtenir les prescriptions d'un assuré
     */
    @GetMapping("/assure/{assureId}")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsByAssure(@PathVariable Long assureId) {
        List<PrescriptionDTO> prescriptionDTOs = prescriptionService.obtenirPrescriptionsParAssure(assureId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(prescriptionDTOs);
    }

    /**
     * Obtenir les prescriptions d'un assuré par type
     */
    @GetMapping("/assure/{assureId}/type/{type}")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsByAssureAndType(@PathVariable Long assureId, @PathVariable TypePrescription type) {
        List<PrescriptionDTO> prescriptionDTOs = prescriptionService.obtenirPrescriptionsParAssureEtType(assureId, type)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(prescriptionDTOs);
    }

    /**
     * Obtenir les prescriptions émises par un médecin
     */
    @GetMapping("/medecin/{medecinId}")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsByMedecin(@PathVariable Long medecinId) {
        List<PrescriptionDTO> prescriptionDTOs = prescriptionService.obtenirPrescriptionsParMedecin(medecinId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(prescriptionDTOs);
    }

    /**
     * Obtenir les prescriptions pour un spécialiste
     */
    @GetMapping("/specialiste/{specialisteId}")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsForSpecialiste(@PathVariable Long specialisteId) {
        List<PrescriptionDTO> prescriptionDTOs = prescriptionService.obtenirPrescriptionsPourSpecialiste(specialisteId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(prescriptionDTOs);
    }

    /**
     * Obtenir les prescriptions par période
     */
    @GetMapping("/periode")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsByPeriode(
            @RequestParam("dateDebut") String dateDebutStr,
            @RequestParam("dateFin") String dateFinStr) {
        LocalDate dateDebut = LocalDate.parse(dateDebutStr);
        LocalDate dateFin = LocalDate.parse(dateFinStr);
        List<PrescriptionDTO> prescriptionDTOs = prescriptionService.obtenirPrescriptionsParPeriode(dateDebut, dateFin)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(prescriptionDTOs);
    }

    /**
     * Mettre à jour une prescription
     */
    @PutMapping("/{id}")
    public ResponseEntity<PrescriptionDTO> updatePrescription(@PathVariable Long id, @Valid @RequestBody PrescriptionDTO prescriptionDTO) {
        Prescription prescription = mapToEntity(prescriptionDTO);
        Prescription updatedPrescription = prescriptionService.mettreAJourPrescription(id, prescription);
        return ResponseEntity.ok(mapToDTO(updatedPrescription));
    }

    /**
     * Supprimer une prescription
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
        prescriptionService.supprimerPrescription(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Compter les prescriptions de médicaments pour un assuré
     */
    @GetMapping("/assure/{assureId}/medicaments/count")
    public ResponseEntity<Long> countPrescriptionsMedicamentsByAssure(@PathVariable Long assureId) {
        return ResponseEntity.ok(prescriptionService.compterPrescriptionsMedicamentsParAssure(assureId));
    }

    /**
     * Compter les prescriptions de consultations spécialisées pour un assuré
     */
    @GetMapping("/assure/{assureId}/consultations/count")
    public ResponseEntity<Long> countPrescriptionsConsultationsByAssure(@PathVariable Long assureId) {
        return ResponseEntity.ok(prescriptionService.compterPrescriptionsConsultationsParAssure(assureId));
    }

    // Mapper Prescription vers PrescriptionDTO
    private PrescriptionDTO mapToDTO(Prescription prescription) {
        return PrescriptionDTO.builder()
                .id(prescription.getId())
                .consultationId(prescription.getConsultation().getId())
                .type(prescription.getType())
                .detailsMedicament(prescription.getDetailsMedicament())
                .specialisteId(prescription.getSpecialiste() != null ? prescription.getSpecialiste().getId() : null)
                .build();
    }

    // Mapper PrescriptionDTO vers Prescription
    private Prescription mapToEntity(PrescriptionDTO prescriptionDTO) {
        Prescription prescription = Prescription.builder()
                .id(prescriptionDTO.getId())
                .type(prescriptionDTO.getType())
                .detailsMedicament(prescriptionDTO.getDetailsMedicament())
                .build();

        if (prescriptionDTO.getConsultationId() != null) {
            Consultation consultation = new Consultation();
            consultation.setId(prescriptionDTO.getConsultationId());
            prescription.setConsultation(consultation);
        }

        if (prescriptionDTO.getSpecialisteId() != null) {
            Medecin specialiste = new Medecin();
            specialiste.setId(prescriptionDTO.getSpecialisteId());
            prescription.setSpecialiste(specialiste);
        }

        return prescription;
    }
}