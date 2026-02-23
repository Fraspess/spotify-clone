package org.example.dtos.pendingUser;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PendingUserDTO {
    @NotNull
    private String username;

    @NotNull
    private String email;

    @NotNull
    private String password;
}
