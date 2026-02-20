package org.example.entities.song;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entities.album.AlbumEntity;
import org.example.entities.playlist.PlaylistEntity;
import org.example.entities.user.UserEntity;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Entity
@Data
@Table(name = "songs")
@AllArgsConstructor
@NoArgsConstructor
@SQLDelete(sql = "UPDATE songs SET deleted = true WHERE id = ?")
@SQLRestriction("deleted = false")
public class SongEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Long durationInSeconds;

    @Column(nullable = false)
    private String image;

    @Column(nullable = false)
    private String songFileName;

    @Column(nullable = false)
    private LocalDate release_date;

    @Column(nullable = false)
    private boolean deleted = false;

    @ManyToMany(mappedBy = "favoriteSongs")
    private List<UserEntity> favoritedBy;

    @ManyToOne
    @JoinColumn(name = "artist_id", nullable = false)
    private UserEntity artist;

    @ManyToMany(mappedBy = "songs")
    private Set<PlaylistEntity> playlists;

    @ManyToMany(mappedBy = "songs")
    private Set<AlbumEntity> albums;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SongEntity)) return false;
        return id != null && id.equals(((SongEntity) o).id);
    }


    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
