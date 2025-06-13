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

    public Consultation creerConsultation(Consultation consultation) {
        validateConsultation(consultation);

        Assure assure = assureRepository.findById(consultation.getAssure().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Assuré non trouvé avec l'ID: " + consultation.getAssure().getId()));

        Medecin medecin = medecinRepository.findById(consultation.getMedecin().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé avec l'ID: " + consultation.getMedecin().getId()));

        if (consultation.getDate() == null) {
            consultation.setDate(LocalDateTime.now());
        }

        consultation.setAssure(assure);
        consultation.setMedecin(medecin);

        Consultation consultationSauvegardee = consultationRepository.save(consultation);

        creerRemboursementPourConsultation(consultationSauvegardee);

        return consultationSauvegardee;
    }

    public Consultation creerConsultationAvecPrescriptions(Consultation consultation, List<Prescription> prescriptions) {
        Consultation consultationSauvegardee = creerConsultation(consultation);

        if (prescriptions != null && !prescriptions.isEmpty()) {
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

    @Transactional(readOnly = true)
    public List<Consultation> obtenirToutesConsultations() {
        return consultationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Consultation obtenirConsultationParId(Long id) {
        return consultationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation non trouvée avec l'ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Consultation> obtenirConsultationsParAssure(Long assureId) {
        assureRepository.findById(assureId)
                .orElseThrow(() -> new ResourceNotFoundException("Assuré non trouvé avec l'ID: " + assureId));
        return consultationRepository.findByAssureId(assureId);
    }

    @Transactional(readOnly = true)
    public List<Consultation> obtenirConsultationsParMedecin(Long medecinId) {
        medecinRepository.findById(medecinId)
                .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé avec l'ID: " + medecinId));
        return consultationRepository.findByMedecinId(medecinId);
    }

    @Transactional(readOnly = true)
    public List<Consultation> obtenirConsultationsParPeriode(LocalDateTime dateDebut, LocalDateTime dateFin) {
        return consultationRepository.findByDateBetween(dateDebut, dateFin);
    }

    @Transactional(readOnly = true)
    public List<Consultation> obtenirConsultationsGeneralistes() {
        return consultationRepository.findByMedecinSpecialisationIsNull();
    }

    @Transactional(readOnly = true)
    public List<Consultation> obtenirConsultationsSpecialistes() {
        return consultationRepository.findByMedecinSpecialisationIsNotNull();
    }

    public Consultation mettreAJourConsultation(Long id, Consultation consultationMiseAJour) {
        Consultation consultation = obtenirConsultationParId(id);

        if (consultationMiseAJour.getCout() == null || consultationMiseAJour.getCout().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Le coût de la consultation doit être positif");
        }

        consultation.setDetailsMedical(consultationMiseAJour.getDetailsMedical());
        consultation.setCout(consultationMiseAJour.getCout());

        Optional<Remboursement> remboursementOpt = remboursementRepository.findByConsultation(consultation);
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

    public void supprimerConsultation(Long id) {
        Consultation consultation = obtenirConsultationParId(id);

        Optional<Remboursement> remboursementOpt = remboursementRepository.findByConsultation(consultation);
        if (remboursementOpt.isPresent() && remboursementOpt.get().getStatut() == StatutRemboursement.TRAITE) {
            throw new BusinessException("Impossible de supprimer une consultation avec un remboursement traité");
        }

        List<Prescription> prescriptions = prescriptionRepository.findByConsultationId(id);
        prescriptionRepository.deleteAll(prescriptions);

        remboursementOpt.ifPresent(r -> remboursementRepository.delete(r));

        consultationRepository.delete(consultation);
    }

    public Prescription ajouterPrescription(Long consultationId, Prescription prescription) {
        Consultation consultation = obtenirConsultationParId(consultationId);

        if (!consultation.getMedecin().isGeneraliste()) {
            throw new BusinessException("Seuls les médecins généralistes peuvent créer des prescriptions");
        }

        validatePrescription(prescription);
        prescription.setConsultation(consultation);
        return prescriptionRepository.save(prescription);
    }

    @Transactional(readOnly = true)
    public List<Prescription> obtenirPrescriptionsParConsultation(Long consultationId) {
        obtenirConsultationParId(consultationId);
        return prescriptionRepository.findByConsultationId(consultationId);
    }

    private void creerRemboursementPourConsultation(Consultation consultation) {
        Remboursement remboursement = new Remboursement();
        remboursement.setConsultation(consultation);

        BigDecimal montant = remboursementCalculator.calculerMontantRemboursement(
                consultation.getCout(),
                consultation.getMedecin().isGeneraliste()
        );
        remboursement.setMontant(montant);

        remboursement.setMethode(consultation.getAssure().getMethodePaiementPreferee());

        remboursement.setStatut(StatutRemboursement.EN_ATTENTE);

        remboursementRepository.save(remboursement);
    }

    @Transactional(readOnly = true)
    public ConsultationStats obtenirStatistiques() {
        long totalConsultations = consultationRepository.count();
        long consultationsGeneralistes = consultationRepository.countByMedecinSpecialisationIsNull();
        long consultationsSpecialistes = consultationRepository.countByMedecinSpecialisationIsNotNull();

        return new ConsultationStats(totalConsultations, consultationsGeneralistes, consultationsSpecialistes);
    }

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