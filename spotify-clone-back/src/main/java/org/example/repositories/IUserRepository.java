package org.example.repositories;

import org.example.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IUserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByEmail(String username);
    boolean existsByEmail(String email);
}
