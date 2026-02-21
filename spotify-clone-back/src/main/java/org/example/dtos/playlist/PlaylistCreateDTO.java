package org.example.dtos.playlist;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Data
public class PlaylistCreateDTO {
    @NotNull
    private String title;
    @NotNull
    private Set<Long> songsIds;
    @NotNull
    private MultipartFile image;
}
