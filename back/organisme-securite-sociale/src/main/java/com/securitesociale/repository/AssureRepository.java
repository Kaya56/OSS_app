package com.securitesociale.repository;

import com.securitesociale.entity.Assure;
import com.securitesociale.entity.enums.MethodePaiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssureRepository extends JpaRepository<Assure, Long> {

    Optional<Assure> findByNumeroAssurance(String numeroAssurance);

    List<Assure> findByMethodePaiementPreferee(MethodePaiement methodePaiement);

    @Query("SELECT a FROM Assure a WHERE a.medecinTraitant.id = :medecinId")
    List<Assure> findByMedecinTraitantId(@Param("medecinId") Long medecinId);

    @Query("SELECT a FROM Assure a WHERE a.medecinTraitant IS NULL")
    List<Assure> findAssuresSansMedecinTraitant();

    @Query("SELECT COUNT(a) FROM Assure a WHERE a.medecinTraitant.id = :medecinId")
    Long countPatientsByMedecinId(@Param("medecinId") Long medecinId);

    @Query("SELECT a FROM Assure a WHERE LOWER(a.nom) LIKE LOWER(CONCAT('%', :nom, '%'))")
    List<Assure> findByNomContainingIgnoreCase(@Param("nom") String nom);
}