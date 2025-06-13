package com.securitesociale.repository;

import com.securitesociale.entity.Medecin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedecinRepository extends JpaRepository<Medecin, Long> {

    @Query("SELECT m FROM Medecin m WHERE m.specialisation IS NULL OR m.specialisation = ''")
    List<Medecin> findGeneralistes();

    @Query("SELECT m FROM Medecin m WHERE m.specialisation IS NOT NULL AND m.specialisation != ''")
    List<Medecin> findSpecialistes();

    List<Medecin> findBySpecialisation(String specialisation);

    @Query("SELECT DISTINCT m.specialisation FROM Medecin m WHERE m.specialisation IS NOT NULL AND m.specialisation != ''")
    List<String> findAllSpecialisations();

    @Query("SELECT m FROM Medecin m WHERE LOWER(m.specialisation) LIKE LOWER(CONCAT('%', :specialisation, '%'))")
    List<Medecin> findBySpecialisationContaining(@Param("specialisation") String specialisation);

    @Query("SELECT m FROM Medecin m WHERE m.personne.id = :personneId")
    Optional<Medecin> findByPersonneId(@Param("personneId") Long personneId);
}