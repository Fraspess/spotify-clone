package org.example.dtos.song;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
@Data
public class UpdateSongDTO {

    private String title;

    private MultipartFile imageFile;

    private MultipartFile songFile;

    private LocalDate release_date;
}
