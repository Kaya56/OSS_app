package com.securitesociale.service;

import com.securitesociale.entity.Media;
import com.securitesociale.repository.MediaRepository;
import com.securitesociale.exception.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.UUID;

@Service
@Transactional
public class MediaService {

    @Autowired
    private MediaRepository mediaRepository;

    private final Path baseUploadDir = Paths.get("uploads/media");

    public MediaService() {
        try {
            Files.createDirectories(baseUploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Impossible de créer le dossier d'upload", e);
        }
    }

    public Media uploadMedia(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessException("Le fichier est vide");
        }

        try {
            // Créer une arborescence : /uploads/media/{annee}/{mois}/{uuid}-{nomFichier}
            LocalDate now = LocalDate.now();
            String year = String.valueOf(now.getYear());
            String month = String.format("%02d", now.getMonthValue());
            Path uploadDir = baseUploadDir.resolve(year).resolve(month);
            Files.createDirectories(uploadDir);

            // Générer un nom de fichier unique
            String originalFileName = file.getOriginalFilename();
            String fileName = UUID.randomUUID() + "_" + originalFileName;
            Path filePath = uploadDir.resolve(fileName);
            Files.write(filePath, file.getBytes());

            // Créer l'entité Media
            Media media = Media.builder()
                    .fileName(originalFileName)
                    .mimeType(file.getContentType())
                    .fileSize(file.getSize())
                    .filePath("/uploads/media/" + year + "/" + month + "/" + fileName)
                    .build();

            return mediaRepository.save(media);
        } catch (IOException e) {
            throw new BusinessException("Erreur lors du téléchargement du fichier", e);
        }
    }

    public Media getMediaById(Long id) {
        return mediaRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Media non trouvé avec l'ID: " + id));
    }

    public void deleteMedia(Long id) {
        Media media = getMediaById(id);
        try {
            Files.deleteIfExists(Paths.get(media.getFilePath()));
        } catch (IOException e) {
            throw new BusinessException("Erreur lors de la suppression du fichier", e);
        }
        mediaRepository.delete(media);
    }
}