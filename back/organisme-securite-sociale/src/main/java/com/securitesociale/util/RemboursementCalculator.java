package com.securitesociale.util;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Utilitaire pour le calcul des remboursements selon les règles métier
 */
@Component
public class RemboursementCalculator {

    // Taux de remboursement pour les généralistes (100%)
    private static final BigDecimal TAUX_GENERALISTE = BigDecimal.ONE;

    // Taux de remboursement pour les spécialistes (80%)
    private static final BigDecimal TAUX_SPECIALISTE = new BigDecimal("0.8");

    /**
     * Calcule le montant du remboursement selon le type de médecin
     *
     * @param coutConsultation Le coût de la consultation
     * @param estGeneraliste true si le médecin est généraliste, false s'il est spécialiste
     * @return Le montant du remboursement
     */
    public BigDecimal calculerMontantRemboursement(BigDecimal coutConsultation, boolean estGeneraliste) {
        if (coutConsultation == null || coutConsultation.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Le coût de la consultation ne peut pas être négatif");
        }

        BigDecimal taux = estGeneraliste ? TAUX_GENERALISTE : TAUX_SPECIALISTE;
        return coutConsultation.multiply(taux).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Calcule le montant du remboursement avec un taux personnalisé
     *
     * @param coutConsultation Le coût de la consultation
     * @param tauxRemboursement Le taux de remboursement (entre 0 et 1)
     * @return Le montant du remboursement
     */
    public BigDecimal calculerMontantRemboursement(BigDecimal coutConsultation, BigDecimal tauxRemboursement) {
        if (coutConsultation == null || coutConsultation.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Le coût de la consultation ne peut pas être négatif");
        }

        if (tauxRemboursement == null || tauxRemboursement.compareTo(BigDecimal.ZERO) < 0 || tauxRemboursement.compareTo(BigDecimal.ONE) > 0) {
            throw new IllegalArgumentException("Le taux de remboursement doit être entre 0 et 1");
        }

        return coutConsultation.multiply(tauxRemboursement).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Calcule le pourcentage de remboursement effectif
     *
     * @param montantRembourse Le montant remboursé
     * @param coutConsultation Le coût total de la consultation
     * @return Le pourcentage de remboursement (entre 0 et 100)
     */
    public BigDecimal calculerPourcentageRemboursement(BigDecimal montantRembourse, BigDecimal coutConsultation) {
        if (coutConsultation == null || coutConsultation.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        return montantRembourse.divide(coutConsultation, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Calcule le reste à charge pour l'assuré
     *
     * @param coutConsultation Le coût total de la consultation
     * @param montantRembourse Le montant remboursé
     * @return Le montant restant à la charge de l'assuré
     */
    public BigDecimal calculerResteACharge(BigDecimal coutConsultation, BigDecimal montantRembourse) {
        if (coutConsultation == null || montantRembourse == null) {
            return BigDecimal.ZERO;
        }
        BigDecimal resteACharge = coutConsultation.subtract(montantRembourse);
        return resteACharge.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : resteACharge.setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Vérifie si le montant du remboursement est correct selon les règles
     *
     * @param montantRembourse Le montant du remboursement calculé
     * @param coutConsultation Le coût de la consultation
     * @param estGeneraliste true si consultation avec généraliste
     * @return true si le montant est correct
     */
    public boolean verifierMontantRemboursement(BigDecimal montantRembourse, BigDecimal coutConsultation, boolean estGeneraliste) {
        if (montantRembourse == null || coutConsultation == null) {
            return false;
        }
        BigDecimal montantAttendu = calculerMontantRemboursement(coutConsultation, estGeneraliste);
        return montantRembourse.subtract(montantAttendu).abs().compareTo(new BigDecimal("0.01")) < 0; // Tolérance de 1 centime
    }

    /**
     * Obtient le taux de remboursement selon le type de médecin
     *
     * @param estGeneraliste true pour généraliste, false pour spécialiste
     * @return Le taux de remboursement
     */
    public BigDecimal obtenirTauxRemboursement(boolean estGeneraliste) {
        return estGeneraliste ? TAUX_GENERALISTE : TAUX_SPECIALISTE;
    }

    /**
     * Obtient le taux de remboursement pour les généralistes
     *
     * @return Le taux de remboursement des généralistes
     */
    public BigDecimal getTauxGeneraliste() {
        return TAUX_GENERALISTE;
    }

    /**
     * Obtient le taux de remboursement pour les spécialistes
     *
     * @return Le taux de remboursement des spécialistes
     */
    public BigDecimal getTauxSpecialiste() {
        return TAUX_SPECIALISTE;
    }

    /**
     * Calcule le montant total des économies réalisées par l'organisme
     * grâce au taux réduit des spécialistes
     *
     * @param coutTotalSpecialistes Le coût total des consultations spécialistes
     * @return Les économies réalisées
     */
    public BigDecimal calculerEconomiesSpecialistes(BigDecimal coutTotalSpecialistes) {
        if (coutTotalSpecialistes == null || coutTotalSpecialistes.compareTo(BigDecimal.ZERO) < 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal remboursementTotal = coutTotalSpecialistes.multiply(TAUX_SPECIALISTE);
        return coutTotalSpecialistes.subtract(remboursementTotal).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Formate un montant en euros avec le symbole €
     *
     * @param montant Le montant à formater
     * @return Le montant formaté en string
     */
    public String formaterMontant(BigDecimal montant) {
        if (montant == null) {
            return "0.00 €";
        }
        return String.format("%.2f €", montant);
    }

    /**
     * Formate un pourcentage avec le symbole %
     *
     * @param pourcentage Le pourcentage à formater
     * @return Le pourcentage formaté en string
     */
    public String formaterPourcentage(BigDecimal pourcentage) {
        if (pourcentage == null) {
            return "0.00 %";
        }
        return String.format("%.2f %%", pourcentage);
    }
}