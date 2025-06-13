package com.securitesociale.repository;

import com.securitesociale.entity.Personne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonneRepository extends JpaRepository<Personne, Long> {

    List<Personne> findByNomContainingIgnoreCase(String nom);

    Optional<Personne> findByEmail(String email);

    @Query("SELECT p FROM Personne p WHERE p.telephone LIKE CONCAT('%', :telephone, '%')")
    List<Personne> findByTelephoneContaining(@Param("telephone") String telephone);

    @Query("SELECT p FROM Personne p WHERE LOWER(p.nom) LIKE LOWER(CONCAT('%', :nom, '%')) OR LOWER(p.email) LIKE LOWER(CONCAT('%', :nom, '%'))")
    List<Personne> findByNomOrEmail(@Param("nom") String nom);
}