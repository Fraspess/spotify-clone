package org.example.dtos.user;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UserUpdateDTO {
    private String username;
    private String email;
    private String password;

    private MultipartFile userImage;
}
