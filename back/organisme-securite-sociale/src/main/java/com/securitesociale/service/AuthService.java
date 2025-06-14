package com.securitesociale.service;

import com.securitesociale.controller.AuthController;
import com.securitesociale.entity.User;
import com.securitesociale.entity.Personne;
import com.securitesociale.entity.enums.Role;
import com.securitesociale.repository.UserRepository;
import com.securitesociale.repository.PersonneRepository;
import com.securitesociale.util.JwtUtil;
import com.securitesociale.exception.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PersonneRepository personneRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public String register(AuthController.RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new BusinessException("Nom d'utilisateur déjà utilisé");
        }

        // Créer une nouvelle personne
        Personne personne = createPersonne(registerRequest);
        personne = personneRepository.save(personne);

        // Créer l'utilisateur
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPersonne(personne);

        // Assigner les rôles en fonction du type de Personne
        Set<Role> roles = new HashSet<>();
        if (personne instanceof com.securitesociale.entity.Assure) {
            roles.add(Role.ROLE_ASSURE);
        } else if (personne instanceof com.securitesociale.entity.Medecin) {
            roles.add(Role.ROLE_MEDECIN);
        } else {
            roles.add(Role.ROLE_USER);
        }

        user.setRoles(roles);
        userRepository.save(user);

        return jwtUtil.generateToken(user.getUsername(), user.getRoles());
    }

    private Personne createPersonne(AuthController.RegisterRequest registerRequest) {
        String typePersonne = registerRequest.getTypePersonne();

        if ("ASSURE".equalsIgnoreCase(typePersonne)) {
            // Créer un Assuré
            com.securitesociale.entity.Assure assure = new com.securitesociale.entity.Assure();
            assure.setNom(registerRequest.getNom());
            assure.setPrenom(registerRequest.getPrenom());
            assure.setEmail(registerRequest.getEmail());
            assure.setTelephone(registerRequest.getTelephone());
            // Ajouter d'autres propriétés spécifiques à l'Assuré si nécessaire
            return assure;

        } else if ("MEDECIN".equalsIgnoreCase(typePersonne)) {
            // Créer un Médecin
            com.securitesociale.entity.Medecin medecin = new com.securitesociale.entity.Medecin();
            medecin.setNom(registerRequest.getNom());
            medecin.setPrenom(registerRequest.getPrenom());
            medecin.setEmail(registerRequest.getEmail());
            medecin.setTelephone(registerRequest.getTelephone());
            // Ajouter d'autres propriétés spécifiques au Médecin si nécessaire
            return medecin;

        } else {
            throw new BusinessException("Type de personne invalide: " + typePersonne);
        }
    }

    @Transactional(readOnly = true)
    public String login(String username, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Utilisateur non trouvé"));
        return jwtUtil.generateToken(user.getUsername(), user.getRoles());
    }
}