package org.example.services.song;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.io.IOException;
import java.io.InputStream;

import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@Service
public class SongImagesService {
    @Value("${music.images.dir}")
    private String uploadDir;

    String extension = "webp";

    Map<String, Integer> sizes = Map.of(
            "small", 32,
            "medium", 100,
            "large", 1000
    );

    public String load(MultipartFile file) {
        if (file.isEmpty()) return null;

        try (var inputStream = file.getInputStream()) {
            return saveStreamToFile(inputStream);
        } catch (IOException e) {
            System.out.println("Problem saving image:" + e);
            return "";
        }
    }

    public void remove(String fileName) {
        try {
            for (var folder : sizes.keySet()) {
                Path filePath = Paths.get(uploadDir, folder, fileName);
                Files.deleteIfExists(filePath);
            }
        } catch (Exception e) {
            System.out.println("Problem remove image " + e);
        }
    }

    public String replace(String oldFileName, MultipartFile newFile) {
        var newFileName = load(newFile);
        if (newFileName.isEmpty())
            return oldFileName;
        remove(oldFileName);
        return newFileName;
    }

    private String saveStreamToFile(InputStream stream) throws IOException {
        Files.createDirectories(Paths.get(uploadDir));
        String fileName = UUID.randomUUID().toString() + "." + extension;
        var bufferedImage = ImageIO.read(stream);
        for (var entry : sizes.entrySet()) {
            var folder = entry.getKey();
            var size = entry.getValue();
            Files.createDirectories(Paths.get(uploadDir, folder));
            String filePath = Paths.get(uploadDir, folder, fileName).toString();
            Thumbnails.of(bufferedImage)
                    .size(size, size)
                    .outputFormat(extension)
                    .toFile(filePath);
        }
        return fileName;
    }


}