package org.example.mappers.song;

import org.example.dtos.song.SongCreateDTO;
import org.example.dtos.song.SongResponseDTO;
import org.example.entities.song.SongEntity;
import org.example.entities.user.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SongMapper {
    @Mapping(target = "favoritedBy", ignore = true)
    List<SongResponseDTO> fromEntityList(List<SongEntity> entity);

    @Mapping(target = "image", ignore = true)
    @Mapping(target = "artist", ignore = true)
    SongEntity fromCreateDto(SongCreateDTO dto);

    default String map(UserEntity user) {
        return user != null ? user.getUsername() : null;
    }

    SongResponseDTO fromEntity(SongEntity entity);
}
