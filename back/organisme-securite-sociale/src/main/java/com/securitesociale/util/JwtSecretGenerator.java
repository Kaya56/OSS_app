package com.securitesociale.util;

import java.security.SecureRandom;
import java.util.Base64;

public class JwtSecretGenerator {

    public static void main(String[] args) {
        // Generate a secure random key of 48 bytes (ensures >32 characters after Base64 encoding)
        byte[] randomBytes = new byte[48];
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(randomBytes);

        // Encode the bytes to Base64
        String jwtSecret = Base64.getEncoder().encodeToString(randomBytes);

        // Output the generated secret
        System.out.println("Generated JWT Secret: " + jwtSecret);
        System.out.println("Add this to your application.properties:");
        System.out.println("jwt.secret=" + jwtSecret);
    }
}