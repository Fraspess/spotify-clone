package org.example.repositories.song;

import org.example.entities.song.SongEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ISongRepository extends JpaRepository<SongEntity, Long> {
    Optional<SongEntity> findById(Long id);

    @Query("""
    SELECT DISTINCT s FROM SongEntity s
    JOIN s.artist a
    LEFT JOIN s.albums al
    WHERE LOWER(s.title) LIKE LOWER(CONCAT('%', :q, '%'))
       OR LOWER(a.username) LIKE LOWER(CONCAT('%', :q, '%'))
    """)
    List<SongEntity> search(@Param("q") String q);


    @Query(value = "SELECT * FROM songs ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    SongEntity findRandomSong();
}

