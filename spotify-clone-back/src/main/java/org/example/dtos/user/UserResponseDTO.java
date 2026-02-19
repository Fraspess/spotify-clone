package org.example.dtos.user;

import lombok.Data;
import org.example.dtos.song.SongShortDTO;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
public class UserResponseDTO {
    private Long id;
    private String username;
    private String image;

    private List<SongShortDTO> songs;
    private Set<SongShortDTO> favoriteSongs = new HashSet<>();
}
