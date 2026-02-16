package com.spotify.spotify.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Track {

    private Long id;
    private String title;
    private String artist;
    private String album;
    private Integer duration; // seconds
}