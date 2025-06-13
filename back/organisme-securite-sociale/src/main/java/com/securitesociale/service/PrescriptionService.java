package com.securitesociale.service;

import com.securitesociale.entity.Prescription;
import com.securitesociale.entity.Consultation;
import com.securitesociale.entity.Medecin;
import com.securitesociale.entity.enums.TypePrescription;
import com.securitesociale.repository.PrescriptionRepository;
import com.securitesociale.repository.ConsultationRepository;
import com.securitesociale.repository.MedecinRepository;
import com.securitesociale.exception.ResourceNotFoundException;
import com.securitesociale.exception.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private MedecinRepository medecinRepository;

    /**
     * Créer une nouvelle prescription
     */
    public Prescription creerPrescription(Prescription prescription) {
        if (prescription == null) {
            throw new BusinessException("La prescription ne peut pas être nulle");
        }

        validatePrescription(prescription);

        Consultation consultation = consultationRepository.findById(prescription.getConsultation().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Consultation non trouvée avec l'ID: " + prescription.getConsultation().getId()));

        if (prescription.getType() == TypePrescription.CONSULTATION_SPECIALISTE && prescription.getSpecialiste() == null) {
            throw new BusinessException("Un spécialiste est requis pour une prescription de consultation spécialisée");
        }

        if (prescription.getSpecialiste() != null) {
            Medecin specialiste = medecinRepository.findById(prescription.getSpecialiste().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Spécialiste non trouvé avec l'ID: " + prescription.getSpecialiste().getId()));
            if (!specialiste.isSpecialiste()) {
                throw new BusinessException("Le médecin spécifié n'est pas un spécialiste");
            }
            prescription.setSpecialiste(specialiste);
        }

        prescription.setConsultation(consultation);
        return prescriptionRepository.save(prescription);
    }

    /**
     * Mettre à jour une prescription existante
     */
    public Prescription mettreAJourPrescription(Long id, Prescription prescriptionModifiee) {
        Prescription prescriptionExistante = obtenirPrescriptionParId(id);

        validatePrescription(prescriptionModifiee);

        if (!prescriptionExistante.getConsultation().getId().equals(prescriptionModifiee.getConsultation().getId())) {
            throw new BusinessException("La consultation associée à la prescription ne peut pas être modifiée");
        }

        if (prescriptionModifiee.getType() == TypePrescription.CONSULTATION_SPECIALISTE && prescriptionModifiee.getSpecialiste() == null) {
            throw new BusinessException("Un spécialiste est requis pour une prescription de consultation spécialisée");
        }

        if (prescriptionModifiee.getSpecialiste() != null) {
            Medecin specialiste = medecinRepository.findById(prescriptionModifiee.getSpecialiste().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Spécialiste non trouvé avec l'ID: " + prescriptionModifiee.getSpecialiste().getId()));
            if (!specialiste.isSpecialiste()) {
                throw new BusinessException("Le médecin spécifié n'est pas un spécialiste");
            }
            prescriptionExistante.setSpecialiste(specialiste);
        } else {
            prescriptionExistante.setSpecialiste(null);
        }

        prescriptionExistante.setType(prescriptionModifiee.getType());
        prescriptionExistante.setDetailsMedicament(prescriptionModifiee.getDetailsMedicament());

        return prescriptionRepository.save(prescriptionExistante);
    }

    /**
     * Obtenir une prescription par ID
     */
    @Transactional(readOnly = true)
    public Prescription obtenirPrescriptionParId(Long id) {
        return prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription non trouvée avec l'ID: " + id));
    }

    /**
     * Obtenir toutes les prescriptions
     */
    @Transactional(readOnly = true)
    public List<Prescription> obtenirToutesPrescriptions() {
        return prescriptionRepository.findAll();
    }

    /**
     * Obtenir les prescriptions d'une consultation
     */
    @Transactional(readOnly = true)
    public List<Prescription> obtenirPrescriptionsParConsultation(Long consultationId) {
        return prescriptionRepository.findByConsultationId(consultationId);
    }

    /**
     * Obtenir les prescriptions par type
     */
    @Transactional(readOnly = true)
    public List<Prescription> obtenirPrescriptionsParType(TypePrescription type) {
        return prescriptionRepository.findByType(type);
    }

    /**
     * Obtenir les prescriptions de médicaments
     */
    @Transactional(readOnly = true)
    public List<Prescription> obtenirPrescriptionsMedicaments() {
        return prescriptionRepository.findByTypeAndDetailsMedicamentIsNotNull(TypePrescription.MEDICAMENT);
    }

    /**
     * Obtenir les prescriptions d'un assuré
     */
    @Transactional(readOnly = true)
    public List<Prescription> obtenirPrescriptionsParAssure(Long assureId) {
        return prescriptionRepository.findByAssureId(assureId);
    }

    /**
     * Obtenir les prescriptions d'un assuré par type
     */
    @Transactional(readOnly = true)
    public List<Prescription> obtenirPrescriptionsParAssureEtType(Long assureId, TypePrescription type) {
        return prescriptionRepository.findByAssureIdAndType(assureId, type);
    }

    /**
     * Obtenir les prescriptions émises par un médecin
     */
    @Transactional(readOnly = true)
    public List<Prescription> obtenirPrescriptionsParMedecin(Long medecinId) {
        return prescriptionRepository.findByMedecinId(medecinId);
    }

    /**
     * Obtenir les prescriptions pour un spécialiste
     */
    @Transactional(readOnly = true)
    public List<Prescription> obtenirPrescriptionsPourSpecialiste(Long specialisteId) {
        return prescriptionRepository.findPrescriptionsForSpecialiste(specialisteId);
    }

    /**
     * Obtenir les prescriptions par période
     */
    @Transactional(readOnly = true)
    public List<Prescription> obtenirPrescriptionsParPeriode(LocalDate dateDebut, LocalDate dateFin) {
        if (dateDebut.isAfter(dateFin)) {
            throw new BusinessException("La date de début doit être antérieure à la date de fin");
        }
        return prescriptionRepository.findByDateBetween(dateDebut, dateFin);
    }

    /**
     * Supprimer une prescription
     */
    public void supprimerPrescription(Long id) {
        Prescription prescription = obtenirPrescriptionParId(id);
        prescriptionRepository.delete(prescription);
    }

    /**
     * Compter les prescriptions de médicaments pour un assuré
     */
    @Transactional(readOnly = true)
    public Long compterPrescriptionsMedicamentsParAssure(Long assureId) {
        return prescriptionRepository.countPrescriptionsMedicamentsByAssure(assureId);
    }

    /**
     * Compter les prescriptions de consultations spécialisées pour un assuré
     */
    @Transactional(readOnly = true)
    public Long compterPrescriptionsConsultationsParAssure(Long assureId) {
        return prescriptionRepository.countPrescriptionsConsultationsByAssure(assureId);
    }

    /**
     * Valider une prescription
     */
    private void validatePrescription(Prescription prescription) {
        if (prescription.getConsultation() == null || prescription.getConsultation().getId() == null) {
            throw new BusinessException("La consultation est obligatoire");
        }
        if (prescription.getType() == null) {
            throw new BusinessException("Le type de prescription est obligatoire");
        }
        if (prescription.getType() == TypePrescription.MEDICAMENT && (prescription.getDetailsMedicament() == null || prescription.getDetailsMedicament().trim().isEmpty())) {
            throw new BusinessException("Les détails du médicament sont requis pour une prescription de médicament");
        }
    }
}