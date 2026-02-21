package org.example.services.album;

import lombok.RequiredArgsConstructor;
import org.example.dtos.album.AlbumUpdateDTO;
import org.example.dtos.album.AlbumCreateDTO;
import org.example.dtos.album.AlbumResponseDTO;
import org.example.mappers.album.AlbumMapper;
import org.example.repositories.album.IAlbumRepository;
import org.example.repositories.song.ISongRepository;
import org.example.utils.AuthService;
import org.example.utils.ImagesService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.LinkedHashSet;


@Service
@RequiredArgsConstructor
public class AlbumService {
    private final IAlbumRepository albumRepository;
    private final AlbumMapper albumMapper;
    private final ISongRepository songRepository;
    private final AuthService authService;
    private final ImagesService imagesService;
    @Value("${album.images.dir}")
    private String uploadDir;

    public Page<AlbumResponseDTO> getAll(Pageable pageable) {
        var albums = albumRepository.findAll(pageable);
        return albums.map(albumMapper::fromEntity);
    }

    public AlbumResponseDTO getById(Long id) {
        return albumMapper.fromEntity(albumRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)));
    }

    public void create(AlbumCreateDTO dto) {
        var songs = songRepository.findAllById(dto.getSongs());
        var album = albumMapper.fromCreateDto(dto);
        var user = authService.getUser();
        album.setArtist(user);
        album.setSongs(new HashSet<>(songs));
        album.setReleaseDate(LocalDate.now());
        albumRepository.save(album);
    }

    public void update(AlbumUpdateDTO dto) {
        var user = authService.getUser();
        var album = albumRepository.findById(dto.getAlbumId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (album.getArtist() != user) throw new InsufficientAuthenticationException("Ви не авторизовані");

        var songs = songRepository.findAllById(dto.getSongId());
        album.setSongs(new LinkedHashSet<>(songs));

        if(dto.getImage() != null){
            var newFileName = imagesService.load(dto.getImage(), uploadDir);
            if (newFileName == null) throw new IllegalArgumentException("Помилка при збереженні картинки");

        }
        album.setTitle(dto.getTitle());
        album.setReleaseDate(LocalDate.now());

        albumRepository.save(album);
    }

    public void deleteAlbum(Long id) {
        var album = albumRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        albumRepository.delete(album);
    }
}
