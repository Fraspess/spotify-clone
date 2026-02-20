package org.example.dtos.user;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserLoginDTO {
    @NotNull
    private String login;
    @NotNull
    private String password;
}
