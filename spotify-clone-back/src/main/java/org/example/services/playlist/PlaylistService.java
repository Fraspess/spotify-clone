package org.example.services.playlist;

import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.example.dtos.playlist.PlaylistAddSongDTO;
import org.example.dtos.playlist.PlaylistCreateDTO;
import org.example.dtos.playlist.PlaylistResponseDTO;
import org.example.entities.user.UserEntity;
import org.example.mappers.playlist.PlaylistMapper;
import org.example.repositories.playlist.IPlaylistRepository;
import org.example.repositories.song.ISongRepository;
import org.example.repositories.user.IUserRepository;
import org.example.utils.AuthService;
import org.example.utils.ImagesService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
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
    private final AuthService authService;

    @Value("${album.images.dir}")
    private String uploadImgDir;

    public Page<PlaylistResponseDTO> getAll(Pageable pageable) {
        var albums = playlistRepository.findAll(pageable);
        return albums.map(playlistMapper::fromEntity);
    }

    public void create(PlaylistCreateDTO dto) {
        if (dto == null) throw new IllegalArgumentException("DTO є пустою");
        var user = authService.getUser();
        var album = playlistMapper.fromCreateDto(dto);
        album.setArtist(user);

        var fileName = playlistImagesService.load(dto.getImage(), uploadImgDir);
        for (var songId : dto.getSongsIds()) {
            songRepository.findById(songId).ifPresent(album.getSongs()::add);
        }
        album.setImage(fileName);
        album.setDateCreated(LocalDate.now());
        playlistRepository.save(album);
    }

    public void addSongToPlaylist(PlaylistAddSongDTO dto) {
        var user = authService.getUser();

        var playlist = playlistRepository.findById(dto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Плейлист не знайдено"));

        if (!playlist.getArtist().equals(user)) {
            throw new org.springframework.security.access.AccessDeniedException("Цей плейлист належить іншому користувачу");
        }

        var song = songRepository.findById(dto.getSongId())
                .orElseThrow(() -> new IllegalArgumentException("Пісню не знайдено"));

        if (playlist.getSongs().contains(song)) {
            playlist.getSongs().remove(song);
        } else {
            playlist.getSongs().add(song);
        }

        playlistRepository.save(playlist);
    }

    public void deleteById(Long id) {
        var playlist = playlistRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Плейлист не знайдено"));
        var user = authService.getUser();

        if (!playlist.getArtist().equals(user)) {
            throw new org.springframework.security.access.AccessDeniedException("Ви не можете видалити чужий плейлист");
        }
        playlistRepository.delete(playlist);
    }
}
