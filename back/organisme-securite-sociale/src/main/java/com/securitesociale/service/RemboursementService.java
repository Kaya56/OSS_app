package com.securitesociale.service;

import com.securitesociale.entity.*;
import com.securitesociale.entity.enums.MethodePaiement;
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
public class RemboursementService {

    @Autowired
    private RemboursementRepository remboursementRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private AssureRepository assureRepository;

    @Autowired
    private RemboursementCalculator remboursementCalculator;

    /**
     * Créer un remboursement manuel
     */
    public Remboursement creerRemboursement(Long consultationId, MethodePaiement methode) {
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation non trouvée avec l'ID: " + consultationId));

        if (consultation.getAssure() == null) {
            throw new BusinessException("La consultation doit être associée à un assuré");
        }

        // Vérifier qu'il n'y a pas déjà un remboursement pour cette consultation
        Optional<Remboursement> remboursementExistant = remboursementRepository.findByConsultation(consultation);
        if (remboursementExistant.isPresent()) {
            throw new BusinessException("Un remboursement existe déjà pour cette consultation");
        }

        Remboursement remboursement = new Remboursement();
        remboursement.setConsultation(consultation);

        // Calculer le montant du remboursement
        boolean estGeneraliste = consultation.getMedecin().isGeneraliste();
        BigDecimal montant = remboursementCalculator.calculerMontantRemboursement(consultation.getCout(), estGeneraliste);
        remboursement.setMontant(montant);

        // Définir la méthode de paiement
        remboursement.setMethode(methode != null ? methode : consultation.getAssure().getMethodePaiementPreferee());

        // Statut initial et date de création sont gérés par le constructeur de Remboursement
        return remboursementRepository.save(remboursement);
    }

    /**
     * Obtenir tous les remboursements
     */
    @Transactional(readOnly = true)
    public List<Remboursement> obtenirTousRemboursements() {
        return remboursementRepository.findAll();
    }

    /**
     * Obtenir un remboursement par son ID
     */
    @Transactional(readOnly = true)
    public Remboursement obtenirRemboursementParId(Long id) {
        return remboursementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Remboursement non trouvé avec l'ID: " + id));
    }

    /**
     * Obtenir les remboursements par statut
     */
    @Transactional(readOnly = true)
    public List<Remboursement> obtenirRemboursementsParStatut(StatutRemboursement statut) {
        return remboursementRepository.findByStatut(statut);
    }

    /**
     * Obtenir les remboursements en attente
     */
    @Transactional(readOnly = true)
    public List<Remboursement> obtenirRemboursementsEnAttente() {
        return remboursementRepository.findByStatut(StatutRemboursement.EN_ATTENTE);
    }

    /**
     * Obtenir les remboursements traités
     */
    @Transactional(readOnly = true)
    public List<Remboursement> obtenirRemboursementsTraites() {
        return remboursementRepository.findByStatut(StatutRemboursement.TRAITE);
    }

    /**
     * Obtenir les remboursements refusés
     */
    @Transactional(readOnly = true)
    public List<Remboursement> obtenirRemboursementsRefuses() {
        return remboursementRepository.findByStatut(StatutRemboursement.REFUSE);
    }

    /**
     * Obtenir les remboursements d'un assuré
     */
    @Transactional(readOnly = true)
    public List<Remboursement> obtenirRemboursementsParAssure(Long assureId) {
        Assure assure = assureRepository.findById(assureId)
                .orElseThrow(() -> new ResourceNotFoundException("Assuré non trouvé avec l'ID: " + assureId));
        return remboursementRepository.findByConsultationAssure(assureId);
    }

    /**
     * Obtenir les remboursements par méthode de paiement
     */
    @Transactional(readOnly = true)
    public List<Remboursement> obtenirRemboursementsParMethode(MethodePaiement methode) {
        return remboursementRepository.findByMethode(methode);
    }

    /**
     * Obtenir les remboursements par période
     */
    @Transactional(readOnly = true)
    public List<Remboursement> obtenirRemboursementsParPeriode(LocalDateTime dateDebut, LocalDateTime dateFin) {
        if (dateDebut.isAfter(dateFin)) {
            throw new BusinessException("La date de début doit être antérieure à la date de fin");
        }
        return remboursementRepository.findByStatutAndDateTraitementBetween(StatutRemboursement.TRAITE, dateDebut, dateFin);
    }

    /**
     * Traiter un remboursement (l'approuver)
     */
    public Remboursement traiterRemboursement(Long id) {
        Remboursement remboursement = obtenirRemboursementParId(id);

        if (remboursement.getStatut() != StatutRemboursement.EN_ATTENTE) {
            throw new BusinessException("Seuls les remboursements en attente peuvent être traités");
        }

        remboursement.traiter();
        return remboursementRepository.save(remboursement);
    }

    /**
     * Refuser un remboursement
     */
    public Remboursement refuserRemboursement(Long id, String motif) {
        Remboursement remboursement = obtenirRemboursementParId(id);

        if (remboursement.getStatut() != StatutRemboursement.EN_ATTENTE) {
            throw new BusinessException("Seuls les remboursements en attente peuvent être refusés");
        }

        remboursement.setStatut(StatutRemboursement.REFUSE);
        remboursement.setDateTraitement(LocalDateTime.now());
        // Note : L'entité Remboursement n'a pas de champ pour stocker le motif. Ajouter un champ si nécessaire.

        return remboursementRepository.save(remboursement);
    }

    /**
     * Annuler un remboursement traité (remettre en attente)
     */
    public Remboursement annulerTraitementRemboursement(Long id) {
        Remboursement remboursement = obtenirRemboursementParId(id);

        if (remboursement.getStatut() != StatutRemboursement.TRAITE) {
            throw new BusinessException("Seuls les remboursements traités peuvent être annulés");
        }

        remboursement.setStatut(StatutRemboursement.EN_ATTENTE);
        remboursement.setDateTraitement(null);

        return remboursementRepository.save(remboursement);
    }

    /**
     * Modifier la méthode de paiement d'un remboursement
     */
    public Remboursement modifierMethodePaiement(Long id, MethodePaiement nouvelleMethode) {
        Remboursement remboursement = obtenirRemboursementParId(id);

        if (remboursement.getStatut() == StatutRemboursement.TRAITE) {
            throw new BusinessException("Impossible de modifier la méthode de paiement d'un remboursement déjà traité");
        }

        if (nouvelleMethode == null) {
            throw new BusinessException("La méthode de paiement ne peut pas être nulle");
        }

        remboursement.setMethode(nouvelleMethode);
        return remboursementRepository.save(remboursement);
    }

    /**
     * Recalculer le montant d'un remboursement
     */
    public Remboursement recalculerMontant(Long id) {
        Remboursement remboursement = obtenirRemboursementParId(id);

        if (remboursement.getStatut() == StatutRemboursement.TRAITE) {
            throw new BusinessException("Impossible de recalculer le montant d'un remboursement déjà traité");
        }

        Consultation consultation = remboursement.getConsultation();
        boolean estGeneraliste = consultation.getMedecin().isGeneraliste();
        BigDecimal nouveauMontant = remboursementCalculator.calculerMontantRemboursement(consultation.getCout(), estGeneraliste);

        remboursement.setMontant(nouveauMontant);
        return remboursementRepository.save(remboursement);
    }

    /**
     * Supprimer un remboursement en attente
     */
    public void supprimerRemboursement(Long id) {
        Remboursement remboursement = obtenirRemboursementParId(id);

        if (remboursement.getStatut() != StatutRemboursement.EN_ATTENTE) {
            throw new BusinessException("Seuls les remboursements en attente peuvent être supprimés");
        }

        remboursementRepository.delete(remboursement);
    }

    /**
     * Traiter tous les remboursements en attente
     */
    public List<Remboursement> traiterTousRemboursementsEnAttente() {
        List<Remboursement> remboursementsEnAttente = obtenirRemboursementsEnAttente();

        for (Remboursement remboursement : remboursementsEnAttente) {
            remboursement.traiter();
        }

        return remboursementRepository.saveAll(remboursementsEnAttente);
    }

    /**
     * Obtenir les statistiques des remboursements
     */
    @Transactional(readOnly = true)
    public RemboursementStats obtenirStatistiques() {
        long totalRemboursements = remboursementRepository.count();
        long remboursementsEnAttente = remboursementRepository.countByStatut(StatutRemboursement.EN_ATTENTE);
        long remboursementsTraites = remboursementRepository.countByStatut(StatutRemboursement.TRAITE);
        long remboursementsRefuses = remboursementRepository.countByStatut(StatutRemboursement.REFUSE);

        BigDecimal montantTotalTraite = remboursementRepository.sumMontantByStatut(StatutRemboursement.TRAITE);
        if (montantTotalTraite == null) montantTotalTraite = BigDecimal.ZERO;

        BigDecimal montantTotalEnAttente = remboursementRepository.sumMontantByStatut(StatutRemboursement.EN_ATTENTE);
        if (montantTotalEnAttente == null) montantTotalEnAttente = BigDecimal.ZERO;

        return new RemboursementStats(
                totalRemboursements,
                remboursementsEnAttente,
                remboursementsTraites,
                remboursementsRefuses,
                montantTotalTraite,
                montantTotalEnAttente
        );
    }

    /**
     * Obtenir le remboursement d'une consultation spécifique
     */
    @Transactional(readOnly = true)
    public Optional<Remboursement> obtenirRemboursementParConsultation(Long consultationId) {
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation non trouvée avec l'ID: " + consultationId));
        return remboursementRepository.findByConsultation(consultation);
    }

    // Classe interne pour les statistiques
    public static class RemboursementStats {
        private final long totalRemboursements;
        private final long remboursementsEnAttente;
        private final long remboursementsTraites;
        private final long remboursementsRefuses;
        private final BigDecimal montantTotalTraite;
        private final BigDecimal montantTotalEnAttente;

        public RemboursementStats(long totalRemboursements, long remboursementsEnAttente,
                                  long remboursementsTraites, long remboursementsRefuses,
                                  BigDecimal montantTotalTraite, BigDecimal montantTotalEnAttente) {
            this.totalRemboursements = totalRemboursements;
            this.remboursementsEnAttente = remboursementsEnAttente;
            this.remboursementsTraites = remboursementsTraites;
            this.remboursementsRefuses = remboursementsRefuses;
            this.montantTotalTraite = montantTotalTraite;
            this.montantTotalEnAttente = montantTotalEnAttente;
        }

        // Getters
        public long getTotalRemboursements() { return totalRemboursements; }
        public long getRemboursementsEnAttente() { return remboursementsEnAttente; }
        public long getRemboursementsTraites() { return remboursementsTraites; }
        public long getRemboursementsRefuses() { return remboursementsRefuses; }
        public BigDecimal getMontantTotalTraite() { return montantTotalTraite; }
        public BigDecimal getMontantTotalEnAttente() { return montantTotalEnAttente; }
    }
}