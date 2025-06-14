package com.securitesociale.service;

import com.securitesociale.controller.AuthController;
import com.securitesociale.entity.*;
import com.securitesociale.entity.enums.Role;
import com.securitesociale.exception.BusinessException;
import com.securitesociale.repository.PersonneRepository;
import com.securitesociale.repository.UserRepository;
import com.securitesociale.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
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

        // Créer la personne (Assure ou Medecin ou Personne simple)
        Personne personne = createPersonne(registerRequest);
        personne = personneRepository.save(personne);

        // Créer l'utilisateur
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPersonne(personne);

        // Mapper les rôles reçus en Set<Role>
        Set<Role> roles = mapRoles(registerRequest.getRoles());
        user.setRoles(roles);

        userRepository.save(user);

        return jwtUtil.generateToken(user.getUsername(), user.getRoles());
    }

    private Personne createPersonne(AuthController.RegisterRequest registerRequest) {
        List<String> roles = registerRequest.getRoles();

        if (roles.contains("ROLE_ASSURE")) {
            Assure assure = new Assure();
            assure.setNom(registerRequest.getNom());
            assure.setPrenom(registerRequest.getPrenom());
            assure.setEmail(registerRequest.getEmail());
            assure.setTelephone(registerRequest.getTelephone());
            return assure;

        } else if (roles.contains("ROLE_MEDECIN")) {
            Medecin medecin = new Medecin();
            medecin.setNom(registerRequest.getNom());
            medecin.setPrenom(registerRequest.getPrenom());
            medecin.setEmail(registerRequest.getEmail());
            medecin.setTelephone(registerRequest.getTelephone());
            return medecin;
        }

        // Personne générique (pas médecin ni assuré)
        Personne personne = new Personne();
        personne.setNom(registerRequest.getNom());
        personne.setPrenom(registerRequest.getPrenom());
        personne.setEmail(registerRequest.getEmail());
        personne.setTelephone(registerRequest.getTelephone());
        return personne;
    }

    private Set<Role> mapRoles(List<String> roleStrings) {
        Set<Role> roles = new HashSet<>();
        for (String roleStr : roleStrings) {
            try {
                roles.add(Role.valueOf(roleStr));
            } catch (IllegalArgumentException e) {
                throw new BusinessException("Rôle invalide: " + roleStr);
            }
        }
        return roles;
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
