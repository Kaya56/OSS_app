package com.securitesociale.util;

import com.securitesociale.exception.ValidationException;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.regex.Pattern;

/**
 * Utilitaires pour les validations métier
 */
public class ValidationUtils {

    // Expressions régulières pour validation
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );

    private static final Pattern TELEPHONE_PATTERN = Pattern.compile(
            "^(?:\\+33|0)[1-9](?:[0-9]{8})$"
    );

    private static final Pattern NUMERO_ASSURANCE_PATTERN = Pattern.compile(
            "^[0-9]{13}$"
    );

    /**
     * Valide une adresse email
     *
     * @param email L'email à valider
     * @throws ValidationException si l'email n'est pas valide
     */
    public static void validerEmail(String email) {
        if (!StringUtils.hasText(email)) {
            throw new ValidationException("L'email ne peut pas être vide");
        }

        if (!EMAIL_PATTERN.matcher(email.trim()).matches()) {
            throw new ValidationException("Format d'email invalide: " + email);
        }
    }

    /**
     * Valide un numéro de téléphone français
     *
     * @param telephone Le numéro à valider
     * @throws ValidationException si le numéro n'est pas valide
     */
    public static void validerTelephone(String telephone) {
        if (!StringUtils.hasText(telephone)) {
            throw new ValidationException("Le numéro de téléphone ne peut pas être vide");
        }

        // Nettoyer le numéro (retirer espaces, points, tirets)
        String numeroNettoye = telephone.replaceAll("[\\s.-]", "");

        if (!TELEPHONE_PATTERN.matcher(numeroNettoye).matches()) {
            throw new ValidationException("Format de téléphone invalide: " + telephone);
        }
    }

    /**
     * Valide un numéro d'assurance sociale
     *
     * @param numeroAssurance Le numéro à valider
     * @throws ValidationException si le numéro n'est pas valide
     */
    public static void validerNumeroAssurance(String numeroAssurance) {
        if (!StringUtils.hasText(numeroAssurance)) {
            throw new ValidationException("Le numéro d'assurance ne peut pas être vide");
        }

        if (!NUMERO_ASSURANCE_PATTERN.matcher(numeroAssurance.trim()).matches()) {
            throw new ValidationException("Le numéro d'assurance doit contenir exactement 13 chiffres");
        }
    }

    /**
     * Valide une date de naissance
     *
     * @param dateNaissance La date à valider
     * @throws ValidationException si la date n'est pas valide
     */
    public static void validerDateNaissance(LocalDate dateNaissance) {
        if (dateNaissance == null) {
            throw new ValidationException("La date de naissance ne peut pas être nulle");
        }

        LocalDate aujourdhui = LocalDate.now();

        if (dateNaissance.isAfter(aujourdhui)) {
            throw new ValidationException("La date de naissance ne peut pas être dans le futur");
        }

        // Vérifier que la personne n'a pas plus de 150 ans
        Period age = Period.between(dateNaissance, aujourdhui);
        if (age.getYears() > 150) {
            throw new ValidationException("Age invalide: la personne ne peut pas avoir plus de 150 ans");
        }
    }

    /**
     * Valide l'âge minimum pour être médecin
     *
     * @param dateNaissance La date de naissance du médecin
     * @throws ValidationException si l'âge n'est pas suffisant
     */
    public static void validerAgeMedecin(LocalDate dateNaissance) {
        validerDateNaissance(dateNaissance);

        LocalDate aujourdhui = LocalDate.now();
        Period age = Period.between(dateNaissance, aujourdhui);

        if (age.getYears() < 25) {
            throw new ValidationException("Un médecin doit avoir au moins 25 ans");
        }
    }

    /**
     * Valide un nom ou prénom
     *
     * @param nom Le nom à valider
     * @param champNom Le nom du champ pour le message d'erreur
     * @throws ValidationException si le nom n'est pas valide
     */
    public static void validerNom(String nom, String champNom) {
        if (!StringUtils.hasText(nom)) {
            throw new ValidationException(champNom + " ne peut pas être vide");
        }

        if (nom.trim().length() < 2) {
            throw new ValidationException(champNom + " doit contenir au moins 2 caractères");
        }

        if (nom.trim().length() > 50) {
            throw new ValidationException(champNom + " ne peut pas dépasser 50 caractères");
        }

        // Vérifier que le nom ne contient que des lettres, espaces, apostrophes et tirets
        if (!nom.trim().matches("^[a-zA-ZÀ-ÿ\\s'\\-]+$")) {
            throw new ValidationException(champNom + " ne peut contenir que des lettres, espaces, apostrophes et tirets");
        }
    }

    /**
     * Valide une adresse
     *
     * @param adresse L'adresse à valider
     * @throws ValidationException si l'adresse n'est pas valide
     */
    public static void validerAdresse(String adresse) {
        if (!StringUtils.hasText(adresse)) {
            throw new ValidationException("L'adresse ne peut pas être vide");
        }

        if (adresse.trim().length() < 10) {
            throw new ValidationException("L'adresse doit contenir au moins 10 caractères");
        }

        if (adresse.trim().length() > 200) {
            throw new ValidationException("L'adresse ne peut pas dépasser 200 caractères");
        }
    }

    /**
     * Valide une spécialisation médicale
     *
     * @param specialisation La spécialisation à valider
     * @throws ValidationException si la spécialisation n'est pas valide
     */
    public static void validerSpecialisation(String specialisation) {
        if (StringUtils.hasText(specialisation)) {
            if (specialisation.trim().length() < 3) {
                throw new ValidationException("La spécialisation doit contenir au moins 3 caractères");
            }

            if (specialisation.trim().length() > 50) {
                throw new ValidationException("La spécialisation ne peut pas dépasser 50 caractères");
            }

            if (!specialisation.trim().matches("^[a-zA-ZÀ-ÿ\\s'\\-]+$")) {
                throw new ValidationException("La spécialisation ne peut contenir que des lettres, espaces, apostrophes et tirets");
            }
        }
    }

    /**
     * Valide un coût de consultation
     *
     * @param cout Le coût à valider
     * @throws ValidationException si le coût n'est pas valide
     */
    public static void validerCoutConsultation(double cout) {
        if (cout <= 0) {
            throw new ValidationException("Le coût de la consultation doit être positif");
        }

        if (cout > 1000) {
            throw new ValidationException("Le coût de la consultation ne peut pas dépasser 1000€");
        }
    }

    /**
     * Valide une date de consultation
     *
     * @param dateConsultation La date à valider
     * @throws ValidationException si la date n'est pas valide
     */
    public static void validerDateConsultation(LocalDateTime dateConsultation) {
        if (dateConsultation == null) {
            throw new ValidationException("La date de consultation ne peut pas être nulle");
        }

        LocalDateTime maintenant = LocalDateTime.now();

        // La consultation ne peut pas être dans le futur (plus de 1 heure)
        if (dateConsultation.isAfter(maintenant.plusHours(1))) {
            throw new ValidationException("La date de consultation ne peut pas être dans le futur");
        }

        // La consultation ne peut pas être trop ancienne (plus de 2 ans)
        if (dateConsultation.isBefore(maintenant.minusYears(2))) {
            throw new ValidationException("La date de consultation ne peut pas être antérieure à 2 ans");
        }
    }

    /**
     * Valide des détails médicaux
     *
     * @param detailsMedical Les détails à valider
     * @throws ValidationException si les détails ne sont pas valides
     */
    public static void validerDetailsMedical(String detailsMedical) {
        if (StringUtils.hasText(detailsMedical)) {
            if (detailsMedical.trim().length() > 1000) {
                throw new ValidationException("Les détails médicaux ne peuvent pas dépasser 1000 caractères");
            }
        }
    }

    /**
     * Valide des détails de médicament pour une prescription
     *
     * @param detailsMedicament Les détails à valider
     * @throws ValidationException si les détails ne sont pas valides
     */
    public static void validerDetailsMedicament(String detailsMedicament) {
        if (StringUtils.hasText(detailsMedicament)) {
            if (detailsMedicament.trim().length() < 3) {
                throw new ValidationException("Les détails du médicament doivent contenir au moins 3 caractères");
            }

            if (detailsMedicament.trim().length() > 200) {
                throw new ValidationException("Les détails du médicament ne peuvent pas dépasser 200 caractères");
            }
        }
    }

    /**
     * Valide qu'une chaîne n'est pas vide après trim
     *
     * @param valeur La valeur à valider
     * @param nomChamp Le nom du champ pour le message d'erreur
     * @throws ValidationException si la valeur est vide
     */
    public static void validerNonVide(String valeur, String nomChamp) {
        if (!StringUtils.hasText(valeur)) {
            throw new ValidationException(nomChamp + " ne peut pas être vide");
        }
    }

    /**
     * Valide qu'un objet n'est pas null
     *
     * @param objet L'objet à valider
     * @param nomChamp Le nom du champ pour le message d'erreur
     * @throws ValidationException si l'objet est null
     */
    public static void validerNonNull(Object objet, String nomChamp) {
        if (objet == null) {
            throw new ValidationException(nomChamp + " ne peut pas être null");
        }
    }

    /**
     * Valide qu'un ID est positif
     *
     * @param id L'ID à valider
     * @param nomChamp Le nom du champ pour le message d'erreur
     * @throws ValidationException si l'ID n'est pas valide
     */
    public static void validerIdPositif(Long id, String nomChamp) {
        if (id == null || id <= 0) {
            throw new ValidationException(nomChamp + " doit être un nombre positif");
        }
    }

    /**
     * Calcule l'âge à partir d'une date de naissance
     *
     * @param dateNaissance La date de naissance
     * @return L'âge en années
     */
    public static int calculerAge(LocalDate dateNaissance) {
        if (dateNaissance == null) {
            return 0;
        }
        return Period.between(dateNaissance, LocalDate.now()).getYears();
    }

    /**
     * Nettoie et formate un numéro de téléphone
     *
     * @param telephone Le numéro à nettoyer
     * @return Le numéro nettoyé
     */
    public static String nettoyerTelephone(String telephone) {
        if (!StringUtils.hasText(telephone)) {
            return "";
        }
        return telephone.replaceAll("[\\s.-]", "");
    }

    /**
     * Capitalise la première lettre de chaque mot
     *
     * @param texte Le texte à formater
     * @return Le texte formaté
     */
    public static String capitaliserMots(String texte) {
        if (!StringUtils.hasText(texte)) {
            return "";
        }

        String[] mots = texte.trim().toLowerCase().split("\\s+");
        StringBuilder resultat = new StringBuilder();

        for (int i = 0; i < mots.length; i++) {
            if (i > 0) {
                resultat.append(" ");
            }
            if (mots[i].length() > 0) {
                resultat.append(Character.toUpperCase(mots[i].charAt(0)));
                if (mots[i].length() > 1) {
                    resultat.append(mots[i].substring(1));
                }
            }
        }

        return resultat.toString();
    }
}