-- Create tables
CREATE TABLE personnes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL,
    genre ENUM('MASCULIN', 'FEMININ') NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    telephone VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    photo_id BIGINT,
    date_creation DATETIME NOT NULL,
    CONSTRAINT chk_telephone CHECK (telephone REGEXP '^\+?[1-9][0-9]{1,14}$')
);

CREATE TABLE medias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    date_creation DATETIME NOT NULL
);

ALTER TABLE personnes
ADD CONSTRAINT fk_personnes_photo FOREIGN KEY (photo_id) REFERENCES medias(id);

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    personne_id BIGINT,
    CONSTRAINT fk_users_personne FOREIGN KEY (personne_id) REFERENCES personnes(id) ON DELETE CASCADE
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role ENUM('ROLE_ADMIN', 'ROLE_USER', 'ROLE_ASSURE', 'ROLE_MEDECIN') NOT NULL,
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin user
INSERT INTO personnes (nom, prenom, date_naissance, genre, adresse, telephone, email, date_creation)
VALUES ('Admin', 'System', '2000-01-01', 'MASCULIN', 'N/A', '+1234567890', 'admin@example.com', NOW());

INSERT INTO users (username, password, personne_id)
VALUES ('admin', '$2a$10$XURPShQNCsLjp1ESc2laoObo9QZDhaWViy/29rQJ.9Y8rxZ0Os2T6', LAST_INSERT_ID());

INSERT INTO user_roles (user_id, role)
VALUES (LAST_INSERT_ID(), 'ROLE_ADMIN');