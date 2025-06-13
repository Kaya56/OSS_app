package com.securitesociale.service;

import com.securitesociale.entity.*;
import com.securitesociale.entity.enums.StatutRemboursement;
import com.securitesociale.repository.*;
import com.securitesociale.exception.ResourceNotFoundException;
import com.securitesociale.exception.BusinessException;
import com.securitesociale.util.RemboursementCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private AssureRepository assureRepository;

    @Autowired
    private MedecinRepository medecinRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private RemboursementRepository remboursementRepository;

    @Autowired
    private RemboursementCalculator remboursementCalculator;

    /**
     * Créer une nouvelle consultation
     */
    public Consultation creerConsultation(Consultation consultation) {
        validateConsultation(consultation);

        // Vérifier que l'assuré existe
        Assure assure = assureRepository.findById(consultation.getAssure().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Assuré non trouvé avec l'ID: " + consultation.getAssure().getId()));

        // Vérifier que le médecin existe
        Medecin medecin = medecinRepository.findById(consultation.getMedecin().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé avec l'ID: " + consultation.getMedecin().getId()));

        // Définir la date si elle n'est pas fournie
        if (consultation.getDate() == null) {
            consultation.setDate(LocalDateTime.now());
        }

        consultation.setAssure(assure);
        consultation.setMedecin(medecin);

        // Sauvegarder la consultation
        Consultation consultationSauvegardee = consultationRepository.save(consultation);

        // Créer automatiquement le remboursement
        creerRemboursementPourConsultation(consultationSauvegardee);

        return consultationSauvegardee;
    }

    /**
     * Créer une consultation avec prescriptions
     */
    public Consultation creerConsultationAvecPrescriptions(Consultation consultation, List<Prescription> prescriptions) {
        // Créer d'abord la consultation
        Consultation consultationSauvegardee = creerConsultation(consultation);

        // Ajouter les prescriptions si elles existent
        if (prescriptions != null && !prescriptions.isEmpty()) {
            // Vérifier que seuls les généralistes peuvent prescrire
            if (!consultation.getMedecin().isGeneraliste()) {
                throw new BusinessException("Seuls les médecins généralistes peuvent créer des prescriptions");
            }

            for (Prescription prescription : prescriptions) {
                validatePrescription(prescription);
                prescription.setConsultation(consultationSauvegardee);
                prescriptionRepository.save(prescription);
            }
        }

        return consultationSauvegardee;
    }

    /**
     * Obtenir toutes les consultations
     */
    @Transactional(readOnly = true)
    public List<Consultation> obtenirToutesConsultations() {
        return consultationRepository.findAll();
    }

    /**
     * Obtenir une consultation par son ID
     */
    @Transactional(readOnly = true)
    public Consultation obtenirConsultationParId(Long id) {
        return consultationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation non trouvée avec l'ID: " + id));
    }

    /**
     * Obtenir les consultations d'un assuré
     */
    @Transactional(readOnly = true)
    public List<Consultation> obtenirConsultationsParAssure(Long assureId) {
        assureRepository.findById(assureId)
                .orElseThrow(() -> new ResourceNotFoundException("Assuré non trouvé avec l'ID: " + assureId));
        return consultationRepository.findByAssureId(assureId);
    }

    /**
     * Obtenir les consultations d'un médecin
     */
    @Transactional(readOnly = true)
    public List<Consultation> obtenirConsultationsParMedecin(Long medecinId) {
        medecinRepository.findById(medecinId)
                .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé avec l'ID: " + medecinId));
        return consultationRepository.findByMedecinId(medecinId);
    }

    /**
     * Obtenir les consultations par période
     */
    @Transactional(readOnly = true)
    public List<Consultation> obtenirConsultationsParPeriode(LocalDateTime dateDebut, LocalDateTime dateFin) {
        return consultationRepository.findByDateBetween(dateDebut, dateFin);
    }

    /**
     * Obtenir les consultations avec des généralistes
     */
    @Transactional(readOnly = true)
    public List<Consultation> obtenirConsultationsGeneralistes() {
        return consultationRepository.findByMedecinSpecialisationIsNull();
    }

    /**
     * Obtenir les consultations avec des spécialistes
     */
    @Transactional(readOnly = true)
    public List<Consultation> obtenirConsultationsSpecialistes() {
        return consultationRepository.findByMedecinSpecialisationIsNotNull();
    }

    /**
     * Mettre à jour une consultation
     */
    public Consultation mettreAJourConsultation(Long id, Consultation consultationMiseAJour) {
        Consultation consultation = obtenirConsultationParId(id);

        // Valider les champs modifiables
        if (consultationMiseAJour.getCout() == null || consultationMiseAJour.getCout().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Le coût de la consultation doit être positif");
        }

        // Mettre à jour les champs
        consultation.setDetailsMedical(consultationMiseAJour.getDetailsMedical());
        consultation.setCout(consultationMiseAJour.getCout());

        // Recalculer le remboursement si le coût a changé
        Optional<Remboursement> remboursementOpt = remboursementRepository.findByConsultationId(id);
        if (remboursementOpt.isPresent()) {
            Remboursement remboursement = remboursementOpt.get();
            if (remboursement.getStatut() == StatutRemboursement.TRAITE) {
                throw new BusinessException("Impossible de modifier une consultation avec un remboursement déjà traité");
            }
            BigDecimal nouveauMontant = remboursementCalculator.calculerMontantRemboursement(
                    consultation.getCout(),
                    consultation.getMedecin().isGeneraliste()
            );
            remboursement.setMontant(nouveauMontant);
            remboursementRepository.save(remboursement);
        }

        return consultationRepository.save(consultation);
    }

    /**
     * Supprimer une consultation
     */
    public void supprimerConsultation(Long id) {
        Consultation consultation = obtenirConsultationParId(id);

        // Vérifier si le remboursement est traité
        Optional<Remboursement> remboursementOpt = remboursementRepository.findByConsultationId(id);
        if (remboursementOpt.isPresent() && remboursementOpt.get().getStatut() == StatutRemboursement.TRAITE) {
            throw new BusinessException("Impossible de supprimer une consultation avec un remboursement traité");
        }

        // Supprimer les prescriptions associées
        List<Prescription> prescriptions = prescriptionRepository.findByConsultationId(id);
        prescriptionRepository.deleteAll(prescriptions);

        // Supprimer le remboursement associé
        remboursementOpt.ifPresent(r -> remboursementRepository.delete(r));

        consultationRepository.delete(consultation);
    }

    /**
     * Ajouter une prescription à une consultation existante
     */
    public Prescription ajouterPrescription(Long consultationId, Prescription prescription) {
        Consultation consultation = obtenirConsultationParId(consultationId);

        // Vérifier que seuls les généralistes peuvent prescrire
        if (!consultation.getMedecin().isGeneraliste()) {
            throw new BusinessException("Seuls les médecins généralistes peuvent créer des prescriptions");
        }

        validatePrescription(prescription);
        prescription.setConsultation(consultation);
        return prescriptionRepository.save(prescription);
    }

    /**
     * Obtenir les prescriptions d'une consultation
     */
    @Transactional(readOnly = true)
    public List<Prescription> obtenirPrescriptionsParConsultation(Long consultationId) {
        obtenirConsultationParId(consultationId); // Vérifie l'existence
        return prescriptionRepository.findByConsultationId(consultationId);
    }

    /**
     * Créer automatiquement le remboursement pour une consultation
     */
    private void creerRemboursementPourConsultation(Consultation consultation) {
        Remboursement remboursement = new Remboursement();
        remboursement.setConsultation(consultation);

        // Calculer le montant du remboursement
        BigDecimal montant = remboursementCalculator.calculerMontantRemboursement(
                consultation.getCout(),
                consultation.getMedecin().isGeneraliste()
        );
        remboursement.setMontant(montant);

        // Définir la méthode de paiement selon la préférence de l'assuré
        remboursement.setMethode(consultation.getAssure().getMethodePaiementPreferee());

        // Statut initial
        remboursement.setStatut(StatutRemboursement.EN_ATTENTE);

        remboursementRepository.save(remboursement);
    }

    /**
     * Obtenir les statistiques des consultations
     */
    @Transactional(readOnly = true)
    public ConsultationStats obtenirStatistiques() {
        long totalConsultations = consultationRepository.count();
        long consultationsGeneralistes = consultationRepository.countByMedecinSpecialisationIsNull();
        long consultationsSpecialistes = consultationRepository.countByMedecinSpecialisationIsNotNull();

        return new ConsultationStats(totalConsultations, consultationsGeneralistes, consultationsSpecialistes);
    }

    /**
     * Valider une consultation
     */
    private void validateConsultation(Consultation consultation) {
        if (consultation == null) {
            throw new BusinessException("La consultation ne peut pas être nulle");
        }
        if (consultation.getAssure() == null || consultation.getAssure().getId() == null) {
            throw new BusinessException("L'assuré est obligatoire");
        }
        if (consultation.getMedecin() == null || consultation.getMedecin().getId() == null) {
            throw new BusinessException("Le médecin est obligatoire");
        }
        if (consultation.getCout() == null || consultation.getCout().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Le coût de la consultation doit être positif");
        }
    }

    /**
     * Valider une prescription
     */
    private void validatePrescription(Prescription prescription) {
        if (prescription == null) {
            throw new BusinessException("La prescription ne peut pas être nulle");
        }
        if (prescription.getType() == null) {
            throw new BusinessException("Le type de prescription est obligatoire");
        }
        if (prescription.getDetailsMedicament() == null || prescription.getDetailsMedicament().trim().isEmpty()) {
            throw new BusinessException("Les détails du médicament sont obligatoires");
        }
        if (prescription.getSpecialiste() != null && prescription.getSpecialiste().getId() == null) {
            throw new BusinessException("L'ID du spécialiste est obligatoire si spécifié");
        }
    }

    // Classe interne pour les statistiques
    public static class ConsultationStats {
        private long totalConsultations;
        private long consultationsGeneralistes;
        private long consultationsSpecialistes;

        public ConsultationStats(long totalConsultations, long consultationsGeneralistes, long consultationsSpecialistes) {
            this.totalConsultations = totalConsultations;
            this.consultationsGeneralistes = consultationsGeneralistes;
            this.consultationsSpecialistes = consultationsSpecialistes;
        }

        public long getTotalConsultations() { return totalConsultations; }
        public long getConsultationsGeneralistes() { return consultationsGeneralistes; }
        public long getConsultationsSpecialistes() { return consultationsSpecialistes; }
    }
}