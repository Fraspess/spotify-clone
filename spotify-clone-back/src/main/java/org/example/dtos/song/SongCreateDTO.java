package org.example.dtos.song;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Date;

@Data
public class SongCreateDTO {
    @NotNull
    private String title;
    @NotNull
    private MultipartFile imageFile;
    @NotNull
    private MultipartFile songFile;
    @NotNull
    private LocalDate release_date;

}
