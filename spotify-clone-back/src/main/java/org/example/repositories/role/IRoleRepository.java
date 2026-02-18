package org.example.repositories.role;

import org.example.entities.user.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IRoleRepository extends JpaRepository<RoleEntity,Integer> {
    Optional<RoleEntity> findByName(String name);
}
