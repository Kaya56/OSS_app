package com.securitesociale.service;

import com.securitesociale.entity.Assure;
import com.securitesociale.entity.Medecin;
import com.securitesociale.entity.enums.MethodePaiement;
import com.securitesociale.exception.BusinessException;
import com.securitesociale.exception.ResourceNotFoundException;
import com.securitesociale.exception.ValidationException;
import com.securitesociale.repository.AssureRepository;
import com.securitesociale.repository.ConsultationRepository;
import com.securitesociale.repository.MedecinRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AssureService {

    @Autowired
    private AssureRepository assureRepository;

    @Autowired
    private MedecinRepository medecinRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    /**
     * Inscrire un nouvel assuré
     */
    public Assure inscrireAssure(Assure assure) {
        if (assure == null) {
            throw new ValidationException("L'assuré ne peut pas être null");
        }

        validateAssure(assure);

        // Vérifier l'unicité du numéro d'assurance
        if (assureRepository.findByNumeroAssurance(assure.getNumeroAssurance()).isPresent()) {
            throw new ValidationException("Un assuré avec ce numéro d'assurance existe déjà");
        }

        return assureRepository.save(assure);
    }

    /**
     * Mettre à jour un assuré
     */
    public Assure mettreAJourAssure(Long id, Assure assureModifie) {
        Assure assureExistant = getAssureById(id);

        validateAssure(assureModifie);

        // Vérifier l'unicité du numéro d'assurance si modifié
        if (!assureModifie.getNumeroAssurance().equals(assureExistant.getNumeroAssurance())) {
            if (assureRepository.findByNumeroAssurance(assureModifie.getNumeroAssurance()).isPresent()) {
                throw new ValidationException("Un autre assuré avec ce numéro d'assurance existe déjà");
            }
        }

        // Mettre à jour les champs
        assureExistant.setNom(assureModifie.getNom());
        assureExistant.setDateNaissance(assureModifie.getDateNaissance());
        assureExistant.setGenre(assureModifie.getGenre());
        assureExistant.setAdresse(assureModifie.getAdresse());
        assureExistant.setTelephone(assureModifie.getTelephone());
        assureExistant.setEmail(assureModifie.getEmail());
        assureExistant.setNumeroAssurance(assureModifie.getNumeroAssurance());
        assureExistant.setMethodePaiementPreferee(assureModifie.getMethodePaiementPreferee());

        return assureRepository.save(assureExistant);
    }

    /**
     * Obtenir un assuré par ID
     */
    @Transactional(readOnly = true)
    public Assure getAssureById(Long id) {
        return assureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assuré non trouvé avec l'ID: " + id));
    }

    /**
     * Obtenir un assuré par numéro d'assurance
     */
    @Transactional(readOnly = true)
    public Assure getAssureByNumero(String numeroAssurance) {
        return assureRepository.findByNumeroAssurance(numeroAssurance)
                .orElseThrow(() -> new ResourceNotFoundException("Assuré non trouvé avec le numéro: " + numeroAssurance));
    }

    /**
     * Obtenir tous les assurés
     */
    @Transactional(readOnly = true)
    public List<Assure> getAllAssures() {
        return assureRepository.findAll();
    }

    /**
     * Rechercher des assurés sans médecin traitant
     */
    @Transactional(readOnly = true)
    public List<Assure> getAssuresSansMedecinTraitant() {
        return assureRepository.findAssuresSansMedecinTraitant();
    }

    /**
     * Rechercher des assurés par méthode de paiement préférée
     */
    @Transactional(readOnly = true)
    public List<Assure> getAssuresParMethodePaiement(MethodePaiement methodePaiement) {
        return assureRepository.findByMethodePaiementPreferee(methodePaiement);
    }

    /**
     * Choisir ou changer de médecin traitant
     */
    public Assure choisirMedecinTraitant(Long id, Long medecinId) {
        Assure assure = getAssureById(id);

        if (medecinId == null) {
            // Retirer le médecin traitant
            assure.setMedecinTraitant(null);
        } else {
            // Vérifier que le médecin existe et est un généraliste
            Medecin medecin = medecinRepository.findById(medecinId)
                    .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé avec l'ID: " + medecinId));

            if (!medecin.isGeneraliste()) {
                throw new BusinessException("Seul un médecin généraliste peut être choisi comme médecin traitant");
            }

            assure.setMedecinTraitant(medecin);
        }

        return assureRepository.save(assure);
    }

    /**
     * Obtenir les assurés d'un médecin traitant
     */
    @Transactional(readOnly = true)
    public List<Assure> getAssuresParMedecinTraitant(Long medecinId) {
        return assureRepository.findByMedecinTraitantId(medecinId);
    }

    /**
     * Vérifier si une personne est assurée
     */
    @Transactional(readOnly = true)
    public boolean isAssure(Long id) {
        return assureRepository.findById(id).isPresent();
    }

    /**
     * Supprimer un assuré
     */
    public void supprimerAssure(Long id) {
        Assure assure = getAssureById(id);

        // Vérifier s'il y a des consultations associées
        if (!consultationRepository.findByAssureId(id).isEmpty()) {
            throw new BusinessException("Impossible de supprimer l'assuré car il a des consultations associées");
        }

        assureRepository.delete(assure);
    }

    /**
     * Obtenir le nombre total d'assurés
     */
    @Transactional(readOnly = true)
    public long getNombreTotalAssures() {
        return assureRepository.count();
    }

    /**
     * Obtenir le nombre d'assurés avec médecin traitant
     */
    @Transactional(readOnly = true)
    public long getNombreAssuresAvecMedecinTraitant() {
        return assureRepository.count() - assureRepository.findAssuresSansMedecinTraitant().size();
    }

    /**
     * Rechercher des assurés par nom
     */
    @Transactional(readOnly = true)
    public List<Assure> rechercherAssuresParNom(String nom) {
        if (nom == null || nom.trim().isEmpty()) {
            throw new ValidationException("Le nom de recherche ne peut pas être vide");
        }
        return assureRepository.findByNomContainingIgnoreCase(nom.trim());
    }

    /**
     * Valider les données d'un assuré
     */
    private void validateAssure(Assure assure) {
        if (assure.getNumeroAssurance() == null || assure.getNumeroAssurance().trim().isEmpty()) {
            throw new ValidationException("Le numéro d'assurance est obligatoire");
        }

        if (!assure.getNumeroAssurance().matches("^[0-9]{13}$")) {
            throw new ValidationException("Le numéro d'assurance doit contenir exactement 13 chiffres");
        }

        if (assure.getMethodePaiementPreferee() == null) {
            throw new ValidationException("La méthode de paiement préférée est obligatoire");
        }

        // Validation des champs hérités de Personne
        if (assure.getNom() == null || assure.getNom().trim().isEmpty()) {
            throw new ValidationException("Le nom est obligatoire");
        }

        if (assure.getDateNaissance() == null) {
            throw new ValidationException("La date de naissance est obligatoire");
        }

        if (assure.getGenre() == null) {
            throw new ValidationException("Le genre doit être M, F ou AUTRE");
        }

        if (assure.getAdresse() == null || assure.getAdresse().trim().isEmpty()) {
            throw new ValidationException("L'adresse est obligatoire");
        }

        if (assure.getTelephone() != null && !assure.getTelephone().isEmpty() && !assure.getTelephone().matches("^\\+?[0-9]{8,15}$")) {
            throw new ValidationException("Format de téléphone invalide");
        }

        if (assure.getEmail() != null && !assure.getEmail().isEmpty() && !assure.getEmail().matches("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$")) {
            throw new ValidationException("Format d'email invalide");
        }
    }
}