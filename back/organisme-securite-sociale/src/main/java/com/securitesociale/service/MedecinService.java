package com.securitesociale.service;

import com.securitesociale.entity.Medecin;
import com.securitesociale.entity.Personne;
import com.securitesociale.repository.MedecinRepository;
import com.securitesociale.repository.PersonneRepository;
import com.securitesociale.exception.ResourceNotFoundException;
import com.securitesociale.exception.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MedecinService {

    @Autowired
    private MedecinRepository medecinRepository;

    @Autowired
    private PersonneRepository personneRepository;

    /**
     * Créer un nouveau médecin
     */
    public Medecin creerMedecin(Medecin medecin) {
        validateMedecin(medecin);

        // Vérifier que la personne existe
        if (medecin == null || medecin.getId() == null) {
            throw new BusinessException("Une personne doit être associée au médecin");
        }

        Personne personne = personneRepository.findById(medecin.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Personne non trouvée avec l'ID: " + medecin.getId()));

        // Vérifier que cette personne n'est pas déjà médecin
        if (medecinRepository.findByPersonneId(personne.getId()).isPresent()) {
            throw new BusinessException("Cette personne est déjà enregistrée comme médecin");
        }
        return medecinRepository.save(medecin);
    }

    /**
     * Obtenir tous les médecins
     */
    @Transactional(readOnly = true)
    public List<Medecin> obtenirTousMedecins() {
        return medecinRepository.findAll();
    }

    /**
     * Obtenir un médecin par son ID
     */
    @Transactional(readOnly = true)
    public Medecin obtenirMedecinParId(Long id) {
        return medecinRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé avec l'ID: " + id));
    }

    /**
     * Obtenir un médecin par l'ID de la personne
     */
    @Transactional(readOnly = true)
    public Optional<Medecin> obtenirMedecinParPersonneId(Long personneId) {
        personneRepository.findById(personneId)
                .orElseThrow(() -> new ResourceNotFoundException("Personne non trouvée avec l'ID: " + personneId));
        return medecinRepository.findByPersonneId(personneId);
    }

    /**
     * Obtenir tous les généralistes
     */
    @Transactional(readOnly = true)
    public List<Medecin> obtenirGeneralistes() {
        return medecinRepository.findGeneralistes();
    }

    /**
     * Obtenir tous les spécialistes
     */
    @Transactional(readOnly = true)
    public List<Medecin> obtenirSpecialistes() {
        return medecinRepository.findSpecialistes();
    }

    /**
     * Obtenir les spécialistes par spécialisation
     */
    @Transactional(readOnly = true)
    public List<Medecin> obtenirSpecialistesParSpecialisation(String specialisation) {
        if (specialisation == null || specialisation.trim().isEmpty()) {
            throw new BusinessException("La spécialisation ne peut pas être vide");
        }
        return medecinRepository.findBySpecialisation(specialisation);
    }

    /**
     * Rechercher des médecins par nom
     */
    @Transactional(readOnly = true)
    public List<Medecin> rechercherMedecinsParNom(String nom) {
        if (nom == null || nom.trim().isEmpty()) {
            throw new BusinessException("Le nom ne peut pas être vide");
        }
        return medecinRepository.findAll().stream()
                .filter(m -> m.getNom().toLowerCase().contains(nom.toLowerCase()))
                .toList();
    }

    /**
     * Mettre à jour un médecin
     */
    public Medecin mettreAJourMedecin(Long id, Medecin medecinMisAJour) {
        Medecin medecin = obtenirMedecinParId(id);

        // Valider la spécialisation
        validateSpecialisation(medecinMisAJour.getSpecialisation());

        // Mettre à jour la spécialisation
        medecin.setSpecialisation(medecinMisAJour.getSpecialisation());

        return medecinRepository.save(medecin);
    }

    /**
     * Supprimer un médecin
     */
    public void supprimerMedecin(Long id) {
        Medecin medecin = obtenirMedecinParId(id);

        // Vérifier s'il y a des consultations associées
        if (medecin.getConsultations() != null && !medecin.getConsultations().isEmpty()) {
            throw new BusinessException("Impossible de supprimer le médecin car il a des consultations associées");
        }

        // Vérifier s'il y a des patients associés
        if (medecin.getPatients() != null && !medecin.getPatients().isEmpty()) {
            throw new BusinessException("Impossible de supprimer le médecin car il a des patients associés");
        }

        medecinRepository.delete(medecin);
    }

    /**
     * Vérifier si une personne est médecin
     */
    @Transactional(readOnly = true)
    public boolean estMedecin(Long personneId) {
        return obtenirMedecinParPersonneId(personneId).isPresent();
    }

    /**
     * Vérifier si un médecin est généraliste
     */
    @Transactional(readOnly = true)
    public boolean estGeneraliste(Long medecinId) {
        Medecin medecin = obtenirMedecinParId(medecinId);
        return medecin.isGeneraliste();
    }

    /**
     * Vérifier si un médecin est spécialiste
     */
    @Transactional(readOnly = true)
    public boolean estSpecialiste(Long medecinId) {
        return !estGeneraliste(medecinId);
    }

    /**
     * Obtenir toutes les spécialisations disponibles
     */
    @Transactional(readOnly = true)
    public List<String> obtenirToutesSpecialisations() {
        return medecinRepository.findAllSpecialisations();
    }

    /**
     * Valider un médecin
     */
    private void validateMedecin(Medecin medecin) {
        if (medecin == null) {
            throw new BusinessException("Le médecin ne peut pas être nul");
        }
        validateSpecialisation(medecin.getSpecialisation());
    }

    /**
     * Valider la spécialisation
     */
    private void validateSpecialisation(String specialisation) {
        if (specialisation != null && specialisation.length() > 100) {
            throw new BusinessException("La spécialisation ne peut pas dépasser 100 caractères");
        }
    }
}