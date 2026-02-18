package org.example.repositories.user;

import org.example.entities.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface IUserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByEmail(String username);
    boolean existsByEmail(String email);

    Optional<UserEntity> findByUsername(String login);
}
