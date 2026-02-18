package org.example.dtos.song;


import lombok.Data;

import java.time.LocalDate;

@Data
public class SongResponseDTO {
    private Long id;

    private String title;

    private String artist;

    private LocalDate release_date;

    private Long durationInSeconds;

    private String image;

    private String songFileName;
}
