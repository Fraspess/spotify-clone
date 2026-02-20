package org.example.mappers.playlist;

import org.example.dtos.album.PlaylistCreateDTO;
import org.example.dtos.album.PlaylistResponseDTO;
import org.example.entities.playlist.PlaylistEntity;
import org.example.entities.user.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PlaylistMapper {
    PlaylistResponseDTO fromEntity(PlaylistEntity album);

    @Mapping(target = "image", ignore = true)
    PlaylistEntity fromCreateDto(PlaylistCreateDTO dto);

    default String map(UserEntity user) {
        return user != null ? user.getUsername() : null;
    }
}
