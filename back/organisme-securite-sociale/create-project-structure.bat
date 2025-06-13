@echo off
setlocal enabledelayedexpansion

echo Création de la structure du projet organisme-securite-sociale...

:: Définir le chemin de base
set BASE_DIR=src\main\java\com\securitesociale
set RESOURCES_DIR=src\main\resources
set TEST_DIR=src\test\java\com\securitesociale

:: Créer les dossiers dans src/main/java/com/securitesociale
mkdir %BASE_DIR%\entity
mkdir %BASE_DIR%\repository
mkdir %BASE_DIR%\service
mkdir %BASE_DIR%\controller
mkdir %BASE_DIR%\dto
mkdir %BASE_DIR%\config
mkdir %BASE_DIR%\exception
mkdir %BASE_DIR%\util
mkdir %RESOURCES_DIR%\templates
mkdir %TEST_DIR%\service
mkdir %TEST_DIR%\repository
mkdir %TEST_DIR%\controller

:: Créer les fichiers dans entity
echo package com.securitesociale.entity; > %BASE_DIR%\entity\Personne.java
echo. >> %BASE_DIR%\entity\Personne.java
echo public class Personne { >> %BASE_DIR%\entity\Personne.java
echo     // TODO: Implémenter les attributs et annotations JPA >> %BASE_DIR%\entity\Personne.java
echo } >> %BASE_DIR%\entity\Personne.java

echo package com.securitesociale.entity; > %BASE_DIR%\entity\Assure.java
echo. >> %BASE_DIR%\entity\Assure.java
echo public class Assure extends Personne { >> %BASE_DIR%\entity\Assure.java
echo     // TODO: Implémenter les attributs spécifiques et annotations JPA >> %BASE_DIR%\entity\Assure.java
echo } >> %BASE_DIR%\entity\Assure.java

echo package com.securitesociale.entity; > %BASE_DIR%\entity\Medecin.java
echo. >> %BASE_DIR%\entity\Medecin.java
echo public class Medecin extends Personne { >> %BASE_DIR%\entity\Medecin.java
echo     // TODO: Implémenter les attributs spécifiques et annotations JPA >> %BASE_DIR%\entity\Medecin.java
echo } >> %BASE_DIR%\entity\Medecin.java

echo package com.securitesociale.entity; > %BASE_DIR%\entity\Consultation.java
echo. >> %BASE_DIR%\entity\Consultation.java
echo public class Consultation { >> %BASE_DIR%\entity\Consultation.java
echo     // TODO: Implémenter les attributs et annotations JPA >> %BASE_DIR%\entity\Consultation.java
echo } >> %BASE_DIR%\entity\Consultation.java

echo package com.securitesociale.entity; > %BASE_DIR%\entity\Prescription.java
echo. >> %BASE_DIR%\entity\Prescription.java
echo public class Prescription { >> %BASE_DIR%\entity\Prescription.java
echo     // TODO: Implémenter les attributs et annotations JPA >> %BASE_DIR%\entity\Prescription.java
echo } >> %BASE_DIR%\entity\Prescription.java

echo package com.securitesociale.entity; > %BASE_DIR%\entity\Remboursement.java
echo. >> %BASE_DIR%\entity\Remboursement.java
echo public class Remboursement { >> %BASE_DIR%\entity\Remboursement.java
echo     // TODO: Implémenter les attributs et annotations JPA >> %BASE_DIR%\entity\Remboursement.java
echo } >> %BASE_DIR%\entity\Remboursement.java

echo package com.securitesociale.entity; > %BASE_DIR%\entity\MethodePaiement.java
echo. >> %BASE_DIR%\entity\MethodePaiement.java
echo public enum MethodePaiement { >> %BASE_DIR%\entity\MethodePaiement.java
echo     VIREMENT, CASH >> %BASE_DIR%\entity\MethodePaiement.java
echo } >> %BASE_DIR%\entity\MethodePaiement.java

echo package com.securitesociale.entity; > %BASE_DIR%\entity\TypePrescription.java
echo. >> %BASE_DIR%\entity\TypePrescription.java
echo public enum TypePrescription { >> %BASE_DIR%\entity\TypePrescription.java
echo     MEDICAMENT, CONSULTATION_SPECIALISTE >> %BASE_DIR%\entity\TypePrescription.java
echo } >> %BASE_DIR%\entity\TypePrescription.java

echo package com.securitesociale.entity; > %BASE_DIR%\entity\StatutRemboursement.java
echo. >> %BASE_DIR%\entity\StatutRemboursement.java
echo public enum StatutRemboursement { >> %BASE_DIR%\entity\StatutRemboursement.java
echo     EN_ATTENTE, TRAITE, REFUSE >> %BASE_DIR%\entity\StatutRemboursement.java
echo } >> %BASE_DIR%\entity\StatutRemboursement.java

:: Créer les fichiers dans repository
echo package com.securitesociale.repository; > %BASE_DIR%\repository\PersonneRepository.java
echo. >> %BASE_DIR%\repository\PersonneRepository.java
echo import com.securitesociale.entity.Personne; >> %BASE_DIR%\repository\PersonneRepository.java
echo import org.springframework.data.jpa.repository.JpaRepository; >> %BASE_DIR%\repository\PersonneRepository.java
echo. >> %BASE_DIR%\repository\PersonneRepository.java
echo public interface PersonneRepository extends JpaRepository<Personne, Long> { >> %BASE_DIR%\repository\PersonneRepository.java
echo     // TODO: Ajouter des méthodes de recherche spécifiques si nécessaire >> %BASE_DIR%\repository\PersonneRepository.java
echo } >> %BASE_DIR%\repository\PersonneRepository.java

echo package com.securitesociale.repository; > %BASE_DIR%\repository\AssureRepository.java
echo. >> %BASE_DIR%\repository\AssureRepository.java
echo import com.securitesociale.entity.Assure; >> %BASE_DIR%\repository\AssureRepository.java
echo import org.springframework.data.jpa.repository.JpaRepository; >> %BASE_DIR%\repository\AssureRepository.java
echo. >> %BASE_DIR%\repository\AssureRepository.java
echo public interface AssureRepository extends JpaRepository<Assure, Long> { >> %BASE_DIR%\repository\AssureRepository.java
echo     // TODO: Ajouter des méthodes de recherche spécifiques si nécessaire >> %BASE_DIR%\repository\AssureRepository.java
echo } >> %BASE_DIR%\repository\AssureRepository.java

echo package com.securitesociale.repository; > %BASE_DIR%\repository\MedecinRepository.java
echo. >> %BASE_DIR%\repository\MedecinRepository.java
echo import com.securitesociale.entity.Medecin; >> %BASE_DIR%\repository\MedecinRepository.java
echo import org.springframework.data.jpa.repository.JpaRepository; >> %BASE_DIR%\repository\MedecinRepository.java
echo. >> %BASE_DIR%\repository\MedecinRepository.java
echo public interface MedecinRepository extends JpaRepository<Medecin, Long> { >> %BASE_DIR%\repository\MedecinRepository.java
echo     // TODO: Ajouter des méthodes de recherche spécifiques si nécessaire >> %BASE_DIR%\repository\MedecinRepository.java
echo } >> %BASE_DIR%\repository\MedecinRepository.java

echo package com.securitesociale.repository; > %BASE_DIR%\repository\ConsultationRepository.java
echo. >> %BASE_DIR%\repository\ConsultationRepository.java
echo import com.securitesociale.entity.Consultation; >> %BASE_DIR%\repository\ConsultationRepository.java
echo import org.springframework.data.jpa.repository.JpaRepository; >> %BASE_DIR%\repository\ConsultationRepository.java
echo. >> %BASE_DIR%\repository\ConsultationRepository.java
echo public interface ConsultationRepository extends JpaRepository<Consultation, Long> { >> %BASE_DIR%\repository\ConsultationRepository.java
echo     // TODO: Ajouter des méthodes de recherche spécifiques si nécessaire >> %BASE_DIR%\repository\ConsultationRepository.java
echo } >> %BASE_DIR%\repository\ConsultationRepository.java

echo package com.securitesociale.repository; > %BASE_DIR%\repository\PrescriptionRepository.java
echo. >> %BASE_DIR%\repository\PrescriptionRepository.java
echo import com.securitesociale.entity.Prescription; >> %BASE_DIR%\repository\PrescriptionRepository.java
echo import org.springframework.data.jpa.repository.JpaRepository; >> %BASE_DIR%\repository\PrescriptionRepository.java
echo. >> %BASE_DIR%\repository\PrescriptionRepository.java
echo public interface PrescriptionRepository extends JpaRepository<Prescription, Long> { >> %BASE_DIR%\repository\PrescriptionRepository.java
echo     // TODO: Ajouter des méthodes de recherche spécifiques si nécessaire >> %BASE_DIR%\repository\PrescriptionRepository.java
echo } >> %BASE_DIR%\repository\PrescriptionRepository.java

echo package com.securitesociale.repository; > %BASE_DIR%\repository\RemboursementRepository.java
echo. >> %BASE_DIR%\repository\RemboursementRepository.java
echo import com.securitesociale.entity.Remboursement; >> %BASE_DIR%\repository\RemboursementRepository.java
echo import org.springframework.data.jpa.repository.JpaRepository; >> %BASE_DIR%\repository\RemboursementRepository.java
echo. >> %BASE_DIR%\repository\RemboursementRepository.java
echo public interface RemboursementRepository extends JpaRepository<Remboursement, Long> { >> %BASE_DIR%\repository\RemboursementRepository.java
echo     // TODO: Ajouter des méthodes de recherche spécifiques si nécessaire >> %BASE_DIR%\repository\RemboursementRepository.java
echo } >> %BASE_DIR%\repository\RemboursementRepository.java

:: Créer les fichiers dans service
echo package com.securitesociale.service; > %BASE_DIR%\service\PersonneService.java
echo. >> %BASE_DIR%\service\PersonneService.java
echo public class PersonneService { >> %BASE_DIR%\service\PersonneService.java
echo     // TODO: Implémenter les méthodes de gestion des personnes >> %BASE_DIR%\service\PersonneService.java
echo } >> %BASE_DIR%\service\PersonneService.java

echo package com.securitesociale.service; > %BASE_DIR%\service\AssureService.java
echo. >> %BASE_DIR%\service\AssureService.java
echo public class AssureService { >> %BASE_DIR%\service\AssureService.java
echo     // TODO: Implémenter les méthodes de gestion des assurés >> %BASE_DIR%\service\AssureService.java
echo } >> %BASE_DIR%\service\AssureService.java

echo package com.securitesociale.service; > %BASE_DIR%\service\MedecinService.java
echo. >> %BASE_DIR%\service\MedecinService.java
echo public class MedecinService { >> %BASE_DIR%\service\MedecinService.java
echo     // TODO: Implémenter les méthodes de gestion des médecins >> %BASE_DIR%\service\MedecinService.java
echo } >> %BASE_DIR%\service\MedecinService.java

echo package com.securitesociale.service; > %BASE_DIR%\service\ConsultationService.java
echo. >> %BASE_DIR%\service\ConsultationService.java
echo public class ConsultationService { >> %BASE_DIR%\service\ConsultationService.java
echo     // TODO: Implémenter les méthodes de gestion des consultations >> %BASE_DIR%\service\ConsultationService.java
echo } >> %BASE_DIR%\service\ConsultationService.java

echo package com.securitesociale.service; > %BASE_DIR%\service\RemboursementService.java
echo. >> %BASE_DIR%\service\RemboursementService.java
echo public class RemboursementService { >> %BASE_DIR%\service\RemboursementService.java
echo     // TODO: Implémenter les méthodes de gestion des remboursements >> %BASE_DIR%\service\RemboursementService.java
echo } >> %BASE_DIR%\service\RemboursementService.java

:: Créer les fichiers dans controller
echo package com.securitesociale.controller; > %BASE_DIR%\controller\PersonneController.java
echo. >> %BASE_DIR%\controller\PersonneController.java
echo import org.springframework.web.bind.annotation.RestController; >> %BASE_DIR%\controller\PersonneController.java
echo. >> %BASE_DIR%\controller\PersonneController.java
echo @RestController >> %BASE_DIR%\controller\PersonneController.java
echo public class PersonneController { >> %BASE_DIR%\controller\PersonneController.java
echo     // TODO: Implémenter les endpoints REST pour les personnes >> %BASE_DIR%\controller\PersonneController.java
echo } >> %BASE_DIR%\controller\PersonneController.java

echo package com.securitesociale.controller; > %BASE_DIR%\controller\AssureController.java
echo. >> %BASE_DIR%\controller\AssureController.java
echo import org.springframework.web.bind.annotation.RestController; >> %BASE_DIR%\controll
er\AssureController.java
echo. >> %BASE_DIR%\controller\AssureController.java
echo @RestController >> %BASE_DIR%\controller\AssureController.java
echo public class AssureController { >> %BASE_DIR%\controller\AssureController.java
echo     // TODO: Implémenter les endpoints REST pour les assurés >> %BASE_DIR%\controller\AssureController.java
echo } >> %BASE_DIR%\controller\AssureController.java

echo package com.securitesociale.controller; > %BASE_DIR%\controller\MedecinController.java Aluminium
echo. >> %BASE_DIR%\controller\MedecinController.java
echo import org.springframework.web.bind.annotation.RestController; >> %BASE_DIR%\controller\MedecinController.java
echo. >> %BASE_DIR%\controller\MedecinController.java
echo @RestController >> %BASE_DIR%\controller\MedecinController.java
echo public class MedecinController { >> %BASE_DIR%\controller\MedecinController.java
echo     // TODO: Implémenter les endpoints REST pour les médecins >> %BASE_DIR%\controller\MedecinController.java
echo } >> %BASE_DIR%\controller\MedecinController.java

echo package com.securitesociale.controller; > %BASE_DIR%\controller\ConsultationController.java
echo. >> %BASE_DIR%\controller\ConsultationController.java
echo import org.springframework.web.bind.annotation.RestController; >> %BASE_DIR%\controller\ConsultationController.java
echo. >> %BASE_DIR%\controller\ConsultationController.java
echo @RestController >> %BASE_DIR%\controller\ConsultationController.java
echo public class ConsultationController { >> %BASE_DIR%\controller\ConsultationController.java
echo     // TODO: Implémenter les endpoints REST pour les consultations >> %BASE_DIR%\controller\ConsultationController.java
echo } >> %BASE_DIR%\controller\ConsultationController.java

echo package com.securitesociale.controller; > %BASE_DIR%\controller\RemboursementController.java
echo. >> %BASE_DIR%\controller\RemboursementController.java
echo import org.springframework.web.bind.annotation.RestController; >> %BASE_DIR%\controller\RemboursementController.java
echo. >> %BASE_DIR%\controller\RemboursementController.java
echo @RestController >> %BASE_DIR%\controller\RemboursementController.java
echo public class RemboursementController { >> %BASE_DIR%\controller\RemboursementController.java
echo     // TODO: Implémenter les endpoints REST pour les remboursements >> %BASE_DIR%\controller\RemboursementController.java
echo } >> %BASE_DIR%\controller\RemboursementController.java

:: Créer les fichiers dans dto
echo package com.securitesociale.dto; > %BASE_DIR%\dto\PersonneDTO.java
echo. >> %BASE_DIR%\dto\PersonneDTO.java
echo public class PersonneDTO { >> %BASE_DIR%\dto\PersonneDTO.java
echo     // TODO: Implémenter les attributs pour le transfert de données >> %BASE_DIR%\dto\PersonneDTO.java
echo } >> %BASE_DIR%\dto\PersonneDTO.java

echo package com.securitesociale.dto; > %BASE_DIR%\dto\AssureDTO.java
echo. >> %BASE_DIR%\dto\AssureDTO.java
echo public class AssureDTO { >> %BASE_DIR%\dto\AssureDTO.java
echo     // TODO: Implémenter les attributs pour le transfert de données >> %BASE_DIR%\dto\AssureDTO.java
echo } >> %BASE_DIR%\dto\AssureDTO.java

echo package com.securitesociale.dto; > %BASE_DIR%\dto\MedecinDTO.java
echo. >> %BASE_DIR%\dto\MedecinDTO.java
echo public class MedecinDTO { >> %BASE_DIR%\dto\MedecinDTO.java
echo     // TODO: Implémenter les attributs pour le transfert de données >> %BASE_DIR%\dto\MedecinDTO.java
echo } >> %BASE_DIR%\dto\MedecinDTO.java

echo package com.securitesociale.dto; > %BASE_DIR%\dto\ConsultationDTO.java
echo. >> %BASE_DIR%\dto\ConsultationDTO.java
echo public class ConsultationDTO { >> %BASE_DIR%\dto\ConsultationDTO.java
echo     // TODO: Implémenter les attributs pour le transfert de données >> %BASE_DIR%\dto\ConsultationDTO.java
echo } >> %BASE_DIR%\dto\ConsultationDTO.java

echo package com.securitesociale.dto; > %BASE_DIR%\dto\PrescriptionDTO.java
echo. >> %BASE_DIR%\dto\PrescriptionDTO.java
echo public class PrescriptionDTO { >> %BASE_DIR%\dto\PrescriptionDTO.java
echo     // TODO: Implémenter les attributs pour le transfert de données >> %BASE_DIR%\dto\PrescriptionDTO.java
echo } >> %BASE_DIR%\dto\PrescriptionDTO.java

echo package com.securitesociale.dto; > %BASE_DIR%\dto\RemboursementDTO.java
echo. >> %BASE_DIR%\dto\RemboursementDTO.java
echo public class RemboursementDTO { >> %BASE_DIR%\dto\RemboursementDTO.java
echo     // TODO: Implémenter les attributs pour le transfert de données >> %BASE_DIR%\dto\RemboursementDTO.java
echo } >> %BASE_DIR%\dto\RemboursementDTO.java

:: Créer les fichiers dans config
echo package com.securitesociale.config; > %BASE_DIR%\config\SecurityConfig.java
echo. >> %BASE_DIR%\config\SecurityConfig.java
echo import org.springframework.context.annotation.Configuration; >> %BASE_DIR%\config\SecurityConfig.java
echo import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity; >> %BASE_DIR%\config\SecurityConfig.java
echo. >> %BASE_DIR%\config\SecurityConfig.java
echo @Configuration >> %BASE_DIR%\config\SecurityConfig.java
echo @EnableWebSecurity >> %BASE_DIR%\config\SecurityConfig.java
echo public class SecurityConfig { >> %BASE_DIR%\config\SecurityConfig.java
echo     // TODO: Implémenter la configuration de Spring Security >> %BASE_DIR%\config\SecurityConfig.java
echo } >> %BASE_DIR%\config\SecurityConfig.java

echo package com.securitesociale.config; > %BASE_DIR%\config\DatabaseConfig.java
echo. >> %BASE_DIR%\config\DatabaseConfig.java
echo import org.springframework.context.annotation.Configuration; >> %BASE_DIR%\config\DatabaseConfig.java
echo. >> %BASE_DIR%\config\DatabaseConfig.java
echo @Configuration >> %BASE_DIR%\config\DatabaseConfig.java
echo public class DatabaseConfig { >> %BASE_DIR%\config\DatabaseConfig.java
echo     // TODO: Implémenter la configuration de la base de données >> %BASE_DIR%\config\DatabaseConfig.java
echo } >> %BASE_DIR%\config\DatabaseConfig.java

:: Créer les fichiers dans exception
echo package com.securitesociale.exception; > %BASE_DIR%\exception\GlobalExceptionHandler.java
echo. >> %BASE_DIR%\exception\GlobalExceptionHandler.java
echo import org.springframework.web.bind.annotation.RestControllerAdvice; >> %BASE_DIR%\exception\GlobalExceptionHandler.java
echo. >> %BASE_DIR%\exception\GlobalExceptionHandler.java
echo @RestControllerAdvice >> %BASE_DIR%\exception\GlobalExceptionHandler.java
echo public class GlobalExceptionHandler { >> %BASE_DIR%\exception\GlobalExceptionHandler.java
echo     // TODO: Implémenter la gestion globale des exceptions >> %BASE_DIR%\exception\GlobalExceptionHandler.java
echo } >> %BASE_DIR%\exception\GlobalExceptionHandler.java

echo package com.securitesociale.exception; > %BASE_DIR%\exception\ResourceNotFoundException.java
echo. >> %BASE_DIR%\exception\ResourceNotFoundException.java
echo public class ResourceNotFoundException extends RuntimeException { >> %BASE_DIR%\exception\ResourceNotFoundException.java
echo     public ResourceNotFoundException(String message) { >> %BASE_DIR%\exception\ResourceNotFoundException.java
echo         super(message); >> %BASE_DIR%\exception\ResourceNotFoundException.java
echo     } >> %BASE_DIR%\exception\ResourceNotFoundException.java
echo } >> %BASE_DIR%\exception\ResourceNotFoundException.java

echo package com.securitesociale.exception; > %BASE_DIR%\exception\BusinessException.java
echo. >> %BASE_DIR%\exception\BusinessException.java
echo public class BusinessException extends RuntimeException { >> %BASE_DIR%\exception\BusinessException.java
echo     public BusinessException(String message) { >> %BASE_DIR%\exception\BusinessException.java
echo         super(message); >> %BASE_DIR%\exception\BusinessException.java
echo     } >> %BASE_DIR%\exception\BusinessException.java
echo } >> %BASE_DIR%\exception\BusinessException.java

echo package com.securitesociale.exception; > %BASE_DIR%\exception\ValidationException.java
echo. >> %BASE_DIR%\exception\ValidationException.java
echo public class ValidationException extends RuntimeException { >> %BASE_DIR%\exception\ValidationException.java
echo     public ValidationException(String message) { >> %BASE_DIR%\exception\ValidationException.java
echo         super(message); >> %BASE_DIR%\exception\ValidationException.java
echo     } >> %BASE_DIR%\exception\ValidationException.java
echo } >> %BASE_DIR%\exception\ValidationException.java

:: Créer les fichiers dans util
echo package com.securitesociale.util; > %BASE_DIR%\util\RemboursementCalculator.java
echo. >> %BASE_DIR%\util\RemboursementCalculator.java
echo public class RemboursementCalculator { >> %BASE_DIR%\util\RemboursementCalculator.java
echo     // TODO: Implémenter la logique de calcul des remboursements >> %BASE_DIR%\util\RemboursementCalculator.java
echo } >> %BASE_DIR%\util\RemboursementCalculator.java

echo package com.securitesociale.util; > %BASE_DIR%\util\ValidationUtils.java
echo. >> %BASE_DIR%\util\ValidationUtils.java
echo public class ValidationUtils { >> %BASE_DIR%\util\ValidationUtils.java
echo     // TODO: Implémenter les méthodes de validation métier >> %BASE_DIR%\util\ValidationUtils.java
echo } >> %BASE_DIR%\util\ValidationUtils.java

:: Créer les fichiers dans resources
echo # Configuration principale de l'application > %RESOURCES_DIR%\application.yml
echo spring: >> %RESOURCES_DIR%\application.yml
echo   datasource: >> %RESOURCES_DIR%\application.yml
echo     url: jdbc:h2:mem:securitesociale >> %RESOURCES_DIR%\application.yml
echo     driverClassName: org.h2.Driver >> %RESOURCES_DIR%\application.yml
echo     username: sa >> %RESOURCES_DIR%\application.yml
echo     password: >> %RESOURCES_DIR%\application.yml
echo   jpa: >> %RESOURCES_DIR%\application.yml
echo     database-platform: org.hibernate.dialect.H2Dialect >> %RESOURCES_DIR%\application.yml
echo     hibernate: >> %RESOURCES_DIR%\application.yml
echo       ddl-auto: update >> %RESOURCES_DIR%\application.yml
echo   h2: >> %RESOURCES_DIR%\application.yml
echo     console: >> %RESOURCES_DIR%\application.yml
echo       enabled: true >> %RESOURCES_DIR%\application.yml
echo server: >> %RESOURCES_DIR%\application.yml
echo   port: 8080 >> %RESOURCES_DIR%\application.yml

echo -- Données d'initialisation pour la base de données H2 > %RESOURCES_DIR%\data.sql
echo -- TODO: Ajouter des INSERT pour initialiser les données de test >> %RESOURCES_DIR%\data.sql

:: Créer le fichier README.md
echo # Organisme Sécurité Sociale > README.md
echo. >> README.md
echo Application Spring Boot pour la gestion des interactions entre les assurés, médecins, consultations, prescriptions et remboursements pour un organisme de sécurité sociale. >> README.md
echo. >> README.md
echo ## Structure du projet >> README.md
echo - `src/main/java/com/securitesociale`: Code source principal >> README.md
echo - `src/main/resources`: Fichiers de configuration et données >> README.md
echo - `src/test/java/com/securitesociale`: Tests unitaires et d'intégration >> README.md
echo. >> README.md
echo ## Prérequis >> README.md
echo - Java 17 >> README.md
echo - Maven >> README.md
echo - Spring Boot 3.3.4 >> README.md
echo. >> README.md
echo ## Installation >> README.md
echo 1. Clonez le projet. >> README.md
echo 2. Exécutez `mvn spring-boot:run` pour lancer l'application. >> README.md
echo 3. Accédez à la console H2 : `http://localhost:8080/h2-console`. >> README.md
echo. >> README.md
echo ## Fonctionnalités >> README.md
echo - Gestion des personnes (assurés et médecins). >> README.md
echo - Enregistrement des consultations et prescriptions. >> README.md
echo - Gestion des remboursements (100%% généralistes, 80%% spécialistes). >> README.md

:: Créer des fichiers de test placeholders
echo package com.securitesociale.service; > %TEST_DIR%\service\PersonneServiceTest.java
echo. >> %TEST_DIR%\service\PersonneServiceTest.java
echo import org.junit.jupiter.api.Test; >> %TEST_DIR%\service\PersonneServiceTest.java
echo. >> %TEST_DIR%\service\PersonneServiceTest.java
echo public class PersonneServiceTest { >> %TEST_DIR%\service\PersonneServiceTest.java
echo     // TODO: Implémenter les tests unitaires pour PersonneService >> %TEST_DIR%\service\PersonneServiceTest.java
echo } >> %TEST_DIR%\service\PersonneServiceTest.java

echo package com.securitesociale.repository; > %TEST_DIR%\repository\PersonneRepositoryTest.java
echo. >> %TEST_DIR%\repository\PersonneRepositoryTest.java
echo import org.junit.jupiter.api.Test; >> %TEST_DIR%\repository\PersonneRepositoryTest.java
echo. >> %TEST_DIR%\repository\PersonneRepositoryTest.java
echo public class PersonneRepositoryTest { >> %TEST_DIR%\repository\PersonneRepositoryTest.java
echo     // TODO: Implémenter les tests pour PersonneRepository >> %TEST_DIR%\repository\PersonneRepositoryTest.java
echo } >> %TEST_DIR%\repository\PersonneRepositoryTest.java

echo package com.securitesociale.controller; > %TEST_DIR%\controller\PersonneControllerTest.java
echo. >> %TEST_DIR%\controller\PersonneControllerTest.java
echo import org.junit.jupiter.api.Test; >> %TEST_DIR%\controller\PersonneControllerTest.java
echo. >> %TEST_DIR%\controller\PersonneControllerTest.java
echo public class PersonneControllerTest { >> %TEST_DIR%\controller\PersonneControllerTest.java
echo     // TODO: Implémenter les tests pour PersonneController >> %TEST_DIR%\controller\PersonneControllerTest.java
echo } >> %TEST_DIR%\controller\PersonneControllerTest.java

echo Structure du projet créée avec succès !
pause