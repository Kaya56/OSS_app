package com.securitesociale.service;

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
    public String register(Long personneId, User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new BusinessException("Nom d'utilisateur déjà utilisé");
        }

        Personne personne = personneRepository.findById(personneId)
                .orElseThrow(() -> new BusinessException("Personne non trouvée avec l'ID: " + personneId));

        if (userRepository.existsByPersonne(personne)) {
            throw new BusinessException("Cette personne a déjà un compte utilisateur");
        }

        // Valider les rôles fournis
        Set<Role> validRoles = new HashSet<>();
        if (user.getRoles() != null) {
            for (Role role : user.getRoles()) {
                if (role == Role.ROLE_ADMIN && personne instanceof com.securitesociale.entity.Assure) {
                    throw new BusinessException("Un assuré ne peut pas être administrateur");
                }
                validRoles.add(role);
            }
        }

        // Assigner les rôles en fonction du type de Personne
        if (personne instanceof com.securitesociale.entity.Assure) {
            validRoles.add(Role.ROLE_ASSURE);
        } else if (personne instanceof com.securitesociale.entity.Medecin) {
            validRoles.add(Role.ROLE_MEDECIN);
        } else {
            validRoles.add(Role.ROLE_USER);
        }

        user.setRoles(validRoles);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setPersonne(personne);

        userRepository.save(user);
        return jwtUtil.generateToken(user.getUsername(), user.getRoles());
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