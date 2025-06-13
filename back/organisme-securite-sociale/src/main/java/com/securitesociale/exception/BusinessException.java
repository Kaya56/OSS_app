// BusinessException.java
package com.securitesociale.exception;

/**
 * Exception levée lors de violations des règles métier
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }

    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}