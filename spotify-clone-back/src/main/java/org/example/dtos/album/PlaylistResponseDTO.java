package org.example.dtos.album;

import lombok.Data;
import org.example.dtos.song.SongShortDTO;

import java.time.LocalDate;
import java.util.Set;

@Data
public class PlaylistResponseDTO {
    private Long id;

    private String title;

    private LocalDate dateCreated;

    private Set<SongShortDTO> songs;

    private String artist;
}
