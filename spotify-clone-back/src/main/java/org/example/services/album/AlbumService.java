package org.example.services.album;

import lombok.RequiredArgsConstructor;
import org.example.dtos.album.AlbumCreateDTO;
import org.example.dtos.album.AlbumResponseDTO;
import org.example.entities.user.UserEntity;
import org.example.mappers.album.AlbumMapper;
import org.example.repositories.albums.IAlbumRepository;
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
public class AlbumService {
    private final IAlbumRepository albumRepository;
    private final AlbumMapper albumMapper;
    private final IUserRepository userRepository;
    private final ImagesService albumImagesService;
    private final ISongRepository songRepository;

    @Value("${album.images.dir}")
    private String uploadImgDir;

    public Page<AlbumResponseDTO> getAll(Pageable pageable){
        var albums = albumRepository.findAll(pageable);
        return albums.map(albumMapper::fromEntity);
    }

    private UserEntity getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("AUTH AFTER FILTER: " + SecurityContextHolder.getContext().getAuthentication());
        if (authentication == null) return null;

        String email = authentication.getName();
        var userOpt = userRepository.findByEmail(email);
        return userOpt.orElse(null);

    }

    public boolean create(AlbumCreateDTO dto){
        if(dto == null) return false;
        var user = getUser();
        if(user == null) return false;
        var album = albumMapper.fromCreateDto(dto);
        album.setArtist(user);

        var fileName = albumImagesService.load(dto.getImage(),uploadImgDir);
        dto.getSongsIds().forEach(songId -> {
            var songOpt = songRepository.findById(songId);
            if(songOpt.isEmpty())return;
            var song = songOpt.get();
            album.getSongs().add(song);
        });
        album.setImage(fileName);
        album.setDateCreated(LocalDate.now());
        albumRepository.save(album);
        return true;
    }
}
