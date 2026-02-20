package org.example.dtos.album;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.entities.song.SongEntity;
import org.example.entities.user.UserEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Data
public class AlbumCreateDTO {
    @NotNull
    private String title;
    @NotNull
    private Set<Long> songsIds;
    @NotNull
    private MultipartFile image;
}
