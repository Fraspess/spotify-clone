package org.example.mappers.user;

import org.example.dtos.user.UserRegisterDTO;
import org.example.dtos.user.UserResponseDTO;
import org.example.entities.user.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "password", ignore = true)
    UserEntity fromRegisterDTO(UserRegisterDTO dto);

    List<UserResponseDTO> fromEntityList(List<UserEntity> users);
    default String map(UserEntity user) {
        return user != null ? user.getUsername() : null;
    }

    UserResponseDTO fromEntity(UserEntity user);

}
