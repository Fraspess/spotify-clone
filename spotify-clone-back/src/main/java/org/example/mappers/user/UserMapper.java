package org.example.mappers.user;

import org.example.dtos.user.UserRegisterDTO;
import org.example.entities.user.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "password", ignore = true)
    UserEntity fromRegisterDTO(UserRegisterDTO dto);
}
