package com.spotify.spotify.service;

import com.spotify.spotify.model.Track;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrackService {

    public List<Track> getAllTracks() {
        return List.of(
                new Track(1L, "Blinding Lights", "The Weeknd", "After Hours", 200),
                new Track(2L, "Levitating", "Dua Lipa", "Future Nostalgia", 203)
        );
    }
}