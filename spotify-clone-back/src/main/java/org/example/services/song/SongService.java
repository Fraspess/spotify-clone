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
    private final SongImagesService songImagesService;

    public List<SongResponseDTO> getAll(){
        var songs = songRepository.findAll();
        return songMapper.fromEntityList(songs);
    }

    private String loadSongImage(SongCreateDTO dto) {
        if (dto.getImageFile() != null) {
            return songImagesService.load(dto.getImageFile());
        }
        return null;
    }

    private AudioFileDTO loadSongFile(SongCreateDTO dto) {
        if (dto.getSongFile() != null) {
            return songFilesService.load(dto.getSongFile());
        }
        return null;
    }
    private void validateSong(SongCreateDTO dto) {
        if ((dto.getSongFile() == null || dto.getSongFile().isEmpty())){
            throw new IllegalArgumentException("Either a song file or a song URL must be provided");
        }
    }
    public boolean createSong(SongCreateDTO dto){
        validateSong(dto);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("AUTH AFTER FILTER: " + SecurityContextHolder.getContext().getAuthentication());
        if (authentication == null) return false;
        String email = authentication.getName();

        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        if(userOpt.isEmpty()){
            return false;
        }
        var user = userOpt.get();

        // мапимо пісню
        var song = songMapper.fromCreateDto(dto);
        // ставимо айди користувача який створив пісню
        song.setArtist(user);

        String imageFileName = loadSongImage(dto);
        if (imageFileName != null) {
            song.setImage(imageFileName);
        }

        AudioFileDTO audioDto = loadSongFile(dto);
        if (audioDto != null) {
            System.out.println("NOT NULL");
            song.setSongFileName(audioDto.getFileName());
            song.setDurationInSeconds(audioDto.getDuration());
        }
        songRepository.save(song);
        return true;
    }

    public SongResponseDTO getById(Long id){
        var songOpt = songRepository.findById(id);
        return songOpt.map(songMapper::fromEntity).orElse(null);
    }

    private boolean validateUserRights(Long entityOwnerId){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("AUTH AFTER FILTER: " + SecurityContextHolder.getContext().getAuthentication());
        if (authentication == null) return true;

        String email = authentication.getName();
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return true;

        var user = userOpt.get();
        if(entityOwnerId != user.getId()) System.out.println("NOT OWNER");
        return entityOwnerId == user.getId();
    }

    public boolean deleteById(Long id){
        var songOpt = songRepository.findById(id);
        if(songOpt.isEmpty()) return false;
        var song = songOpt.get();
        if(!validateUserRights(song.getArtist().getId())) return false;
        songRepository.deleteById(id);
        return true;
    }


    public boolean update(Long id,UpdateSongDTO dto){
        Optional<SongEntity> songOpt = songRepository.findById(id);
        if (songOpt.isEmpty()) return false;
        var song = songOpt.get();
        if(!validateUserRights(song.getArtist().getId())) return false;
        if (dto.getTitle() != null) {
            song.setTitle(dto.getTitle());
        }

        if (dto.getRelease_date() != null) {
            song.setRelease_date(dto.getRelease_date());
        }

        if (dto.getImageFile() != null && !dto.getImageFile().isEmpty()) {
            var fileName = songImagesService.replace(song.getImage(), dto.getImageFile());
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
                return false;
            }
            song.setDurationInSeconds(audioDTO.getDuration());
            song.setSongFileName(audioDTO.getFileName());
        }
        songRepository.save(song);
        return true;
    }
}
