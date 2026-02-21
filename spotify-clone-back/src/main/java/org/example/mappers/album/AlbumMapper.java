package org.example.mappers.album;

import org.example.dtos.album.AlbumCreateDTO;
import org.example.dtos.album.AlbumResponseDTO;
import org.example.entities.album.AlbumEntity;
import org.example.entities.user.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AlbumMapper {
    default String map(UserEntity user) {
        return user != null ? user.getUsername() : null;
    }

    AlbumResponseDTO fromEntity(AlbumEntity album);
    List<AlbumResponseDTO> fromEntityList(List<AlbumEntity> albums);

    @Mapping(target = "songs", ignore = true)
    AlbumEntity fromCreateDto(AlbumCreateDTO dto);
}
