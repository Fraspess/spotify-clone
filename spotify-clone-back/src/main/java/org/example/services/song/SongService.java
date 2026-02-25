package org.example.services.song;

import lombok.RequiredArgsConstructor;
import org.example.dtos.song.AudioFileDTO;
import org.example.dtos.song.SongCreateDTO;
import org.example.dtos.song.SongResponseDTO;
import org.example.dtos.song.UpdateSongDTO;
import org.example.entities.song.SongEntity;
import org.example.entities.user.UserEntity;
import org.example.mappers.song.SongMapper;
import org.example.repositories.song.ISongRepository;
import org.example.repositories.user.IUserRepository;
import org.example.utils.AuthService;
import org.example.utils.ImagesService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SongService {
    private final ISongRepository songRepository;
    private final IUserRepository userRepository;
    private final SongMapper songMapper;
    private final SongFilesService songFilesService;
    private final ImagesService songImagesService;
    private final AuthService authService;

    @Value("${music.images.dir}")
    private String uploadImgDir;

    public Page<SongResponseDTO> getAll(Pageable pageable) {
        Page<SongEntity> songs = songRepository.findAll(pageable);
        return songs.map(songMapper::fromEntity);
    }

    private String loadSongImage(SongCreateDTO dto) {
        if (dto.getImageFile() != null) {
            return songImagesService.load(dto.getImageFile(), uploadImgDir);
        }
        return null;
    }

    private AudioFileDTO loadSongFile(SongCreateDTO dto) {
        if (dto.getSongFile() != null) {
            return songFilesService.load(dto.getSongFile());
        }
        return null;
    }


    public void createSong(SongCreateDTO dto) {
        var user = authService.getUser();

        var song = songMapper.fromCreateDto(dto);

        song.setArtist(user);

        String imageFileName = loadSongImage(dto);
        AudioFileDTO audioDto = loadSongFile(dto);
        if (imageFileName == null || audioDto == null) {
            throw new IllegalArgumentException("Невірні формати файлів");
        }

        song.setImage(imageFileName);
        System.out.println("NOT NULL");
        song.setSongFileName(audioDto.getFileName());
        song.setDurationInSeconds(audioDto.getDuration());


        songRepository.save(song);

    }

    public SongResponseDTO getById(Long id) {
        var song = songRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Пісню не знайдено"));
        return songMapper.fromEntity(song);
    }

    private boolean validateUserRights(Long entityOwnerId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("AUTH AFTER FILTER: " + SecurityContextHolder.getContext().getAuthentication());
        if (authentication == null) return true;

        String email = authentication.getName();
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return true;

        var user = userOpt.get();
        if (entityOwnerId != user.getId()) System.out.println("NOT OWNER");
        return entityOwnerId == user.getId();
    }

    public void deleteById(Long id) {
        var song = songRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Пісню не знайдено"));
        if (!validateUserRights(song.getArtist().getId())) throw new AccessDeniedException("Заборонено");
        songRepository.deleteById(id);
    }

    public void update(Long id, UpdateSongDTO dto) {
        var song = songRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Пісню не знайдено"));
        if (!validateUserRights(song.getArtist().getId())) throw new AccessDeniedException("Заборонено");

        if (dto.getTitle() != null) {
            song.setTitle(dto.getTitle());
        }

        if (dto.getRelease_date() != null) {
            song.setRelease_date(dto.getRelease_date());
        }

        if (dto.getImageFile() != null && !dto.getImageFile().isEmpty()) {
            var fileName = songImagesService.replace(song.getImage(), dto.getImageFile(), uploadImgDir);
            song.setImage(fileName);
        }

        if (dto.getSongFile() != null && !dto.getSongFile().isEmpty()) {
            songFilesService.delete(song.getSongFileName());
            var audioDTO = songFilesService.load(dto.getSongFile());
            if (audioDTO != null) {
                song.setDurationInSeconds(audioDTO.getDuration());
                song.setSongFileName(audioDTO.getFileName());
            } else {
                System.out.println("Audio file processing failed.");
                throw new IllegalArgumentException("Файл не прошов аудіо перетворення");
            }
            song.setDurationInSeconds(audioDTO.getDuration());
            song.setSongFileName(audioDTO.getFileName());
        }
        songRepository.save(song);
    }

    public void favoriteSong(Long id) {
        var user = authService.getUser();

        var song = songRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Пісню не знайдено"));

        var favorites = user.getFavoriteSongs();
        if (favorites.contains(song)) {
            favorites.remove(song);
        } else {
            user.getFavoriteSongs().add(song);
        }
        userRepository.save(user);
    }

    public List<SongResponseDTO> search(String q) {
        return songMapper.fromEntityList(songRepository.search(q));
    }


    public SongResponseDTO getRandomSong(){
        return songMapper.fromEntity(songRepository.findRandomSong());
    }
}
