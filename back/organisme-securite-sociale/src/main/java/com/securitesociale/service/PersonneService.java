package com.securitesociale.service;

import com.securitesociale.entity.Personne;
import com.securitesociale.exception.ResourceNotFoundException;
import com.securitesociale.exception.ValidationException;
import com.securitesociale.repository.PersonneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PersonneService {

    @Autowired
    private PersonneRepository personneRepository;

    /**
     * Créer une nouvelle personne
     */
    public Personne creerPersonne(Personne personne) {
        if (personne == null) {
            throw new ValidationException("La personne ne peut pas être nulle");
        }

        validatePersonne(personne);

        // Vérifier l'unicité de l'email si fourni
        if (personne.getEmail() != null && !personne.getEmail().trim().isEmpty()) {
            Optional<Personne> existante = personneRepository.findByEmail(personne.getEmail());
            if (existante.isPresent()) {
                throw new ValidationException("Une personne avec cet email existe déjà");
            }
        }

        return personneRepository.save(personne);
    }

    /**
     * Mettre à jour une personne existante
     */
    public Personne mettreAJourPersonne(Long id, Personne personneModifiee) {
        Personne personneExistante = getPersonneById(id);

        validatePersonne(personneModifiee);

        // Vérifier l'unicité de l'email si modifié
        if (personneModifiee.getEmail() != null && !personneModifiee.getEmail().equals(personneExistante.getEmail())) {
            Optional<Personne> autrePersonne = personneRepository.findByEmail(personneModifiee.getEmail());
            if (autrePersonne.isPresent() && !autrePersonne.get().getId().equals(id)) {
                throw new ValidationException("Une autre personne avec cet email existe déjà");
            }
        }

        // Mettre à jour les champs
        personneExistante.setNom(personneModifiee.getNom());
        personneExistante.setDateNaissance(personneModifiee.getDateNaissance());
        personneExistante.setGenre(personneModifiee.getGenre());
        personneExistante.setAdresse(personneModifiee.getAdresse());
        personneExistante.setTelephone(personneModifiee.getTelephone());
        personneExistante.setEmail(personneModifiee.getEmail());

        return personneRepository.save(personneExistante);
    }

    /**
     * Obtenir une personne par ID
     */
    @Transactional(readOnly = true)
    public Personne getPersonneById(Long id) {
        return personneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personne non trouvée avec l'ID: " + id));
    }

    /**
     * Obtenir toutes les personnes
     */
    @Transactional(readOnly = true)
    public List<Personne> getAllPersonnes() {
        return personneRepository.findAll();
    }

    /**
     * Rechercher des personnes par nom
     */
    @Transactional(readOnly = true)
    public List<Personne> rechercherParNom(String nom) {
        if (nom == null || nom.trim().isEmpty()) {
            throw new ValidationException("Le nom de recherche ne peut pas être vide");
        }
        return personneRepository.findByNomContainingIgnoreCase(nom.trim());
    }

    /**
     * Rechercher une personne par email
     */
    @Transactional(readOnly = true)
    public Optional<Personne> rechercherParEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return Optional.empty();
        }
        return personneRepository.findByEmail(email.trim());
    }

    /**
     * Rechercher des personnes par téléphone
     */
    @Transactional(readOnly = true)
    public List<Personne> rechercherParTelephone(String telephone) {
        if (telephone == null || telephone.trim().isEmpty()) {
            throw new ValidationException("Le numéro de téléphone ne peut pas être vide");
        }
        return personneRepository.findByTelephoneContaining(telephone.trim());
    }

    /**
     * Supprimer une personne
     */
    public void supprimerPersonne(Long id) {
        Personne personne = getPersonneById(id);

        // Vérifier s'il y a des contraintes métier avant suppression
        // Par exemple, vérifier si la personne est un assuré avec des consultations
        // ou un médecin avec des consultations en cours

        personneRepository.delete(personne);
    }

    /**
     * Vérifier si une personne existe
     */
    @Transactional(readOnly = true)
    public boolean personneExiste(Long id) {
        return personneRepository.existsById(id);
    }

    /**
     * Valider les données d'une personne
     */
    private void validatePersonne(Personne personne) {
        if (personne.getNom() == null || personne.getNom().trim().isEmpty()) {
            throw new ValidationException("Le nom est obligatoire");
        }

        if (personne.getDateNaissance() == null) {
            throw new ValidationException("La date de naissance est obligatoire");
        }

        if (personne.getGenre() == null) {
            throw new ValidationException("Le genre est obligatoire");
        }

        // Validation de l'email si fourni
        if (personne.getEmail() != null && !personne.getEmail().trim().isEmpty()) {
            if (!isValidEmail(personne.getEmail())) {
                throw new ValidationException("Format d'email invalide");
            }
        }

        // Validation du téléphone si fourni
        if (personne.getTelephone() != null && !personne.getTelephone().trim().isEmpty()) {
            if (!isValidTelephone(personne.getTelephone())) {
                throw new ValidationException("Format de téléphone invalide");
            }
        }
    }

    /**
     * Valider le format de l'email
     */
    private boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");
    }

    /**
     * Valider le format du téléphone
     */
    private boolean isValidTelephone(String telephone) {
        // Format simple pour numéros français : 10 chiffres ou format international
        return telephone.matches("^(?:\\+33|0)[1-9](?:[0-9]{8})$") ||
                telephone.matches("^\\+?[1-9]\\d{1,14}$");
    }
}