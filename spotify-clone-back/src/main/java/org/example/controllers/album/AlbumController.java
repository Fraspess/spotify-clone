package org.example.controllers.album;

import lombok.RequiredArgsConstructor;
import org.example.dtos.album.AlbumCreateDTO;
import org.example.dtos.album.AlbumResponseDTO;
import org.example.services.album.AlbumService;
import org.example.utils.MultipartFileEditor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/albums")
@RequiredArgsConstructor
public class AlbumController {
    private final AlbumService albumService;

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(MultipartFile.class, new MultipartFileEditor());
    }
    @GetMapping("/getAll")
    public ResponseEntity<Page<AlbumResponseDTO>> getAll(Pageable pageable){
        var albums = albumService.getAll(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(albums);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> create(@ModelAttribute AlbumCreateDTO dto){
        var success = albumService.create(dto);
        if(success) return ResponseEntity.status(HttpStatus.OK).body("Успішно створено");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Сталася помилка");
    }
}
