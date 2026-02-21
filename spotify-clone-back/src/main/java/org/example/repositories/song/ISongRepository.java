package org.example.repositories.song;

import org.example.entities.song.SongEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ISongRepository extends JpaRepository<SongEntity, Long> {
    Optional<SongEntity> findById(Long id);

}
