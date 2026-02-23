package org.example.dtos.user;

import lombok.Getter;
import lombok.Setter;
import org.example.dtos.album.AlbumResponseDTO;
import org.example.dtos.playlist.PlaylistResponseDTO;
import org.example.dtos.song.SongShortDTO;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class UserResponseDTO {
    private Long id;
    private String username;
    private String image;
    private String email;

    private Set<SongShortDTO> songs = new HashSet<>();
    private Set<SongShortDTO> favoriteSongs = new HashSet<>();
    private Set<PlaylistResponseDTO> playlists = new HashSet<>();
    private Set<AlbumResponseDTO> albums = new HashSet<>();
}
