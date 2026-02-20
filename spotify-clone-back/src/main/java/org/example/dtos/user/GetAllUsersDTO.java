package org.example.dtos.user;

import lombok.Data;

@Data
public class GetAllUsersDTO {
    private String username;
    private String email;
    private String image;
}
