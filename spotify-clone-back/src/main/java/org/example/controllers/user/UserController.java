package org.example.controllers.user;

import lombok.RequiredArgsConstructor;
import org.apache.catalina.Server;
import org.apache.catalina.User;
import org.example.dtos.pendingUser.ConfirmRegisterDTO;
import org.example.dtos.pendingUser.PendingUserDTO;
import org.example.dtos.song.FavoriteSongDTO;
import org.example.dtos.token.TokenDTO;
import org.example.dtos.user.*;
import org.example.serverResponses.ServerResponse;
import org.example.services.user.UserService;
import org.example.utils.MultipartFileEditor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(MultipartFile.class, new MultipartFileEditor());
    }

    private final UserService userService;

    @PostMapping("/register-request")
    public ResponseEntity<ServerResponse<?>> registerRequest(@RequestBody PendingUserDTO dto) {
        userService.registerRequest(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ServerResponse<>(true,"На почту був відправлений код для активації аккаунту",null));
    }

    @PostMapping("/register")
    public ResponseEntity<ServerResponse<?>> registerRequest(@RequestBody ConfirmRegisterDTO dto) {
        var token = userService.register(dto.getConfirmCode());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ServerResponse<>(true,"Реєстрація успішна", token));
    }



    @PostMapping("/login")
    public ResponseEntity<ServerResponse<?>> login(@RequestBody UserLoginDTO dto) {
        var token = userService.login(dto);
        return ResponseEntity.ok(
                new ServerResponse<>(true,"Успішний вхід в систему", token)
        );

    }

    @GetMapping("/me")
    public ResponseEntity<ServerResponse<?>> me(){
        return ResponseEntity.status(HttpStatus.OK).
                body(new ServerResponse<>(true,null,userService.me()));
    }

    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ServerResponse<?>> update(@ModelAttribute UserUpdateDTO dto) {
        userService.update(dto);
        return ResponseEntity.ok(
                new ServerResponse<>(true,"Успішно оновлено профіль користувача", null)
        );

    }

    @DeleteMapping("/disable")
    public ResponseEntity<ServerResponse<?>> disable() {
        userService.disable();

        return ResponseEntity.ok(
                new ServerResponse<>(true,"Аккаунт успішно виключено", null)
        );

    }

    @GetMapping("/getAll")
    public ResponseEntity<ServerResponse<?>> getAll() {
        var users = userService.getAll();

        return ResponseEntity.ok(
                new ServerResponse<>(true,"Успішно отримано всіх користувачів", users)
        );
    }

    @GetMapping("/getByUsername")
    public ResponseEntity<ServerResponse<?>> getByUsername(@RequestParam String username) {
        var user = userService.getByUsername(username);
        return ResponseEntity.ok(
                new ServerResponse<>(true,"Користувача знайдено", user)
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ServerResponse<?>> refresh(@RequestBody TokenDTO dto) {
        var newTokens = userService.refresh(dto.getToken());

        return ResponseEntity.ok(
                new ServerResponse<>(true,"Токен успішно оновлено", newTokens)
        );
    }

    @GetMapping("/getById")
    public ResponseEntity<ServerResponse<?>> getById(@RequestParam Long id){
        return ResponseEntity.status(HttpStatus.OK).body(new ServerResponse<>(true,"Успішно",userService.getById(id)));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ServerResponse<?>> forgotPassword(@RequestBody ForgotPasswordDTO dto){
        userService.forgotPassword(dto.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body(new ServerResponse<>(true, "На вказану почту відправлено лист якщо аккаунт знайдено", null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ServerResponse<?>> resetPassword(@RequestBody ResetPasswordDTO dto){
        userService.resetPassword(dto);
        return ResponseEntity.status(HttpStatus.OK).body(new ServerResponse<>(true, "Пароль успішно змінений", null));
    }

}

