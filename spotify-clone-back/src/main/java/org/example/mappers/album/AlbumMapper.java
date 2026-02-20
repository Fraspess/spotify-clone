package org.example.mappers.album;

import org.example.dtos.album.AlbumCreateDTO;
import org.example.dtos.album.AlbumResponseDTO;
import org.example.entities.album.AlbumEntity;
import org.example.entities.user.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AlbumMapper {
    AlbumResponseDTO fromEntity(AlbumEntity album);

    @Mapping(target = "image", ignore = true)
    AlbumEntity fromCreateDto(AlbumCreateDTO dto);

    default String map(UserEntity user) {
        return user != null ? user.getUsername() : null;
    }
}
