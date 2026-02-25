package org.example.controllers.song;

import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import org.example.dtos.song.FavoriteSongDTO;
import org.example.dtos.song.SongCreateDTO;
import org.example.dtos.song.SongResponseDTO;
import org.example.dtos.song.UpdateSongDTO;
import org.example.serverResponses.ServerResponse;
import org.example.services.song.SongService;
import org.example.utils.MultipartFileEditor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/songs")
@RequiredArgsConstructor
public class SongController {
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(MultipartFile.class, new MultipartFileEditor());
    }

    private final SongService songService;

    @GetMapping("/getAll")
    public ResponseEntity<ServerResponse<?>> getAllSongs(Pageable pageable) {
        Page<SongResponseDTO> songs = songService.getAll(pageable);

        return ResponseEntity.ok(
                new ServerResponse<>(true,null, songs)
        );
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ServerResponse<?>> createSong(@ModelAttribute SongCreateDTO dto) {
        songService.createSong(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ServerResponse<>(true,"Пісню успішно створено", null));

    }

    @GetMapping("/getById")
    public ResponseEntity<ServerResponse<?>> getById(@RequestParam("id") Long id) {
        var song = songService.getById(id);
        return ResponseEntity.ok(
                new ServerResponse<>(true,null, song)
        );
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ServerResponse<?>> deleteById(@RequestParam("id") Long id) {

        songService.deleteById(id);
        return ResponseEntity.ok(
                new ServerResponse<>(true,"Пісню успішно видалено", null));
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ServerResponse<?>> updateById(
            @PathVariable Long id,
            @ModelAttribute UpdateSongDTO updateSongDTO) {

        songService.update(id, updateSongDTO);

        return ResponseEntity.ok(
                new ServerResponse<>(true,"Пісню успішно оновлено", null));
    }

    @PostMapping("/favorite-song")
    public ResponseEntity<ServerResponse<?>> favoriteSong(@RequestBody FavoriteSongDTO dto) {
        songService.favoriteSong(dto.getId());

        return ResponseEntity.ok(
                new ServerResponse<>(true,"Пісню додано до улюблених", null));
    }

    @GetMapping("/search")
    public ResponseEntity<ServerResponse<?>> search(@RequestParam String q){
        var songs = songService.search(q);
        return ResponseEntity.status(HttpStatus.OK).body(new ServerResponse<>(true, "", songs));
    }

    @GetMapping("/random")
    public ResponseEntity<ServerResponse<?>> getRandomSong(){
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ServerResponse<>(true, null, songService.getRandomSong()));
    }
}
