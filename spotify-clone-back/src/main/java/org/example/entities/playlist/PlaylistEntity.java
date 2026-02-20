package org.example.entities.playlist;

import jakarta.persistence.*;
import lombok.*;
import org.example.entities.song.SongEntity;
import org.example.entities.user.UserEntity;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "playlists")
@AllArgsConstructor
@NoArgsConstructor
@SQLDelete(sql = "UPDATE playlists SET deleted = true WHERE id = ?")
@SQLRestriction("deleted = false")

public class PlaylistEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDate dateCreated;

    private String image;

    @Column(nullable = false)
    private boolean deleted = false;

    @ManyToOne
    @JoinColumn(name = "artist_id", nullable = false)
    private UserEntity artist;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "playlist_songs",
            joinColumns = @JoinColumn(name = "playlist_id"),
            inverseJoinColumns = @JoinColumn(name = "song_id")
    )
    private Set<SongEntity> songs = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PlaylistEntity)) return false;
        return id != null && id.equals(((PlaylistEntity) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
