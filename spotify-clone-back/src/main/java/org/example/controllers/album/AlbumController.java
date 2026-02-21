package org.example.controllers.album;

import lombok.RequiredArgsConstructor;
import org.example.dtos.album.AlbumUpdateDTO;
import org.example.dtos.album.AlbumCreateDTO;
import org.example.serverResponses.ServerResponse;
import org.example.services.album.AlbumService;
import org.example.utils.MultipartFileEditor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ServerResponse<?>> getAll(Pageable pageable){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ServerResponse<>(true,null, albumService.getAll(pageable)));
    }

    @GetMapping("/getById")
    public ResponseEntity<ServerResponse<?>> getById(@RequestParam Long id){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ServerResponse<>(true,null, albumService.getById(id)));
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ServerResponse<?>> create(@ModelAttribute AlbumCreateDTO dto){
        albumService.create(dto);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ServerResponse<>(true, "Альбом успішно створено", null));
    }

    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ServerResponse<?>> addSongToAlbum(@ModelAttribute AlbumUpdateDTO dto){
        albumService.update(dto);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ServerResponse<>(true, "Успішно додано пісню до альбому",null));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ServerResponse<?>> deleteById(@RequestParam Long id){
        albumService.deleteAlbum(id);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ServerResponse<>(true, "Альбом успішно видалено", null));
    }

}
