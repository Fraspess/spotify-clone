package org.example.repositories.playlist;

import org.example.entities.playlist.PlaylistEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IPlaylistRepository extends JpaRepository<PlaylistEntity, Long> {
}
