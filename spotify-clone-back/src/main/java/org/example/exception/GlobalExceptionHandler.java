package org.example.exception;

import io.jsonwebtoken.MalformedJwtException;
import org.apache.coyote.BadRequestException;
import org.apache.tomcat.util.http.parser.HttpParser;
import org.example.serverResponses.ServerResponse;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ServerResponse<?>> handleMaxSizeException(MaxUploadSizeExceededException ex) {
        return ResponseEntity.status(413).body(new ServerResponse<>(false,"Файл занадто великий", null));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ServerResponse<?>> handleResponseStatusException(ResponseStatusException ex){
        return ResponseEntity.status(ex.getStatusCode()).body(new ServerResponse<>(false,ex.getMessage(),null));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ServerResponse<?>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.status(400)
                .body(new ServerResponse<>(false,ex.getMessage(), null));
    }

    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<ServerResponse<?>> handleMalformedJwtException(MalformedJwtException ex) {
        return ResponseEntity.status(400)
                .body(new ServerResponse<>(false,"Невірний формат токену", null));
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<ServerResponse<?>> handleNotAuthorizedException(InsufficientAuthenticationException ex){
        return ResponseEntity.status(401)
                .body(new ServerResponse<>(false, "Ви не авторизовані", null));
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ServerResponse<?>> hadnleNotFoundException(UsernameNotFoundException ex){
        return ResponseEntity.status(401)
                .body(new ServerResponse<>(false,"Користувач не авторизований", null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ServerResponse<?>> handleGeneralException(Exception ex) {
        return ResponseEntity.status(500).body(new ServerResponse<>(false, "Внутрішня помилка сервера " + ex.getMessage(),null));
    }
}
