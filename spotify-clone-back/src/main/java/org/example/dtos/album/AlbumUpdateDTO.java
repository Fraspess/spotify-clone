package org.example.dtos.album;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Set;

@Data
public class AlbumUpdateDTO {
    @NotNull
    private Long albumId;
    private String title;
    private LocalDate releaseDate;
    private Set<Long> songId;
    private MultipartFile image;
}
