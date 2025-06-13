package com.securitesociale.repository;

import com.securitesociale.entity.Remboursement;
import com.securitesociale.entity.Consultation;
import com.securitesociale.entity.Assure;
import com.securitesociale.entity.enums.MethodePaiement;
import com.securitesociale.entity.enums.StatutRemboursement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RemboursementRepository extends JpaRepository<Remboursement, Long> {

    // Trouver le remboursement d'une consultation
    Optional<Remboursement> findByConsultation(Consultation consultation);

    // Trouver les remboursements par statut
    List<Remboursement> findByStatut(StatutRemboursement statut);

    // Trouver les remboursements par méthode de paiement
    List<Remboursement> findByMethode(MethodePaiement methode);

    // Trouver les remboursements en attente
    List<Remboursement> findByStatutOrderByDateTraitementAsc(StatutRemboursement statut);

    // Trouver tous les remboursements d'un assuré
    @Query("SELECT r FROM Remboursement r JOIN r.consultation c WHERE c.assure.id = :assureId")
    List<Remboursement> findByConsultationAssure(@Param("assureId") Long assureId);

    // Trouver les remboursements d'un assuré par statut
    @Query("SELECT r FROM Remboursement r JOIN r.consultation c WHERE c.assure.id = :assureId AND r.statut = :statut")
    List<Remboursement> findByConsultationAssureAndStatut(@Param("assureId") Long assureId, @Param("statut") StatutRemboursement statut);

    // Trouver les remboursements traités entre deux dates
    @Query("SELECT r FROM Remboursement r WHERE r.statut = :statut AND r.dateTraitement BETWEEN :dateDebut AND :dateFin")
    List<Remboursement> findByStatutAndDateTraitementBetween(@Param("statut") StatutRemboursement statut, @Param("dateDebut") LocalDateTime dateDebut, @Param("dateFin") LocalDateTime dateFin);

    // Calculer le montant total des remboursements pour un assuré
    @Query("SELECT COALESCE(SUM(r.montant), 0) FROM Remboursement r JOIN r.consultation c WHERE c.assure.id = :assureId AND r.statut = :statut")
    BigDecimal sumMontantByAssureAndStatut(@Param("assureId") Long assureId, @Param("statut") StatutRemboursement statut);

    // Calculer le montant total des remboursements par statut
    @Query("SELECT COALESCE(SUM(r.montant), 0) FROM Remboursement r WHERE r.statut = :statut")
    BigDecimal sumMontantByStatut(@Param("statut") StatutRemboursement statut);

    // Compter les remboursements par statut
    Long countByStatut(StatutRemboursement statut);

    // Trouver les remboursements par montant minimum
    List<Remboursement> findByMontantGreaterThanEqual(BigDecimal montantMin);

    // Trouver les remboursements d'un assuré pour une période donnée
    @Query("SELECT r FROM Remboursement r JOIN r.consultation c WHERE c.assure.id = :assureId AND c.date BETWEEN :dateDebut AND :dateFin")
    List<Remboursement> findByConsultationAssureAndPeriod(@Param("assureId") Long assureId,
                                                          @Param("dateDebut") LocalDateTime dateDebut,
                                                          @Param("dateFin") LocalDateTime dateFin);

    // Statistiques des remboursements par méthode de paiement
    @Query("SELECT r.methode, COUNT(r), SUM(r.montant) FROM Remboursement r WHERE r.statut = 'TRAITE' GROUP BY r.methode")
    List<Object[]> getStatistiquesByMethodePaiement();

}