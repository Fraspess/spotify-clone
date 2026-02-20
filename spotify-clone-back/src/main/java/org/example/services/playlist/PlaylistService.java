package org.example.services.playlist;

import lombok.RequiredArgsConstructor;
import org.example.dtos.playlist.PlaylistAddSongDTO;
import org.example.dtos.playlist.PlaylistCreateDTO;
import org.example.dtos.playlist.PlaylistResponseDTO;
import org.example.entities.user.UserEntity;
import org.example.mappers.playlist.PlaylistMapper;
import org.example.repositories.playlist.IPlaylistRepository;
import org.example.repositories.song.ISongRepository;
import org.example.repositories.user.IUserRepository;
import org.example.utils.ImagesService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PlaylistService {
    private final IPlaylistRepository playlistRepository;
    private final PlaylistMapper playlistMapper;
    private final IUserRepository userRepository;
    private final ImagesService playlistImagesService;
    private final ISongRepository songRepository;

    @Value("${album.images.dir}")
    private String uploadImgDir;

    public Page<PlaylistResponseDTO> getAll(Pageable pageable) {
        var albums = playlistRepository.findAll(pageable);
        return albums.map(playlistMapper::fromEntity);
    }

    private UserEntity getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("AUTH AFTER FILTER: " + SecurityContextHolder.getContext().getAuthentication());
        if (authentication == null) return null;

        String email = authentication.getName();
        var userOpt = userRepository.findByEmail(email);
        return userOpt.orElse(null);

    }

    public boolean create(PlaylistCreateDTO dto) {
        if (dto == null) return false;
        var user = getUser();
        if (user == null) return false;
        var album = playlistMapper.fromCreateDto(dto);
        album.setArtist(user);

        var fileName = playlistImagesService.load(dto.getImage(), uploadImgDir);
        dto.getSongsIds().forEach(songId -> {
            var songOpt = songRepository.findById(songId);
            if (songOpt.isEmpty()) return;
            var song = songOpt.get();
            album.getSongs().add(song);
        });
        album.setImage(fileName);
        album.setDateCreated(LocalDate.now());
        playlistRepository.save(album);
        return true;
    }

    public boolean addSongToPlaylist(PlaylistAddSongDTO dto) {
        var user = getUser();
        if (user == null) return false;
        var albumOpt = playlistRepository.findById(dto.getId());
        if (albumOpt.isEmpty()) return false;
        var playlist = albumOpt.get();
        var userPlaylists = user.getPlaylists();
        var userPlaylistOpt = userPlaylists.stream().findFirst();

        if (userPlaylistOpt.isEmpty()) return false;

        var userPlaylist = userPlaylistOpt.get();
        var songOpt = songRepository.findById(dto.getSongId());
        if (songOpt.isEmpty()) return false;

        var song = songOpt.get();

        if (userPlaylist.getSongs().contains(song)) {
            userPlaylist.getSongs().remove(song);
        } else {
            playlist.getSongs().add(song);
        }
        playlistRepository.save(playlist);
        return true;
    }

    public boolean deleteById(Long id) {
        var playListOpt = playlistRepository.findById(id);
        if (playListOpt.isEmpty()) return false;
        var playlist = playListOpt.get();
        playlistRepository.delete(playlist);
        return true;
    }
}
