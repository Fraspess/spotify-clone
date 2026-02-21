package org.example.controllers.playlist;

import lombok.RequiredArgsConstructor;
import org.apache.catalina.Server;
import org.example.dtos.playlist.PlaylistAddSongDTO;
import org.example.dtos.playlist.PlaylistCreateDTO;
import org.example.dtos.playlist.PlaylistResponseDTO;
import org.example.serverResponses.ServerResponse;
import org.example.services.playlist.PlaylistService;
import org.example.utils.MultipartFileEditor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/playlists")
@RequiredArgsConstructor
public class PlaylistController {
    private final PlaylistService playlistService;

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(MultipartFile.class, new MultipartFileEditor());
    }

    @GetMapping("/getAll")
    public ResponseEntity<ServerResponse<?>> getAll(Pageable pageable) {
        Page<PlaylistResponseDTO> playlists = playlistService.getAll(pageable);
        return ResponseEntity.ok(
                new ServerResponse<>(true,"Успішно отримано плейлисти", playlists)
        );
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ServerResponse<?>> create(@ModelAttribute PlaylistCreateDTO dto) {
        playlistService.create(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ServerResponse<>(true,"Успішно створено плейлист.", null));
    }


    @PostMapping("/addSong")
    public ResponseEntity<ServerResponse<?>> addSongToPlaylist(@RequestBody PlaylistAddSongDTO dto) {
        return ResponseEntity.ok(
                new ServerResponse<>(true,"Успішно додано пісню до плейлиста", null)
        );
    }


    @DeleteMapping("/delete")
    public ResponseEntity<ServerResponse<?>> deleteById(@RequestParam Long id) {
        playlistService.deleteById(id);
        return ResponseEntity.ok(
                new ServerResponse<>(true,"Успішно видалено плейлист", null)
        );
    }
}
