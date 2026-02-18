package org.example.controllers.user;

import lombok.RequiredArgsConstructor;
import org.example.dtos.user.UserLoginDTO;
import org.example.dtos.user.UserRegisterDTO;
import org.example.serverResponses.user.AuthResponse;
import org.example.services.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping(value = "/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UserRegisterDTO dto) {
        if (dto == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthResponse("Невірно передані дані", null));
        }

        var token = userService.register(dto);
        if (token != null) {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new AuthResponse("Успішно створенно", token));

        } else {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse("Помилка при реєстрації", null));
        }
    }


    @PostMapping(value = "/login")
    public ResponseEntity<AuthResponse> login(@RequestBody UserLoginDTO dto) {
        if (dto == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthResponse("Невірно передані дані", null));
        }
        var token = userService.login(dto);
        if (token != null) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new AuthResponse("Успішний вхід в систему.", token));
        } else {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse("Невірна почта або пароль.", null));
        }
    }



}

