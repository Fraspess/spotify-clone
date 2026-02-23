package org.example.repositories.pendingUser;

import org.example.entities.pendingUser.PendingUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IPendingUserRepository extends JpaRepository<PendingUserEntity, Long> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Optional<PendingUserEntity> findByConfirmCode(Long confirmCode);
}
