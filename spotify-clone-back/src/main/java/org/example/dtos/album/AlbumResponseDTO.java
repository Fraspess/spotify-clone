package org.example.dtos.album;

import lombok.Getter;
import lombok.Setter;
import org.example.dtos.song.SongShortDTO;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
public class AlbumResponseDTO {
    private Long id;

    private String title;

    private LocalDate releaseDate;

    private String artist;

    private Set<SongShortDTO> songs;
}
