package com.spotify.spotify.controller;

import com.spotify.spotify.model.Track;
import com.spotify.spotify.service.TrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tracks")
@RequiredArgsConstructor
public class TrackController {

    private final TrackService trackService;

    @GetMapping
    public List<Track> getAllTracks() {
        return trackService.getAllTracks();
    }
}