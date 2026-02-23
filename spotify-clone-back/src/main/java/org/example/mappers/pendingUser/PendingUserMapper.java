package org.example.mappers.pendingUser;

import org.example.dtos.pendingUser.PendingUserDTO;
import org.example.entities.pendingUser.PendingUserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
public interface PendingUserMapper {
    @Mapping(target = "password", ignore = true)
    PendingUserEntity fromDTO(PendingUserDTO dto);
}
