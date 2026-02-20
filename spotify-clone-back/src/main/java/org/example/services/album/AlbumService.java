package org.example.services.album;

import lombok.RequiredArgsConstructor;
import org.example.dtos.album.AlbumResponseDTO;
import org.example.mappers.album.AlbumMapper;
import org.example.repositories.album.IAlbumRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AlbumService {
    private final IAlbumRepository albumRepository;
    private final AlbumMapper albumMapper;

    public Page<AlbumResponseDTO> getAll(Pageable pageable){
        var albums = albumRepository.findAll(pageable);
        return albums.map(albumMapper::fromEntity);
    }
}
