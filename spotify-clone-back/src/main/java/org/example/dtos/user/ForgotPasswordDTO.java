package org.example.dtos.user;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ForgotPasswordDTO {
    @NotNull
    public String email;
}
