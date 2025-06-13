package com.securitesociale.entity.enums;

import lombok.Getter;

@Getter
public enum StatutRemboursement {
    EN_ATTENTE("En attente"),
    TRAITE("Traité"),
    REFUSE("Refusé");

    private final String description;

    StatutRemboursement(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return description;
    }
}