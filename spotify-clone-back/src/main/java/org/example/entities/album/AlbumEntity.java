package org.example.entities.album;

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
@Table(name = "albums")
@AllArgsConstructor
@NoArgsConstructor
@SQLDelete(sql = "UPDATE albums SET deleted = true WHERE id = ?")
@SQLRestriction("deleted = false")

public class AlbumEntity {
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
            name = "album_songs",
            joinColumns = @JoinColumn(name = "album_id"),
            inverseJoinColumns = @JoinColumn(name = "song_id")
    )
    private Set<SongEntity> songs = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AlbumEntity)) return false;
        return id != null && id.equals(((AlbumEntity) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
