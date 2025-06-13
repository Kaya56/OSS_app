package com.securitesociale.entity.enums;

import lombok.Getter;

@Getter
public enum MethodePaiement {
    VIREMENT("Virement bancaire"),
    CASH("Espèces");

    private final String description;

    MethodePaiement(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return description;
    }
}