package org.example.dtos.album;

import jakarta.persistence.Column;
import lombok.Data;
import org.example.dtos.song.SongShortDTO;
import org.example.entities.song.SongEntity;
import org.example.entities.user.UserEntity;

import java.time.LocalDate;
import java.util.Set;

@Data
public class AlbumResponseDTO {
    private Long id;

    private String title;

    private LocalDate dateCreated;

    private Set<SongShortDTO> songs;

    private String artist;
}
