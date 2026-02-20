package org.example.controllers.playlist;

import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<ServerResponse<Page<PlaylistResponseDTO>>> getAll(Pageable pageable){
        var playlists = playlistService.getAll(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(new ServerResponse<Page<PlaylistResponseDTO>>("Успішно отримано плейлисти",playlists));
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ServerResponse<String>> create(@ModelAttribute PlaylistCreateDTO dto){
        var success = playlistService.create(dto);
        if(success) return ResponseEntity.status(HttpStatus.OK).body(new ServerResponse<String>("Успішно створено плейлист.",null));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ServerResponse<String>("Сталася помилка",null));
    }

    @PostMapping("/addSong")
    public ResponseEntity<ServerResponse<String>> addSongToPlaylist(@RequestBody PlaylistAddSongDTO dto){
        var success = playlistService.addSongToPlaylist(dto);
        if(success) return ResponseEntity.status(HttpStatus.OK).body(new ServerResponse<String>("Успішно додано пісню до плейлиста",null));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ServerResponse<String>("Сталася помилка",null));
    }

    @DeleteMapping("delete")
    public ResponseEntity<?> deleteById(@RequestParam Long id){
        var success = playlistService.deleteById(id);
        if(success) return ResponseEntity.status(HttpStatus.OK).body(new ServerResponse<String>("Успішно видалено плейлист",null));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ServerResponse<String>("Сталася помилка",null));
    }
}
