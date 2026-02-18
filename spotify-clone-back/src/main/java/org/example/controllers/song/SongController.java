package org.example.controllers.song;

import lombok.RequiredArgsConstructor;
import org.example.dtos.song.SongCreateDTO;
import org.example.dtos.song.SongResponseDTO;
import org.example.serverResponses.ServerResponse;
import org.example.services.song.SongService;
import org.hibernate.ObjectNotFoundException;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/songs")
@RequiredArgsConstructor
public class SongController {
    private final SongService songService;

    @GetMapping(value = "/getAll")
    public ResponseEntity<ServerResponse<List<SongResponseDTO>>> getAllSongs(){
        return ResponseEntity.status(HttpStatus.OK).body(new ServerResponse<List<SongResponseDTO>>("Успішно отримано пісні",songService.getAll()));
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ServerResponse<String>> createSong(@ModelAttribute SongCreateDTO dto){
        var result = songService.createSong(dto);
        if(result){
            return ResponseEntity.status(HttpStatus.OK).body(new ServerResponse<String>("Успішно створенно пісню", null));
        }
        else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ServerResponse<String>("Невірно передані дані", null));
        }
    }

    @GetMapping("/getById")
    public ResponseEntity<ServerResponse<SongResponseDTO>> getById(@RequestParam(value = "id") String idS){
        var id = Integer.parseInt(idS);
            var song = songService.getById(id);
            if (song == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ServerResponse<SongResponseDTO>("Пісню не знайдено", null));
            return ResponseEntity.status(HttpStatus.OK).body(new ServerResponse<SongResponseDTO>("Успішно отримано пісню", song));
    }

    @DeleteMapping(value = "/deleteById")
    public ResponseEntity<ServerResponse<String>> deleteById(@RequestParam(value = "id") String idS){
        var id = Integer.parseInt(idS);
        return ResponseEntity.status(HttpStatus.OK).body(new ServerResponse<String>("Успішо видалено пісню якщо її знайдено", null));
    }
}
