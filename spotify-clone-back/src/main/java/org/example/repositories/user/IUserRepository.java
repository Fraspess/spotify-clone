package org.example.repositories.user;

import org.apache.catalina.User;
import org.example.entities.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface IUserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByResetPasswordToken(String token);

    void deleteById(Long id);
}
