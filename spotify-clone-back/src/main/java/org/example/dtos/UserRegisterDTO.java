package org.example.dtos;

import lombok.Data;

@Data
public class UserRegisterDTO {
    private String username;
    private String email;
    private String password;
    private String confirmPassword;
}
