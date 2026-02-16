package com.spotify.spotify.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TrackResponse {

    private Long id;
    private String title;
    private String artist;
    private String album;
    private Integer duration;
}