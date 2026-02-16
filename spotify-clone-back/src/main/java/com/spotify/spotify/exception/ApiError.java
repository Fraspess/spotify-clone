package com.spotify.spotify.exception;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ApiError {

    private String message;
    private int status;
    private LocalDateTime timestamp;
}