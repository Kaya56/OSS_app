# Organisme Sécurité Sociale 
 
Application Spring Boot pour la gestion des interactions entre les assurés, médecins, consultations, prescriptions et remboursements pour un organisme de sécurité sociale. 
 
## Structure du projet 
- `src/main/java/com/securitesociale`: Code source principal 
- `src/main/resources`: Fichiers de configuration et données 
- `src/test/java/com/securitesociale`: Tests unitaires et d'intégration 
 
## Prérequis 
- Java 17 
- Maven 
- Spring Boot 3.3.4 
 
## Installation 
1. Clonez le projet. 
2. Exécutez `mvn spring-boot:run` pour lancer l'application. 
3. Accédez à la console H2 : `http://localhost:8080/h2-console`. 
 
## Fonctionnalités 
- Gestion des personnes (assurés et médecins). 
- Enregistrement des consultations et prescriptions. 
- Gestion des remboursements (100% généralistes, 80% spécialistes). 
