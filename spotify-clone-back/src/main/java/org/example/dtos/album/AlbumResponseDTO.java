package org.example.dtos.album;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AlbumResponseDTO {
    private Long id;

    private String title;

    private LocalDate releaseDate;

    private String artist;
}
