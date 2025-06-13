package com.securitesociale.service;

import com.securitesociale.entity.Personne;
import com.securitesociale.entity.Media;
import com.securitesociale.repository.AssureRepository;
import com.securitesociale.repository.MedecinRepository;
import com.securitesociale.repository.PersonneRepository;
import com.securitesociale.exception.ResourceNotFoundException;
import com.securitesociale.exception.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PersonneService {

    @Autowired
    private PersonneRepository personneRepository;

    @Autowired
    private AssureRepository assureRepository;

    @Autowired
    private MedecinRepository medecinRepository;

    @Autowired
    private MediaService mediaService;

    public Personne creerPersonne(Personne personne) {
        if (personne == null) {
            throw new BusinessException("La personne ne peut pas être nulle");
        }

        validatePersonne(personne);

        if (personne.getEmail() != null && !personne.getEmail().trim().isEmpty()) {
            Optional<Personne> existante = personneRepository.findByEmail(personne.getEmail());
            if (existante.isPresent()) {
                throw new BusinessException("Une personne avec cet email existe déjà");
            }
        }

        return personneRepository.save(personne);
    }

    public Personne mettreAJourPersonne(Long id, Personne personneModifiee) {
        Personne personneExistante = getPersonneById(id);

        validatePersonne(personneModifiee);

        if (personneModifiee.getEmail() != null && !personneModifiee.getEmail().equals(personneExistante.getEmail())) {
            Optional<Personne> autrePersonne = personneRepository.findByEmail(personneModifiee.getEmail());
            if (autrePersonne.isPresent() && !autrePersonne.get().getId().equals(id)) {
                throw new BusinessException("Une autre personne avec cet email existe déjà");
            }
        }

        personneExistante.setNom(personneModifiee.getNom());
        personneExistante.setPrenom(personneModifiee.getPrenom());
        personneExistante.setDateNaissance(personneModifiee.getDateNaissance());
        personneExistante.setGenre(personneModifiee.getGenre());
        personneExistante.setAdresse(personneModifiee.getAdresse());
        personneExistante.setTelephone(personneModifiee.getTelephone());
        personneExistante.setEmail(personneModifiee.getEmail());

        // Ne pas modifier photo ici, car géré séparément
        return personneRepository.save(personneExistante);
    }

    @Transactional(readOnly = true)
    public Personne getPersonneById(Long id) {
        return personneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personne non trouvée avec l'ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Personne> getAllPersonnes() {
        return personneRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Personne> rechercherParNom(String nom) {
        if (nom == null || nom.trim().isEmpty()) {
            throw new BusinessException("Le nom de recherche ne peut pas être vide");
        }
        return personneRepository.findByNomContainingIgnoreCase(nom.trim());
    }

    @Transactional(readOnly = true)
    public Optional<Personne> rechercherParEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return Optional.empty();
        }
        return personneRepository.findByEmail(email.trim());
    }

    @Transactional(readOnly = true)
    public List<Personne> rechercherParTelephone(String telephone) {
        if (telephone == null || telephone.trim().isEmpty()) {
            throw new BusinessException("Le numéro de téléphone ne peut pas être vide");
        }
        return personneRepository.findByTelephoneContaining(telephone.trim());
    }

    public void supprimerPersonne(Long id) {
        Personne personne = getPersonneById(id);

        if (assureRepository.existsById(id)) {
            throw new BusinessException("Impossible de supprimer la personne car elle est enregistrée comme assuré");
        }

        if (medecinRepository.findById(id).isPresent()) {
            throw new BusinessException("Impossible de supprimer la personne car elle est enregistrée comme médecin");
        }

        if (personne.getPhoto() != null) {
            mediaService.deleteMedia(personne.getPhoto().getId());
        }

        personneRepository.delete(personne);
    }

    @Transactional(readOnly = true)
    public boolean personneExiste(Long id) {
        return personneRepository.existsById(id);
    }

    public Personne uploadPhotoProfil(Long id, MultipartFile file) {
        Personne personne = getPersonneById(id);

        // Supprimer l'ancienne photo si elle existe
        if (personne.getPhoto() != null) {
            mediaService.deleteMedia(personne.getPhoto().getId());
        }

        // Télécharger la nouvelle photo
        Media media = mediaService.uploadMedia(file);
        personne.setPhoto(media);

        return personneRepository.save(personne);
    }

    private void validatePersonne(Personne personne) {
        if (personne.getNom() == null || personne.getNom().trim().isEmpty()) {
            throw new BusinessException("Le nom est obligatoire");
        }
        if (personne.getPrenom() == null || personne.getPrenom().trim().isEmpty()) {
            throw new BusinessException("Le prénom est obligatoire");
        }
        if (personne.getDateNaissance() == null) {
            throw new BusinessException("La date de naissance est obligatoire");
        }
        if (personne.getGenre() == null) {
            throw new BusinessException("Le genre est obligatoire");
        }
        if (personne.getAdresse() == null || personne.getAdresse().trim().isEmpty()) {
            throw new BusinessException("L'adresse est obligatoire");
        }
        if (personne.getTelephone() == null || personne.getTelephone().trim().isEmpty()) {
            throw new BusinessException("Le numéro de téléphone est obligatoire");
        }
        if (!personne.getTelephone().matches("^\\+?[1-9]\\d{1,14}$")) {
            throw new BusinessException("Format de téléphone invalide");
        }
        if (personne.getEmail() == null || personne.getEmail().trim().isEmpty()) {
            throw new BusinessException("L'email est obligatoire");
        }
        if (!personne.getEmail().matches("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$")) {
            throw new BusinessException("Format d'email invalide");
        }
    }
}