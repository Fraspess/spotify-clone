package org.example.services.user;

import lombok.RequiredArgsConstructor;
import org.example.dtos.user.*;
import org.example.entities.user.UserEntity;
import org.example.mappers.user.UserMapper;
import org.example.repositories.role.IRoleRepository;
import org.example.repositories.song.ISongRepository;
import org.example.repositories.user.IUserRepository;
import org.example.services.jwt.JwtService;
import org.example.utils.AuthService;
import org.example.utils.ImagesService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {
    private final IUserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final IRoleRepository roleRepository;
    private final ImagesService userImagesService;
    private final AuthService authService;

    @Value("${user.images.dir}")
    private String uploadImgDir;

    public Map<String, String> register(UserRegisterDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Почта занята");
        }
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new IllegalArgumentException("Юзернейм вже зайнятий");
        }
        var user = userMapper.fromRegisterDTO(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        var role = roleRepository.findByName("USER").orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Нема ролі юзер????"));
        user.getRoles().add(role);
        userRepository.save(user);
        return jwtService.generateRefreshAccessTokens(user);
    }


    public Map<String, String> login(UserLoginDTO dto) {
        var userOpt = userRepository.findByEmail(dto.getLogin())
                .or(() -> userRepository.findByUsername(dto.getLogin()));
        var user = userOpt.orElseThrow(() -> new IllegalArgumentException("Невірний логін або пароль"));
        var password = user.getPassword();
        if (passwordEncoder.matches(dto.getPassword(), password)) {
            return jwtService.generateRefreshAccessTokens(user);
        } else {
            throw new IllegalArgumentException("Невірний логін або пароль");
        }
    }

    public void disable() {
        var user = authService.getUser();
        userRepository.deleteById(user.getId());
    }


    public void update(UserUpdateDTO dto) {
        var user = authService.getUser();

        if (dto.getUsername() != null && !dto.getUsername().isEmpty()) {
            user.setUsername(dto.getUsername());
        }
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        if (dto.getUserImage() != null && !dto.getUserImage().isEmpty()) {
            var fileName = userImagesService.load(dto.getUserImage(), uploadImgDir);
            user.setImage(fileName);
        }
        userRepository.save(user);
    }

    public List<GetAllUsersDTO> getAll() {
        var users = userRepository.findAll();
        return userMapper.fromEntityGetAll(users);
    }

    public UserResponseDTO getByUsername(String username) {
        var userOpt = userRepository.findByUsername(username);
        return userMapper.fromEntity(userOpt.orElseThrow(() -> new IllegalArgumentException("Юзера не знайдено")));
    }

    public UserResponseDTO getById(Long id){
        return userMapper.fromEntity(userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Юзера не знайдено")));
    }

    public Map<String, String> refresh(String refresh) {
        return jwtService.refreshAccessToken(refresh);
    }


    public Map<String,String> googleAuth(String email){
        var userOpt = userRepository.findByEmail(email);
        if(userOpt.isEmpty()){
            var newUser = new UserEntity();
            newUser.setEmail(email);
            newUser.setUsername(email.split("@")[0]);

            var userRole = roleRepository.findByName("USER").orElseThrow(() -> new IllegalArgumentException("Немає ролі юзер????"));
            newUser.getRoles().add(userRole);
            userRepository.save(newUser);
            return jwtService.generateRefreshAccessTokens(newUser);
        }else{
            var user = userOpt.get();
            return jwtService.generateRefreshAccessTokens(user);
        }

    }

}
