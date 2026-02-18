package org.example.entities.song;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entities.user.UserEntity;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

@Entity
@Data
@Table(name = "songs")
@AllArgsConstructor
@NoArgsConstructor
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

    @ManyToMany(mappedBy = "favoriteSongs")
    private Set<UserEntity> favoritedBy;

    @ManyToOne
    @JoinColumn(name = "artist_id", nullable = false)
    private UserEntity artist;
}
