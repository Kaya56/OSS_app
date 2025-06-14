package com.securitesociale.controller;

import com.securitesociale.service.AuthService;
import jakarta.validation.Valid;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest registerRequest) {
        System.out.println(registerRequest);
        String token = authService.register(registerRequest);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        String token = authService.login(loginRequest.getUsername(), loginRequest.getPassword());
        return ResponseEntity.ok(token);
    }

    @Data
    public static class RegisterRequest {
        private String username;
        private String password;
        private String nom;
        private String prenom;
        private String email;
        private String telephone;
        private List<String> roles; // Exemple: ["ROLE_USER"]
    }

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }
}
