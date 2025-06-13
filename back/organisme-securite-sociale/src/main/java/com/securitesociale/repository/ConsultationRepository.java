package com.securitesociale.repository;

import com.securitesociale.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    // Trouver toutes les consultations d'un assuré
    List<Consultation> findByAssureId(Long assureId);

    // Trouver toutes les consultations d'un médecin
    List<Consultation> findByMedecinId(Long medecinId);

    // Trouver les consultations par date
    List<Consultation> findByDateBetween(LocalDateTime dateDebut, LocalDateTime dateFin);

    // Trouver les consultations d'un assuré entre deux dates
    @Query("SELECT c FROM Consultation c WHERE c.assure.id = :assureId AND c.date BETWEEN :dateDebut AND :dateFin")
    List<Consultation> findByAssureIdAndDateBetween(@Param("assureId") Long assureId, @Param("dateDebut") LocalDateTime dateDebut, @Param("dateFin") LocalDateTime dateFin);

    // Trouver les consultations d'un médecin entre deux dates
    @Query("SELECT c FROM Consultation c WHERE c.medecin.id = :medecinId AND c.date BETWEEN :dateDebut AND :dateFin")
    List<Consultation> findByMedecinIdAndDateBetween(@Param("medecinId") Long medecinId, @Param("dateDebut") LocalDateTime dateDebut, @Param("dateFin") LocalDateTime dateFin);

    // Trouver les consultations avec généralistes
    @Query("SELECT c FROM Consultation c WHERE c.medecin.specialisation IS NULL")
    List<Consultation> findByMedecinSpecialisationIsNull();

    // Trouver les consultations avec spécialistes
    @Query("SELECT c FROM Consultation c WHERE c.medecin.specialisation IS NOT NULL")
    List<Consultation> findByMedecinSpecialisationIsNotNull();

    // Trouver les consultations avec généralistes pour un assuré
    @Query("SELECT c FROM Consultation c WHERE c.assure.id = :assureId AND c.medecin.specialisation IS NULL")
    List<Consultation> findConsultationsGeneralisteByAssureId(@Param("assureId") Long assureId);

    // Trouver les consultations avec spécialistes pour un assuré
    @Query("SELECT c FROM Consultation c WHERE c.assure.id = :assureId AND c.medecin.specialisation IS NOT NULL")
    List<Consultation> findConsultationsSpecialisteByAssureId(@Param("assureId") Long assureId);

    // Compter les consultations d'un assuré pour une période donnée
    @Query("SELECT COUNT(c) FROM Consultation c WHERE c.assure.id = :assureId AND c.date BETWEEN :dateDebut AND :dateFin")
    Long countConsultationsByAssureAndPeriod(@Param("assureId") Long assureId, @Param("dateDebut") LocalDateTime dateDebut, @Param("dateFin") LocalDateTime dateFin);

    // Compter les consultations avec généralistes
    @Query("SELECT COUNT(c) FROM Consultation c WHERE c.medecin.specialisation IS NULL")
    Long countByMedecinSpecialisationIsNull();

    // Compter les consultations avec spécialistes
    @Query("SELECT COUNT(c) FROM Consultation c WHERE c.medecin.specialisation IS NOT NULL")
    Long countByMedecinSpecialisationIsNotNull();

    // Trouver les consultations sans remboursement
    @Query("SELECT c FROM Consultation c WHERE c.id NOT IN (SELECT r.consultation.id FROM Remboursement r)")
    List<Consultation> findConsultationsSansRemboursement();
}