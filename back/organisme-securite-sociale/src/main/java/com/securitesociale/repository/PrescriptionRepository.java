package com.securitesociale.repository;

import com.securitesociale.entity.Prescription;
import com.securitesociale.entity.enums.TypePrescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    // Trouver toutes les prescriptions d'une consultation
    List<Prescription> findByConsultationId(Long consultationId);

    // Trouver les prescriptions par type
    List<Prescription> findByType(TypePrescription type);

    // Trouver les prescriptions de médicaments
    List<Prescription> findByTypeAndDetailsMedicamentIsNotNull(TypePrescription type);

    // Trouver les prescriptions pour consultations spécialisées par spécialiste
    List<Prescription> findByTypeAndSpecialisteId(TypePrescription type, Long specialisteId);

    // Trouver toutes les prescriptions d'un assuré via ses consultations
    @Query("SELECT p FROM Prescription p JOIN p.consultation c WHERE c.assure.id = :assureId")
    List<Prescription> findByAssureId(@Param("assureId") Long assureId);

    // Trouver les prescriptions d'un assuré par type
    @Query("SELECT p FROM Prescription p JOIN p.consultation c WHERE c.assure.id = :assureId AND p.type = :type")
    List<Prescription> findByAssureIdAndType(@Param("assureId") Long assureId, @Param("type") TypePrescription type);

    // Trouver les prescriptions émises par un médecin
    @Query("SELECT p FROM Prescription p JOIN p.consultation c WHERE c.medecin.id = :medecinId")
    List<Prescription> findByMedecinId(@Param("medecinId") Long medecinId);

    // Trouver les prescriptions entre deux dates
    @Query("SELECT p FROM Prescription p JOIN p.consultation c WHERE c.date BETWEEN :dateDebut AND :dateFin")
    List<Prescription> findByDateBetween(@Param("dateDebut") LocalDate dateDebut, @Param("dateFin") LocalDate dateFin);

    // Compter les prescriptions de médicaments pour un assuré
    @Query("SELECT COUNT(p) FROM Prescription p JOIN p.consultation c WHERE c.assure.id = :assureId AND p.type = 'MEDICAMENT'")
    Long countPrescriptionsMedicamentsByAssure(@Param("assureId") Long assureId);

    // Compter les prescriptions de consultations spécialisées pour un assuré
    @Query("SELECT COUNT(p) FROM Prescription p JOIN p.consultation c WHERE c.assure.id = :assureId AND p.type = 'CONSULTATION_SPECIALISTE'")
    Long countPrescriptionsConsultationsByAssure(@Param("assureId") Long assureId);

    // Trouver les prescriptions pour un spécialiste donné
    @Query("SELECT p FROM Prescription p WHERE p.type = 'CONSULTATION_SPECIALISTE' AND p.specialiste.id = :specialisteId")
    List<Prescription> findPrescriptionsForSpecialiste(@Param("specialisteId") Long specialisteId);
}