package org.example.repositories.album;

import org.example.entities.album.AlbumEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IAlbumRepository extends JpaRepository<AlbumEntity, Long> {
}
