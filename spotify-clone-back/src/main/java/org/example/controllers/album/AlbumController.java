package org.example.controllers.album;

import lombok.RequiredArgsConstructor;
import org.example.dtos.album.AlbumResponseDTO;
import org.example.serverResponses.ServerResponse;
import org.example.services.album.AlbumService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/albums")
@RequiredArgsConstructor
public class AlbumController {
    private final AlbumService albumService;

    @GetMapping("/getAll")
    public ResponseEntity<ServerResponse<?>> getAll(Pageable pageable){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ServerResponse<>(null, albumService.getAll(pageable)));
    }
}
