// ValidationException.java
package com.securitesociale.exception;

/**
 * Exception levée lors d'erreurs de validation
 */
public class ValidationException extends RuntimeException {

    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}