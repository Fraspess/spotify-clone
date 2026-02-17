package org.example.mappers;

import org.example.dtos.UserRegisterDTO;
import org.example.entities.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "password", ignore = true)
    UserEntity fromRegisterDTO(UserRegisterDTO dto);
}
