package org.example.controllers.user;

import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.example.dtos.song.FavoriteSongDTO;
import org.example.dtos.token.TokenDTO;
import org.example.dtos.user.*;
import org.example.serverResponses.ServerResponse;
import org.example.serverResponses.user.AuthResponse;
import org.example.services.user.UserService;
import org.example.utils.MultipartFileEditor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(MultipartFile.class, new MultipartFileEditor());
    }
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

    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ServerResponse<String>> update(@ModelAttribute UserUpdateDTO dto){
        var success = userService.update(dto);
        if(success) return ResponseEntity.status(HttpStatus.OK).body(new ServerResponse<String>("Успішно оновлено користувача", null));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ServerResponse<String>("Сталася помилка при оновленні користувача",null));
    }

    @DeleteMapping("/disable")
    public ResponseEntity<ServerResponse<String>> disable(){
        var success = userService.disable();
        if(success) return ResponseEntity.status(HttpStatus.OK).body(new ServerResponse<String>("Аккаунт успішно виключено.",null));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ServerResponse<String>("Сталася помилка або ви не маєте прав на цю дію.",null));

    }

    @GetMapping("/getAll")
    public ResponseEntity<ServerResponse<List<GetAllUsersDTO>>> getAll(){
        var users = userService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(new ServerResponse<List<GetAllUsersDTO>>("Успішно отримано всіх користувачів.", users));
    }

    @GetMapping("/getByUsername")
    public ResponseEntity<ServerResponse<UserResponseDTO>> getByUsername(@RequestParam String username){
        var user = userService.getByUsername(username);
        if(user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ServerResponse<UserResponseDTO>("Користувача не знайдено",null));
        return ResponseEntity.status(HttpStatus.OK).body(new ServerResponse<UserResponseDTO>("Успішно",user));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody TokenDTO dto){
        var newTokens = userService.refresh(dto.getToken());
        return ResponseEntity.status(HttpStatus.OK).body(new AuthResponse("Успішно",newTokens));
    }

}

