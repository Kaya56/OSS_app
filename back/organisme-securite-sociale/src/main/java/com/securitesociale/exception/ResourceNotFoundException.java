
// ResourceNotFoundException.java
package com.securitesociale.exception;

/**
 * Exception levée quand une ressource demandée n'est pas trouvée
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}