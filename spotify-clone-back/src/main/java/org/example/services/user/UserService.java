package org.example.services.user;

import lombok.RequiredArgsConstructor;
import org.example.dtos.user.UserLoginDTO;
import org.example.dtos.user.UserRegisterDTO;
import org.example.dtos.user.UserResponseDTO;
import org.example.dtos.user.UserUpdateDTO;
import org.example.entities.user.UserEntity;
import org.example.mappers.user.UserMapper;
import org.example.repositories.role.IRoleRepository;
import org.example.repositories.song.ISongRepository;
import org.example.repositories.user.IUserRepository;
import org.example.services.jwt.JwtService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    private final UserImagesService userImagesService;
    private final ISongRepository songRepository;

    public Map<String, String> register(UserRegisterDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            return null;
        }
        var user = userMapper.fromRegisterDTO(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        var roleOpt = roleRepository.findByName("USER");
        if (roleOpt.isEmpty()) return null;
        var role = roleOpt.get();
        user.getRoles().add(role);
        userRepository.save(user);
        return jwtService.generateRefreshAccessTokens(user);
    }


    public Map<String, String> login(UserLoginDTO dto) {
        var userOptEmail = userRepository.findByEmail(dto.getLogin());
        var userOptUsername = userRepository.findByUsername(dto.getLogin());
        if (userOptEmail.isPresent()) {
            var user = userOptEmail.get();
            var password = user.getPassword();
            if (passwordEncoder.matches(dto.getPassword(), password)) {
                return jwtService.generateRefreshAccessTokens(user);
            } else {
                return null;
            }
        } else if (userOptUsername.isPresent()) {
            var user = userOptUsername.get();
            var password = user.getPassword();
            if (passwordEncoder.matches(dto.getPassword(), password)) {
                return jwtService.generateRefreshAccessTokens(user);
            } else {
                return null;
            }
        } else {
            return null;
        }

    }

    private UserEntity getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("AUTH AFTER FILTER: " + SecurityContextHolder.getContext().getAuthentication());
        if (authentication == null) return null;

        String email = authentication.getName();
        var userOpt = userRepository.findByEmail(email);
        return userOpt.orElse(null);

    }

    public boolean disable() {
        var user = getUser();
        if (user == null) return false;
        userRepository.deleteById(user.getId());
        return true;
    }

// паша
    public boolean update(UserUpdateDTO dto) {
        var user = getUser();
        if (user == null) return false;
        if (dto.getUsername() != null && !dto.getUsername().isEmpty()) {
            user.setUsername(dto.getUsername());
        }
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        if (dto.getUserImage() != null && !dto.getUserImage().isEmpty()) {
            var fileName = userImagesService.load(dto.getUserImage());
            user.setImage(fileName);
        }
        userRepository.save(user);
        return true;
    }

    public List<UserResponseDTO> getAll() {
        var users = userRepository.findAll();
        return userMapper.fromEntityList(users);
    }

    public UserResponseDTO getByUsername(String username) {
        var userOpt = userRepository.findByUsername(username);
        return userMapper.fromEntity(userOpt.orElse(null));
    }

    public Map<String, String> refresh(String refresh) {
        return jwtService.refreshAccessToken(refresh);
    }

    public boolean favoriteSong(Long id) {
        var user = getUser();
        if (user == null) return false;

        var songOpt = songRepository.findById(id);
        if (songOpt.isEmpty()) return false;
        var song = songOpt.get();
        var favorites = user.getFavoriteSongs();
        if (favorites.contains(song)) {
            favorites.remove(song);
        } else {
            user.getFavoriteSongs().add(song);
        }
        userRepository.save(user);
        return true;
    }

}
