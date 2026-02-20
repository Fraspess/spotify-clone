package org.example.exception;

import io.jsonwebtoken.MalformedJwtException;
import org.apache.coyote.BadRequestException;
import org.example.serverResponses.ServerResponse;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.security.core.AuthenticationException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ServerResponse<?>> handleMaxSizeException(MaxUploadSizeExceededException ex) {
        return ResponseEntity.status(413).body(new ServerResponse<>("Файл занадто великий", null));
    }

    @ExceptionHandler(ChangeSetPersister.NotFoundException.class)
    public ResponseEntity<ServerResponse<?>> handleNotFoundException(ChangeSetPersister.NotFoundException ex) {
        return ResponseEntity.status(404).body(new ServerResponse<>("Не знайдено", null));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ServerResponse<?>> handleAuthenticationException(AuthenticationException ex) {
        return ResponseEntity.status(401)
                .body(new ServerResponse<>("Ви не авторизовані", null));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ServerResponse<?>> handleBadRequestAuthentication(BadRequestException ex) {
        return ResponseEntity.status(401)
                .body(new ServerResponse<>("Ви не авторизовані", null));
    }


    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ServerResponse<?>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.status(400)
                .body(new ServerResponse<>(ex.getMessage(), null));
    }

    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<ServerResponse<?>> handleMalformedJwtException(MalformedJwtException ex) {
        return ResponseEntity.status(400)
                .body(new ServerResponse<>("Невірний формат токену", null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ServerResponse<?>> handleGeneralException(Exception ex) {
        return ResponseEntity.status(500).body(new ServerResponse<>("Внутрішня помилка сервера " + ex.getMessage(),null));
    }



}
